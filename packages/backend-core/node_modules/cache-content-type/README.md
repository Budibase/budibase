## cache-content-type

The same as [mime-types](https://github.com/jshttp/mime-types)'s contentType method, but with result cached.

### Install

```bash
npm i cache-content-type
```

### Usage

```js
const getType = require('cache-content-type');
const contentType = getType('html');
assert(contentType === 'text/html; charset=utf-8');
```
