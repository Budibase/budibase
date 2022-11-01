# floating

```js
// usages
chance.floating()
chance.floating({ fixed: 7 })
chance.floating({ min: 0, max: 100 })
```
<p class="pullquote">I wanted to use float or double as the method name but both are JS reserved words even though they aren't really used...</p>

Return a random floating point number.

```js
chance.floating();
=> -211920142886.5024
```

By default it will return a fixed number of at most 4 digits after the decimal.

Note: *at most* 4 digits. This because, unless we returned trailing zeroes
(which aren't allowed on the JavaScript float) we can't guarantee 4 digits after
the decimal. So if random chance comes back with `82383854.2000` then
`82383854.2` is what will be returned.

To retrieve a set number of fixed digits after the decimal, provide it as an option.

```js
chance.floating({ fixed: 7 });
=> -749512327.7447168
```

As with other number functions, can include a min and/or max.

```js
chance.floating({ min: 0, max: 100 });
=> 31.9021
```

Or combine them.

```js
chance.floating({ min: 0, max: 100, fixed: 8 });
=> 45.92367599
```
