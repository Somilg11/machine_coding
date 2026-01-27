function debounce(fn, delay) {
    let timerId;
    return function(...args) {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

const search = (query) => {
    console.log(`Searching for ${query}`);
};

const searchWithDebounce = debounce(search, 1000);