
# type

  Type assertions aka less-broken `typeof`.

## Example

```js
var type = require('type');

var obj = new Date;
if (type(obj) == 'date') ...
```

## API

```js
type(new Date) == 'date'
type({}) == 'object'
type(null) == 'null'
type(undefined) == 'undefined'
type("hey") == 'string'
type(true) == 'boolean'
type(false) == 'boolean'
type(12) == 'number'
type(type) == 'function'
type(/asdf/) == 'regexp'
type((function(){ return arguments })()) == 'arguments'
type([]) == 'array'
type(document.createElement('div')) == 'element'
type(NaN) == 'nan'
type(new Error('Ups! Something wrong...')) == 'error'
type(new Buffer) == 'buffer'
```

## License

  MIT
