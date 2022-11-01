# longitude

```js
// usage
chance.longitude()
chance.longitude({fixed: 7})
```

Generate a random longitude.

```js
chance.longitude();
=> 149.41549
```

_range: -180 to 180_

By default includes 5 fixed digits after decimal, can specify otherwise.

```js
chance.longitude({fixed: 7});
=> 51.4549925
```

By default includes entire range of allowed longitudes, can specify a min and/or max to bound it

```js
chance.longitude({min: -78, max: -77});
=> -77.22644
```
