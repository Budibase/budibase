# dollar

```js
// usage
chance.dollar()
chance.dollar({max: 250})
```

<p class="pullquote" data-pullquote="Dolla, dolla, bill ya'll" markdown="1"></p>

Return a random dollar amount.

```js
chance.dollar();
=> "$2560.27"

chance.dollar();
=> "$750.99"
```

By default returns dollar amount no larger than 10000. Optionally specify
the max to make it larger (or smaller).

```js
chance.dollar({max: 20});
=> "$15.23"

chance.dollar({max: 10000000})
=> "$5051205.49"
```
