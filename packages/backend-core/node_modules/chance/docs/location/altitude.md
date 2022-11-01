# altitude

```js
// usage
chance.altitude()
chance.altitude({ fixed: 7 })
chance.altitude({ max: 1000 })
```

Generate a random altitude, in meters.

```js
chance.altitude()
=> 1863.21417
```

By default, includes 5 digits of accuracy after the decimal. Can override with the `fixed` option.

```js
chance.altitude({ fixed: 7 })
=> 6897.8978386
```

By default, max of 8848m (height of Mount Everest), but this can be overridden with the `max` option.

```js
chance.altitude({ max: 1000 })
=> 890.20665
```
