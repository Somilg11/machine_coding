class LRUCache{
    constructor(capacity){
        this.length = 0;
        this.capacity = capacity;
        this.map = new Map(); // Key : <Node Address>
        this.head = null;
        this.tail = null;
    }

    #removeNode(node){
        if(!node) return;
        if(node.prev) node.prev.next = node.next;
        if(node.next) node.next.prev = node.prev;

        if(node === this.head) this.head = node.next;
        if(node === this.tail)this.tail = node.prev;

        node.prev = node.next = null;
    }

    #addToHead(node) {
        node.next = this.head;
        node.prev = null;

        if (this.head) this.head.prev = node;
        this.head = node;

        if (!this.tail) this.tail = node;
    }

    get(key){
        if(!this.map.has(key)) return null;
        const node = this.map.get(key);
        this.#removeNode(node);
        this.#addToHead(node);

        return node.value;
    }

    put(key, value){
        // check if we have capacity 
        if(this.length === this.capacity){
            if(!this.map.has(key)){
                this.#removeNode(this.tail);
                this.map.delete(this.tail.key);
                this.length -= 1;
            }
        }
        // case: if key already in cache store
        if(this.map.has(key)){
            // 1. remove the older node 
            this.#removeNode(this.map.get(key))
            this.map.delete(key);
            this.length -= 1;
        }

        const node = {
            next: this.head,
            prev: null,
            key,
            value,
        };
        this.#addToHead(node);
        this.map.set(key, node);

        this.length += 1;
    }

    debug(){
        let curr = this.head;
        const arr = [];
        while(curr!=null){
            arr.push(curr);
            curr = curr.next;
        }
        return arr.reduce((acc, cur) => acc.concat(`-->[ [${cur.key}]: [${cur.value}] ]-->`), ''); 
    }
}

const cache = new LRUCache(3);
cache.put(1, 10);
cache.put(2, 30);
console.log(cache.get(1));
cache.put(3, 30);
cache.put(4, 40);


console.log(cache.debug());