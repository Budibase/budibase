# bool

```js
    // usages
    chance.bool()
    chance.bool({ likelihood: 30 })
```
Return a random boolean value (`true` or `false`).

```js
chance.bool();
=> true
```

The default likelihood of success (returning `true`) is 50%.
Can optionally specify the likelihood in percent:

```js
chance.bool({likelihood: 30});
=> false
```

In this case only a 30% likelihood of `true`, and a 70% likelihood of `false`.

