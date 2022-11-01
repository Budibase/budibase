# year

```js
// usage
chance.year()
chance.year({min: 1900, max: 2100})
```

Generate a random year

```js
chance.year();
=> '2053'
```

By default, min is the current year and max is 100 years greater than min.

This is returned as a string. If for some reason you need it numeric, just
parse it:

```js
parseInt(chance.year());
=> 2042
```

Optionally specify min, max, or both to limit the range.

```js
chance.year({min: 1900, max: 2100});
=> '1983'
```
