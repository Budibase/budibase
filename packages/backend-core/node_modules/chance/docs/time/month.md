# month

```js
// usage
chance.month()
```

Generate a random month.

```js
chance.month();
=> 'January'
```

By default, returns just the full name.

Optionally specify raw to get the whole month object consisting of name,
short_name, and numeric.

```js
chance.month({raw: true});
=> {name: 'October', short_name: 'Oct', numeric: '10'}
```
