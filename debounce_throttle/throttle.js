function throttle(fn, delay){
    let lastCall = 0;
    return function(...args){
        const now = Date.now();
        if(now - lastCall < delay){
            return;
        }
        lastCall = now;
        return fn.apply(this, args);
    }
}

function sendMessage(message){
    console.log("Sending message:", message);
}

const sendMessageThrottled = throttle(sendMessage, 2000);

sendMessageThrottled("Hello");
setTimeout(() => sendMessageThrottled("How are you?"), 500);
setTimeout(() => sendMessageThrottled("This is a throttled message."), 2500);
setTimeout(() => sendMessageThrottled("Goodbye!"), 3000);
