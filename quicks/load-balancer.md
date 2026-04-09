# ⚖️ Nginx Load Balancing: Architecture Notes

### 📌 Overview
Node.js processes are single-threaded. To maximize hardware utilization on multi-core machines (or across multiple physical servers), multiple instances of the backend application must be deployed. Nginx acts as a Load Balancer to efficiently distribute incoming traffic across these instances, preventing any single instance from being overwhelmed.



---

### ⚙️ Why Nginx over Node.js `cluster`?
While the native Node.js `cluster` module can spawn multiple workers to utilize CPU cores, it is restricted to a **single machine**. 

Nginx is required when scaling horizontally across **multiple machines or virtual machines**, serving as the central traffic router for your entire distributed system.

---

### 🛠️ Nginx Configuration (`nginx.conf`)

#### 1. Define the Upstream Fleet
The `upstream` block defines the pool of backend servers available to handle requests.

```nginx
http {
    upstream backend_fleet {
        server app1:4500;
        server app2:4501;
        server app3:4502;
    }

    server {
        listen 80;
        
        location / {
            # Route incoming traffic to the fleet
            proxy_pass http://backend_fleet;
        }
    }
}
```
*(Note: In a Docker environment, use the container service name, e.g., `app1`, instead of `localhost` to avoid network isolation issues).*

---

### 🔀 Load Balancing Algorithms
Nginx supports multiple distribution strategies, which can be defined within the `upstream` block:

* **Round Robin (Default):** Distributes requests sequentially (`1 → 2 → 3 → 1`). Ideal for identical servers with similar hardware.
* **Least Connections:** Routes traffic to the server currently handling the fewest active connections.
  ```nginx
  upstream backend_fleet {
      least_conn;
      server app1:4500;
      server app2:4501;
  }
  ```
* **IP Hash (Sticky Sessions):** Maps a client's IP address to a specific server. Critical if your architecture relies on local server memory for session storage, ensuring the user always hits the server where their session lives.
  ```nginx
  upstream backend_fleet {
      ip_hash;
      server app1:4500;
      server app2:4501;
  }
  ```

---

### 🎛️ Advanced Server Directives
You can append parameters directly to the server definitions for fine-grained control over your fleet:

* **Weights (`weight=N`):** Sends a proportionally higher amount of traffic to servers with better hardware.
  > `server app1:4500 weight=5;` *(This server receives 5x more traffic than default servers).*
* **Backup (`backup`):** Places the server in standby mode. It will only receive traffic if all primary servers fail.
  > `server app3:4502 backup;`
* **Maintenance (`down`):** Marks the server as permanently offline, immediately removing it from the load balancing rotation without deleting the config.
  > `server app2:4501 down;`

---

### ⚠️ Common Pitfalls: `502 Bad Gateway`
A `502 Bad Gateway` error means Nginx received the client request but could not reach the upstream backend service. 

**Common cause in Docker:** Developers often configure `proxy_pass http://localhost:4500;`. However, `localhost` inside the Nginx container refers to the Nginx container itself, not the host machine or the backend container. You must use the backend container's DNS/service name (e.g., `http://app1:4500;`).