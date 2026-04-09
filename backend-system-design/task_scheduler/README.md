## Implement a Task Scheduler with Concurrency Control

```js
class TaskScheduler{
    constructor(limit){
        // code here
    }

    addTask(task){
        // code here
    }
}

const scheduler = new TaskScheduler(2);
scheduler.addTask(
    () => new Promise((res) => setTimeout(() => res('Task1'), 1000))
);
scheduler.addTask(
    () => new Promise((res) => setTimeout(() => res('Task2'), 500))
);
scheduler.addTask(
    () => new Promise((res) => setTimeout(() => res('Task3'), 300))
);
scheduler.addTask(
    () => new Promise((res) => setTimeout(() => res('Task4'), 400))
);

// only two tasks should run in parallel
```