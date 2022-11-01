# latitude

```js
// usage
chance.latitude()
chance.latitude({fixed: 7})
```

Generate a random latitude.

```js
chance.latitude();
=> 57.99514
```

_range: -90 to 90_

By default includes 5 fixed digits after decimal, can specify otherwise.

```js
chance.latitude({fixed: 7});
=> -29.6443133
```

By default includes entire range of allowed latitudes, can specify a min and/or max to bound it

```js
chance.latitude({min: 38.7, max: 38.9});
=> 38.82358
```
