# natural

```js
// usage
chance.natural()
chance.natural({ min: 1, max: 20 })
```

Return a natural number.

_range: 0 to 9007199254740991_

```js
  chance.natural();
  => 125019392395
```

Can optionally provide min and max.

```js
chance.natural({min: 1, max: 20});
=> 14
```

Can optionally provide numbers you wish to exclude.

```js
chance.natural({min: 1, max: 5, exclude: [1, 3]});
=> 2
```

These are inclusive, so they are included in the range. This means
```chance.natural({min: 1, max: 3});``` would return either 1, 2, or 3 or:

```js
// Specific case
1 <= random number <= 3

// General case
min <= random number <= max
```


[Natural Number on Wikipedia][natural]

[natural]: https://en.wikipedia.org/wiki/Natural_number

