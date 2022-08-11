#Introduction

Extremely fast [double-ended queue](http://en.wikipedia.org/wiki/Double-ended_queue) implementation. Double-ended queue can also be used as a:

- [Stack](http://en.wikipedia.org/wiki/Stack_\(abstract_data_type\))
- [Queue](http://en.wikipedia.org/wiki/Queue_\(data_structure\))

The implementation is GC and CPU cache friendly [circular buffer](http://en.wikipedia.org/wiki/Circular_buffer). [It will run circles around any "linked list" implementation](#performance).

Every queue operation is done in constant `O(1)` - including random access from `.get()`.

#Topics

- [Quick start](#quick-start)
- [Why not use an Array?](#why-not-use-an-array)
- [Using double-ended queue as a normal queue](#using-double-ended-queue-as-a-normal-queue)
- [API reference and examples](#api)
- [Performance](#performance)

#Quick start

    npm install double-ended-queue

```js
var Deque = require("double-ended-queue");

var deque = new Deque([1,2,3,4]);
deque.shift(); //1
deque.pop(); //4
```

#Why not use an Array?

Arrays take linear `O(N)` time to do `shift` and `unshift` operations. That means in theory that an array with 1000 items is 1000x slower to do those operations than a deque with 1000 items. 10000x slower with 10000 items and so on.

V8 implements [a trick for small arrays](https://code.google.com/p/v8/issues/detail?id=3059) where these operations are done in constant time, however even with this trick deque is still 4x faster.

But arrays use "native" methods, they must be faster!

In V8, there is almost no advantage for a method to be a built-in. In fact many times built-ins are at a severe disadvantage of having to implement far more complex semantics than is actually needed in practice. For example, sparse array handling punishes almost every built-in array method even though nobody uses sparse arrays as is evidenced by the popularity of the underscore library which doesn't handle sparse arrays in the same way across different browsers.

#Using double-ended queue as a normal queue

Queue is a more commonly needed data structure however a separate implementation does not provide any advantage in terms of performance. Aliases are provided specifically for the queue use-case. You may use `.enqueue(items...)` to enqueue item(s) and `.dequeue()` to dequeue an item.

#API

- [`new Deque()`](#new-deque---deque)
- [`new Deque(Array items)`](#new-dequearray-items---deque)
- [`new Deque(int capacity)`](#new-dequeint-capacity---deque)
- [`push(dynamic items...)`](#pushdynamic-items---int)
- [`unshift(dynamic items...)`](#unshiftdynamic-items---int)
- [`pop()`](#pop---dynamic)
- [`shift()`](#shift---dynamic)
- [`toArray()`](#toarray---array)
- [`peekBack()`](#peekback---dynamic)
- [`peekFront()`](#peekfront---dynamic)
- [`get(int index)`](#getint-index---dynamic)
- [`isEmpty()`](#isempty---boolean)
- [`clear()`](#clear---void)

#####`new Deque()` -> `Deque`

Creates an empty double-ended queue with initial capacity of 16. If you know the optimal size before-hand, use [`new Deque(int capacity)`](#new-dequeint-capacity---deque).

```js
var deque = new Deque();
deque.push(1, 2, 3);
deque.shift(); //1
deque.pop(); //3
```

<hr>

#####`new Deque(Array items)` -> `Deque`

Creates a double-ended queue from `items`.

```js
var deque = new Deque([1,2,3,4]);
deque.shift(); //1
deque.pop(); //4
```

<hr>

#####`new Deque(int capacity)` -> `Deque`

Creates an empty double-ended queue with the given `capacity`. `Capacity` should be the maximum amount of items the queue will hold at a given time.

The reason to give an initial capacity is to avoid potentially expensive resizing operations at runtime.

```js
var deque = new Deque(100);
deque.push(1, 2, 3);
deque.shift(); //1
deque.pop(); //3
```

<hr>

#####`push(dynamic items...)` -> `int`

Push items to the back of this queue. Returns the amount of items currently in the queue after the operation.

```js
var deque = new Deque();
deque.push(1);
deque.pop(); //1
deque.push(1, 2, 3);
deque.shift(); //1
deque.shift(); //2
deque.shift(); //3
```

**Aliases:** `enqueue`, `insertBack`

<hr>

#####`unshift(dynamic items...)` -> `int`

Unshift items to the front of this queue. Returns the amount of items currently in the queue after the operation.

```js
var deque = new Deque([2,3]);
deque.unshift(1);
deque.toString(); //"1,2,3"
deque.unshift(-2, -1, 0);
deque.toString(); //"-2,-1,0,1,2,3"
```

**Aliases:** `insertFront`

<hr>


#####`pop()` -> `dynamic`

Pop off the item at the back of this queue.

Note: The item will be removed from the queue. If you simply want to see what's at the back of the queue use [`peekBack()`](#peekback---dynamic) or [`.get(-1)`](#getint-index---dynamic).

If the queue is empty, `undefined` is returned. If you need to differentiate between `undefined` values in the queue and `pop()` return value -
check the queue `.length` before popping.

```js
var deque = new Deque([1,2,3]);
deque.pop(); //3
deque.pop(); //2
deque.pop(); //1
deque.pop(); //undefined
```

**Aliases:** `removeBack`

<hr>

#####`shift()` -> `dynamic`

Shifts off the item at the front of this queue.

Note: The item will be removed from the queue. If you simply want to see what's at the front of the queue use [`peekFront()`](#peekfront---dynamic) or [`.get(0)`](#getint-index---dynamic).

If the queue is empty, `undefined` is returned. If you need to differentiate between `undefined` values in the queue and `shift()` return value -
check the queue `.length` before shifting.

```js
var deque = new Deque([1,2,3]);
deque.shift(); //1
deque.shift(); //2
deque.shift(); //3
deque.shift(); //undefined
```

**Aliases:** `removeFront`, `dequeue`

<hr>

#####`toArray()` -> `Array`

Returns the items in the queue as an array. Starting from the item in the front of the queue and ending to the item at the back of the queue.

```js
var deque = new Deque([1,2,3]);
deque.push(4);
deque.unshift(0);
deque.toArray(); //[0,1,2,3,4]
```

**Aliases:** `toJSON`

<hr>

#####`peekBack()` -> `dynamic`

Returns the item that is at the back of this queue without removing it.

If the queue is empty, `undefined` is returned.

```js
var deque = new Deque([1,2,3]);
deque.push(4);
deque.peekBack(); //4
```

<hr>

#####`peekFront()` -> `dynamic`

Returns the item that is at the front of this queue without removing it.

If the queue is empty, `undefined` is returned.

```js
var deque = new Deque([1,2,3]);
deque.push(4);
deque.peekFront(); //1
```

<hr>

#####`get(int index)` -> `dynamic`

Returns the item that is at the given `index` of this queue without removing it.

The index is zero-based, so `.get(0)` will return the item that is at the front, `.get(1)` will return
the item that comes after and so on.

The index can be negative to read items at the back of the queue. `.get(-1)` returns the item that is at the back of the queue,
`.get(-2)` will return the item that comes before and so on.

Returns `undefined` if `index` is not a valid index into the queue.

```js
var deque = new Deque([1,2,3]);
deque.get(0); //1
deque.get(1); //2
deque.get(2); //3

deque.get(-1); //3
deque.get(-2); //2
deque.get(-3); //1
```

**Note**: Even though indexed accessor (e.g. `queue[0]`) could *appear* to return a correct value *sometimes*, this is completely unreliable. The numeric slots
of the deque object are internally used as an optimization and have no meaningful order or meaning to outside. Always use `.get()`.

**Note**: The implementation has O(1) random access using `.get()`.

<hr>

#####`isEmpty()` -> `boolean`

Return `true` if this queue is empty, `false` otherwise.

```js
var deque = new Deque();
deque.isEmpty(); //true
deque.push(1);
deque.isEmpty(); //false
```

<hr>

#####`clear()` -> `void`

Remove all items from this queue. Does not change the queue's capacity.

```js
var deque = new Deque([1,2,3]);
deque.toString(); //"1,2,3"
deque.clear();
deque.toString(); //""
```
<hr>

#Performance

Clone the repo and `npm install`. Then run the `bench` script.

##1000 items in the queue

    double-ended-queue x 15,532,714 ops/sec ±0.19% (96 runs sampled)
    built-in array x 6,501,398 ops/sec ±0.87% (95 runs sampled)
    node-deque x 2,938,068 ops/sec ±3.50% (68 runs sampled)

##2 million items in the queue

    double-ended-queue x 14,425,547 ops/sec ±0.17% (94 runs sampled)
    node-deque x 2,815,628 ops/sec ±10.56% (76 runs sampled)
    built-in array x 19.23 ops/sec ±0.35% (51 runs sampled)

Noteworthy is just how bad the degradation can be for built-in array when V8 cannot use the trick.
