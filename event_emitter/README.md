## Event Emitter

```js
class MyEventEmitter {
    constructor(){
        // code here
    }
    on(event, listener){
        // code here
    }
    emit(event, listener){
        // code here
    }
    off(event, listener){
        // code here
    }
    once(event, listener){
        // code here
    }
}

const emitter = new MyEventEmitter();
const greet = (name) => console.log(`Hello, ${name}`);
emitter.on("greet", greet);
emitter.emit("greet", "Alice"); // Hello, Alice
emitter.off("greet", greet);
emitter.emit("greet", "Bob"); // No output
```