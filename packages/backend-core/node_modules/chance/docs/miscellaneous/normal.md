# normal

```js
// usage
chance.normal()
chance.normal({mean: 100})
chance.normal({mean: 100, dev: 15})
```

Return a normally-distributed random variate.

```js
chance.normal()
=> 0.4244767651300604
```

By default this starts with a mean of `0` and a standard deviation of `1` which
is the standard normal distribution.

Optionally specify a mean and/or deviation.

```js
// Notice, since no deviation was specified, using the default of `1`
chance.normal({mean: 100})
=> 99.68352269988522

// For example, to get a random IQ (which by definition has a mean of 100
// and a standard deviation of 15)
chance.normal({mean: 100, dev: 15})
=> 85.11040121833615
```

Used in combination with the above generators, this can be an extremely powerful
way to get more realistic results as often "pure random" results fail to
approximate the real world.
