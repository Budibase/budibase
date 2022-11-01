# depth

```js
// usage
chance.depth()
chance.depth({ fixed: 2 })
chance.depth({ min: -1000 })
```

Generate a random depth, in meters. Depths are always negative

```js
chance.depth()
=> -2126.95039
```

By default, includes 5 digits of accuracy after the decimal. Can override with the `fixed` option.

```js
chance.depth({ fixed: 2 })
=> -1542.11
```

By default, maximum (or minimum depending on your frame of reference) depth of -2550 (depth of the Mariana Trench), but this can be overridden with the `min` option.

```js
chance.depth({ min: -1000 })
=> -718.41976
```
