# integer

```js
// usage
chance.integer()
chance.integer({ min: -20, max: 20 })
```

<p class="pullquote">9007199254740991 is 2^53 - 1 and is the largest number value in JavaScript</p>

Return a random integer.

_range: -9007199254740991 to 9007199254740991_

See: [Largest number in JavaScript](http://vq.io/16qnIYj)

```js
chance.integer();
=> -1293235
```

Can optionally provide min and max.

```js
chance.integer({ min: -20, max: 20 })
=> -7
```


These min and max are inclusive, so they are included in the range. This means
```js
chance.integer({ min: -2, max: 2 })
``` 
would return either -2, -1, 0, 1, or 2.

```js
// Specific case
-2 <= random number <= 2

// General case
min <= random number <= max
```
