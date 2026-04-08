# System Architecture: Scaling WebSockets

### Overview
WebSockets provide persistent, real-time two-way communication. Unlike HTTP polling, they prevent redundant requests. However, they are resource-intensive and break easily at high scale. 



---

### 1. The Memory Bottleneck
WebSockets consume significant RAM even when idle. 
* **TCP Socket:** ~1 KB
* **Send/Receive Buffers:** 4–6 KB
* **Library Object (e.g., Socket.io):** 2–5 KB
* **App/Session State:** Variable
* **Total:** ~20–100 KB per connection.
* **Scale Impact:** 100,000 idle connections = **2 GB to 10 GB RAM**.

---

### 2. Horizontal Scaling & The Backplane
Adding servers behind a Load Balancer introduces a new problem: **Cross-Server Messaging**. 
If User A (Server 1) messages User B (Server 2), the connection drops because Server 1 does not know User B.

**Solution: The Backplane (Message Broker)**
Use a pub/sub broker to bridge servers. NATS is preferred over Redis/Kafka because it is strictly a high-speed pub/sub router capable of 10 million msgs/sec.



```javascript
// Server 1 (Publisher)
nats.publish("room:user2", "Hello User 2!");

// Server 2 (Subscriber)
nats.subscribe("room:user2", (msg) => {
    socket.to(user2).emit("message", msg);
});
```

---

### 3. Load Balancing WebSockets
Choosing the right Load Balancer strategy is critical.

* ❌ **Least Connections:** Flawed. 1,000 idle connections use less CPU than 100 highly active ones. 
* ❌ **IP Hash:** Irrelevant unless strict sticky sessions are required.
* ✅ **Round Robin:** Effectively distributes load at scale due to the **Law of Large Numbers**. Over thousands of connections, random distribution averages out evenly.

---

### 4. "Hot Rooms" & The CPU Bottleneck
In group chats (Rooms), one message requires a **Fan-Out** broadcast. 
The server must deserialize the payload, serialize it repeatedly, and write it to multiple sockets. This shifts the bottleneck from RAM to **CPU**.

**CPU Load Estimation Formula:**
> `Sum of (Messages per sec in room × Number of users in room)`

---

### 5. The Thundering Herd Problem
When a server crashes, thousands of clients instantly attempt to reconnect. This massive TCP handshake spike can crash remaining servers.

**Solution: Connection Jittering**
Implement random delays on the client-side before reconnecting.

```javascript
// Client-side Connection Jittering
const randomDelay = Math.floor(Math.random() * 5000); // 0-5 seconds

setTimeout(() => {
    socket.connect();
}, randomDelay);
```

---

### 6. Real-World Load Test Results
Using Caddy (Load Balancer), Node.js, and NATS:
* **Peak Load:** 10,000 concurrent connections smoothly handled.
* **Throughput:** 19.3 million fan-out messages processed.
* **Resilience:** 100% recovery rate against simulated server crashes (Thundering Herd mitigated) with ~3s P99 latency.