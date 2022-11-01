# coordinates

```js
// usage
chance.coordinates()
chance.coordinates({fixed: 2})
```

Generate random coordinates, which are latitude and longitude, comma separated.

```js
chance.coordinates();
=> "-29.52974, 24.52815"
```

By default includes 5 fixed digits after decimal, can specify otherwise.

```js
chance.coordinates({fixed: 2});
=> "-49.16, 68.81"
```

