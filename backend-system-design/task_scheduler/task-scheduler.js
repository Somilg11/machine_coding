class TaskScheduler{
    constructor(concurrency){
        this.concurrency = Number(concurrency);
        this.runningTasks = 0;
        this.__waitingQueue = [];
    }

    getNextTask(){
        if(this.runningTasks < this.concurrency && this.__waitingQueue.length > 0){
            const nextTask = this.__waitingQueue.shift();
            nextTask();
        }
    }

    addTask(task){
        return new Promise((resolve, reject) => {
            async function __taskRunner(){
                this.runningTasks += 1;
                try {
                    const result = await task();
                    console.log("Task completed with result:", result);
                    resolve(result);
                } catch (error) {
                    console.error("Error executing task:", error);
                    reject(error);
                } finally {
                    this.runningTasks -= 1;
                    this.getNextTask();
                }
            }
            if(this.runningTasks < this.concurrency){
                __taskRunner.call(this);
            } else {
                this.__waitingQueue.push(__taskRunner.bind(this));
            }
        })
    }
}

const scheduler = new TaskScheduler(3);
scheduler.addTask(
    () => new Promise((res) => setTimeout(() => res('Task1'), 2*1000))
);
scheduler.addTask(
    () => new Promise((res) => setTimeout(() => res('Task2'), 2*1000))
);
scheduler.addTask(
    () => new Promise((res) => setTimeout(() => res('Task3'), 2*1000))
);
scheduler.addTask(
    () => new Promise((res) => setTimeout(() => res('Task4'), 2*1000))
);