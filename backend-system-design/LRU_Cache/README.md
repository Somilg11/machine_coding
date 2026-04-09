
### What is an LRU Cache?
An LRU (Least Recently Used) Cache is a data structure with a fixed capacity. When the capacity is reached and a new item needs to be added, the cache must remove (evict) the item that was accessed least recently.

#### Key Goal: 
All operations—get(key) and put(key, value)—must ideally be performed in O(1) time complexity.

### The Winning Data Structure: Hash Map + Doubly Linked List
To achieve O(1) for both lookups and updates, we combine two structures:

- Hash Map: Provides O(1) access to any item using its key. The value in the map is a reference (address) to a node in the linked list.

- Doubly Linked List (DLL): Maintains the order of usage.

- Head: Represents the Most Recently Used (MRU) item.

- Tail: Represents the Least Recently Used (LRU) item.

- Why Doubly?: It allows us to remove a node in O(1) because we have immediate access to both its prev and next pointers.

### Algorithm Logic

#### put(key, value):

- If the key already exists, remove the existing node.

- If the cache is at capacity (and it's a new key), remove the item at the Tail (the LRU item) and delete it from the Hash Map.

- Create a new node and insert it at the Head (making it the MRU).

#### get(key):

- If the key is not in the map, return null.

- If it exists, "refresh" the item: Remove the node from its current position and move it to the Head.

- Return the node's value.

#### Starter Code
```
class LRUCache{
    constructor(capacity){
        // code here
    }

    get(key){
        // code here
    }

    put(key, value){
        // code here
    }
}
```