# unique

```js
// usage
chance.unique(chance.state, 5)
chance.unique(chance.state, 5, { comparator: func })
```

Provide any function that generates random stuff (usually another **Chance** function) and a number and `unique()` will generate a random array of unique (not repeating) items with a length matching the one you specified.

```js
chance.unique(chance.state, 5);
=> ["SC", "WA", "CO", "TX", "ND"]
```

This is helpful when there are a limited number of options and you want a bunch but want to ensure each is different.

Optionally specify the comparator used to determine whether a generated item is in the list of already generated items. By default the comparator just checks to see if the newly generated item is in the array of already generated items. This works for most simple cases (such as `chance.state()`) but will not work if the generated item is an object (because the `Array.prototype.indexOf()` method will not work on an object since 2 objects will not be strictly equal, `===`, unless they are references to the same object).

```js
chance.unique(chance.currency, 2, {
comparator: function(err, val) {
return arr.reduce(function(acc, item) {
return acc || (item.code === val.code);
}, false);
}
});
=> [{ code: "KYF", name: "Cayman Islands Dollar" }, { code: "CDF", name: "Congo/Kinshasa Franc" }]
```

You can also specify any arbitrary options in this third argument and they'll be passed along to the method you specify as the first.

For example, let's say you want to retrieve 10 unique integers between 0 and 100. This is easily achievable by specifying `chance.integer` as hte function, 10 as the number to retrieve, and a min/max in the options.

```js
chance.unique(chance.integer, 10, {min: 0, max: 100});
=> [78, 49, 7, 87, 59, 89, 84, 62, 60, 63]
```

Note, there could be cases where it is impossible to generate the unique number. For example, if you choose `chance.state` as shown above as the random function and want say, 55 uniques, **Chance** will throw a RangeError because it is impossible to generate 55 uniques because there are only 51 states in the available pool (50 states plus the District of Columbia).

```js
chance.unique(chance.state, 55);
=> RangeError: Chance: num is likely too large for sample set
```


