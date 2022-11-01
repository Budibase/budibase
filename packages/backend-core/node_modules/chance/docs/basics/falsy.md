# bool

```js
    // usages
    chance.falsy()
    chance.falsy({ pool: [ NaN, undefined ] })
```
Return a random falsy value (`false`, `null`, `undefined`, `0`, `NaN`, `''`).


```js
chance.falsy();
=> false
```

The default pool can be change to better meet the needs:


```js
chance.falsy({ pool: [ NaN, undefined ] });
=> NaN
```


