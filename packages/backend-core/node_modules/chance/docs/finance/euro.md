# euro

```js
// usage
chance.euro()
chance.euro({max: 250})
```

Return a random euro amount. Formatting depends on the current locale (samples are displayed with european formatting)

```js
chance.euro();
=> "2.560,27€"

chance.euro();
=> "750.99€"
```

By default returns euro amount no larger than 10000. Optionally specify
the max to make it larger (or smaller).

```js
chance.euro({max: 20});
=> "15,23€"

chance.euro({max: 10000000})
=> "5.051.205,49€"
```
