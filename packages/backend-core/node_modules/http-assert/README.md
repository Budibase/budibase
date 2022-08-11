# http-assert

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][ci-image]][ci-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Assert with status codes. Like ctx.throw() in Koa, but with a guard.

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install http-assert
```

## Example
```js
var assert = require('http-assert')
var ok = require('assert')

var username = 'foobar' // username from request

try {
  assert(username === 'fjodor', 401, 'authentication failed')
} catch (err) {
  ok(err.status === 401)
  ok(err.message === 'authentication failed')
  ok(err.expose)
}
```

## API

The API of this module is intended to be similar to the
[Node.js `assert` module](https://nodejs.org/dist/latest/docs/api/assert.html).

Each function will throw an instance of `HttpError` from
[the `http-errors` module](https://www.npmjs.com/package/http-errors)
when the assertion fails.

### assert(value, [status], [message], [properties])

Tests if `value` is truthy. If `value` is not truthy, an `HttpError`
is thrown that is constructed with the given `status`, `message`,
and `properties`.

### assert.deepEqual(a, b, [status], [message], [properties])

Tests for deep equality between `a` and `b`. Primitive values are
compared with the Abstract Equality Comparison (`==`). If `a` and `b`
are not equal, an `HttpError` is thrown that is constructed with the
given `status`, `message`, and `properties`.

### assert.equal(a, b, [status], [message], [properties])

Tests shallow, coercive equality between `a` and `b` using the Abstract
Equality Comparison (`==`). If `a` and `b` are not equal, an `HttpError`
is thrown that is constructed with the given `status`, `message`,
and `properties`.

### assert.fail([status], [message], [properties])

Always throws an `HttpError` that is constructed with the given `status`,
`message`, and `properties`.

### assert.notDeepEqual(a, b, [status], [message], [properties])

Tests for deep equality between `a` and `b`. Primitive values are
compared with the Abstract Equality Comparison (`==`). If `a` and `b`
are equal, an `HttpError` is thrown that is constructed with the given
`status`, `message`, and `properties`.

### assert.notEqual(a, b, [status], [message], [properties])

Tests shallow, coercive equality between `a` and `b` using the Abstract
Equality Comparison (`==`). If `a` and `b` are equal, an `HttpError` is
thrown that is constructed with the given `status`, `message`, and
`properties`.

### assert.notStrictEqual(a, b, [status], [message], [properties])

Tests strict equality between `a` and `b` as determined by the SameValue
Comparison (`===`). If `a` and `b` are equal, an `HttpError` is thrown
that is constructed with the given `status`, `message`, and `properties`.

### assert.ok(value, [status], [message], [properties])

Tests if `value` is truthy. If `value` is not truthy, an `HttpError`
is thrown that is constructed with the given `status`, `message`,
and `properties`.

### assert.strictEqual(a, b, [status], [message], [properties])

Tests strict equality between `a` and `b` as determined by the SameValue
Comparison (`===`). If `a` and `b` are not equal, an `HttpError`
is thrown that is constructed with the given `status`, `message`,
and `properties`.

## Licence

[MIT](LICENSE)

[ci-image]: https://badgen.net/github/checks/jshttp/http-assert/master?label=ci
[ci-url]: https://github.com/jshttp/http-assert/actions?query=workflow%3Aci
[coveralls-image]: https://badgen.net/coveralls/c/github/jshttp/http-assert/master
[coveralls-url]: https://coveralls.io/r/jshttp/http-assert?branch=master
[node-version-image]: https://badgen.net/npm/node/http-assert
[node-version-url]: https://nodejs.org/en/download
[npm-downloads-image]: https://badgen.net/npm/dm/http-assert
[npm-url]: https://npmjs.org/package/http-assert
[npm-version-image]: https://badgen.net/npm/v/http-assert
