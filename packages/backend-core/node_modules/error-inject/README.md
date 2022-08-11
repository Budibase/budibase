error-inject
============

inject an error listener into a stream

## Install

```
npm install error-inject
```

## Usage


```js
var inject = require('error-inject');

function error(err) {
  console.error(err);
}

var rs = fs.createReadStream('index.js');
inject(rs, err);
```

## License
MIT
