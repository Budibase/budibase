# geohash

```js
// usage
chance.geohash()
chance.geohash({ length: 5 })
```

Generate a random geohash. [More details on what a geohash is](http://en.wikipedia.org/wiki/Geohash).

```js
chance.geohash()
=> 'h9xhn7y'
```

By default, includes 7 characters of accuracy. Can override with the `length` option.

```js
chance.geohash({ length: 5 })
=> 'dr0kr'
```
