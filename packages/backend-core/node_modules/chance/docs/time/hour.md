# hour

```js
// usage
chance.hour()
chance.hour({twentyfour: true})
```

Generate a random hour

```js
chance.hour();
=> 9
```

By default, returns an hour from 1 to 12 for a standard [12-hour clock][12h].

Can optionally specify a full twenty-four.

```js
chance.hour({twentyfour: true});
=> 21
```

This will return an hour from 1 to 24.

[12h]: https://en.wikipedia.org/wiki/12-hour_clock
