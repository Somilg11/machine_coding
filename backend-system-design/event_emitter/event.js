class MyEventEmitter {
    constructor(){
        this.__event_listeners = {}
    }
    on(event, listener){
        if(!this.__event_listeners[event]){
            this.__event_listeners[event] = [];
        }
        this.__event_listeners[event].push(listener);
        return true;
    }
    emit(event, ...args){
        if(!this.__event_listeners[event]){
            return false;
        }
        const listeners = this.__event_listeners[event];
        listeners.forEach((listener) => {
            listener(...args);
        });
    }
    off(event, listener){
        if(!this.__event_listeners[event]){
            return false;
        }
        const index = this.__event_listeners[event].indexOf(listener);
        if(index < 0){
            return false;
        }
        this.__event_listeners[event].splice(index, 1);
        return true;
    }
    once(event, listener){
        const wrapperFn = (...args) => {
            listener(...args);
            this.off(event, wrapperFn);
        };
        this.on(event, wrapperFn);
        return true;
    }
}

const e = new MyEventEmitter();

const sendSMS = (username) => console.log("Sending SMS to", username);

e.on('user:signup', (username) => console.log("User Signup"));
e.on('user:signup', (username) => console.log("Sending Email to", username));
e.once('user:signup', sendSMS);
e.on('user:logout', (username) => console.log("User Logout"));

e.emit('user:signup', '@somilgupta');
e.emit('user:signup', '@somilgupta-1');

e.off('user:signup', sendSMS);

e.emit('user:signup', '@somilgupta-2');

e.emit('user:logout', '@somilgupta');
