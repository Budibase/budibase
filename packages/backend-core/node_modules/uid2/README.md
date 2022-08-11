# uid2

[![NPM version](https://badge.fury.io/js/uid2.svg)](http://badge.fury.io/js/uid2)

Generate unique ids. Pass in a `length` and it returns a `string`.


## Installation

    npm install uid2

## Examples

Without a callback it is synchronous:

```js
uid(10)
// => "hbswt489ts"
```

With a callback it is asynchronous:

```js
uid(10, function (err, id) {
  if (err) throw err;
  // id => "hbswt489ts"
});
```

## License

MIT
