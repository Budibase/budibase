# prime

```js
// usage
chance.prime()
chance.prime({ min: 1, max: 20 })
```

Return a prime number.

_default range: 0 to 10000_

```js
  chance.prime();
  => 929
```

Can optionally provide min and max.

```js
chance.prime({min: 1, max: 20});
=> 13
```


These are inclusive, so they are included in the range. This means
```chance.prime({min: 2, max: 5});``` would return either 2, 3, or 5 or:

```js
// Specific case
2 <= random number <= 5

// General case
min <= random number <= max
```


[Prime Number on Wikipedia][prime]

[prime]: https://en.wikipedia.org/wiki/Prime_number

