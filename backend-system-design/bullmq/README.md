# bullmq example

This folder contains a small example using BullMQ with a producer and a worker.

Redis connection
- Both `producer.js` and `worker.js` read the Redis connection URL from the environment variable `REDIS_URL`.
- If `REDIS_URL` is not set, they fall back to `redis://127.0.0.1:6379`.

Example:

```bash
export REDIS_URL=redis://:mypassword@redis-host:6379/0
node producer.js
node worker.js
```

### Redis cmds
```
brew services start redis
redis-cli ping
brew services stop redis
```