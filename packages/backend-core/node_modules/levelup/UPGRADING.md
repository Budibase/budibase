# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## v4

There have been two major updates to dependencies. First, `level-iterator-stream` is now based on [`readable-stream@3`](https://github.com/nodejs/readable-stream#version-3xx). Second, `deferred-leveldown` is now based on [`abstract-leveldown@6`](https://github.com/Level/abstract-leveldown/blob/master/UPGRADING.md#v6). Please follow these links for more information; both contain significant enough changes to warrant this `levelup` major. In addition, all aforementioned dependencies and by extension `levelup` have dropped support of IE10. 

To get a consistent behavior between opening and opened `levelup` instances (in the former case, your store will be wrapped with `deferred-leveldown`), we recommend to pair `levelup@4` only with a store based on `abstract-leveldown` >= 6. For example, `deferred-leveldown` now rejects `null` and `undefined` values. If you pair `levelup@4` with an older store, `db.put('key', null)` would only throw an error if `db` is still opening itself.

## v3

1. Dropped support for node 4.
2. Batch operations no longer default to `'put'`. If `type` isn't specified, an error will be thrown, courtesy of `abstract-leveldown`.

## v2

### Summary

There has been quite some work done for this new major version:

1. Make `levelup` more generic by reducing focus on [`leveldown`](https://github.com/Level/leveldown) and [`LevelDB`](https://github.com/google/leveldb).
2. Make `levelup` more generic by removing code related to encodings, which would allow \*down implementations to manage encodings themselves.
3. Use [`standard`](https://github.com/standard/standard) as linter to avoid bikeshedding.
4. Add a native `Promise` API for promise using geeks. Many have been asking for this. Also `async/await` is awesome. Breaking change: previously, if you did not pass a callback to an async function and there was an error, `levelup` would emit an `error` event instead. This is no longer true.

Point `1` and `2` also helps out with reducing complexity.

### Upgrade Guide

Since `levelup` no longer tries to load `leveldown` as a default backend you have to provide a backend instance yourself.

So if you previously did:

```
$ npm i levelup leveldown --save
```

And in your code you did something like:

```js
const levelup = require('levelup')
const db = levelup('/path/to/db')
```

You should now do (for identical functionality):

```js
const levelup = require('levelup')
const encode = require('encoding-down')
const leveldown = require('leveldown')
const db = levelup(encode(leveldown('/path/to/db')))
```

Note that we have moved out encodings into [`encoding-down`](https://github.com/level/encoding-down), which in itself is a \*down that wraps a \*down (meta ftw). It basically just sits in between `levelup` and the _actual_ backend to operate on encodings for keys and values. Default encoding is `'utf8'` like before.

This obviously means everyone has to do a lot of code rewrite which is bad. So we aim to fix this by putting that code into [`level@2.0.0`](https://github.com/level/level), which already is used as a convenience package.

Switching from `levelup` and `leveldown` combo to only using `level` you would do:

```js
const level = require('level')
const db = level('/path/to/db')
```

Also, we aim to simplify using `memdown` in the same way by updating `level-mem`.

For more advanced usage with custom versions of `abstract-leveldown`, the first parameter to `levelup()` should be an `abstract-leveldown` instead of passing a factory function via `options.db`.

So if you previously did:

```js
const db = levelup('/path/to/db', {
  db: function (location) {
    return new CustomLevelDOWN(location)
  }
})
```

You should now do (for identical functionality):

```js
const encode = require('encoding-down')
const db = levelup(encode(new CustomLevelDOWN('/path/to/db')))
```
