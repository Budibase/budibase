# abstract-leveldown

> An abstract prototype matching the [`leveldown`](https://github.com/level/leveldown/) API. Useful for extending [`levelup`](https://github.com/level/levelup) functionality by providing a replacement to `leveldown`.

[![level badge][level-badge]](https://github.com/level/awesome)
[![npm](https://img.shields.io/npm/v/abstract-leveldown.svg)](https://www.npmjs.com/package/abstract-leveldown)
[![Travis](https://travis-ci.org/Level/abstract-leveldown.svg?branch=master)](http://travis-ci.org/Level/abstract-leveldown)
[![david](https://david-dm.org/Level/abstract-leveldown.svg)](https://david-dm.org/level/abstract-leveldown)
[![npm](https://img.shields.io/npm/dm/abstract-leveldown.svg)](https://www.npmjs.com/package/abstract-leveldown)

`abstract-leveldown` provides a simple, operational *noop* base prototype that's ready for extending. By default, all operations have sensible "noops" (operations that essentially do nothing). For example, simple operations such as `.open(callback)` and `.close(callback)` will simply invoke the callback (on a *next tick*). More complex operations  perform sensible actions, for example: `.get(key, callback)` will always return a `'NotFound'` `Error` on the callback.

You add functionality by implementing the underscore versions of the operations. For example, to implement a `put()` operation you add a `_put()` method to your object. Each of these underscore methods override the default *noop* operations and are always provided with **consistent arguments**, regardless of what is passed in by the client.

Additionally, all methods provide argument checking and sensible defaults for optional arguments. All bad-argument errors are compatible with `leveldown` (they pass the `leveldown` method arguments tests). For example, if you call `.open()` without a callback argument you'll get an `Error('open() requires a callback argument')`. Where optional arguments are involved, your underscore methods will receive sensible defaults. A `.get(key, callback)` will pass through to a `._get(key, options, callback)` where the `options` argument is an empty object.

## Example

A simplistic in-memory `leveldown` replacement

```js
var util = require('util')
var AbstractLevelDOWN = require('./').AbstractLevelDOWN

// constructor, passes through the 'location' argument to the AbstractLevelDOWN constructor
function FakeLevelDOWN (location) {
  AbstractLevelDOWN.call(this, location)
}

// our new prototype inherits from AbstractLevelDOWN
util.inherits(FakeLevelDOWN, AbstractLevelDOWN)

// implement some methods

FakeLevelDOWN.prototype._open = function (options, callback) {
  // initialise a memory storage object
  this._store = {}
  // optional use of nextTick to be a nice async citizen
  process.nextTick(function () { callback(null, this) }.bind(this))
}

FakeLevelDOWN.prototype._put = function (key, value, options, callback) {
  key = '_' + key // safety, to avoid key='__proto__'-type skullduggery
  this._store[key] = value
  process.nextTick(callback)
}

FakeLevelDOWN.prototype._get = function (key, options, callback) {
  var value = this._store['_' + key]
  if (value === undefined) {
    // 'NotFound' error, consistent with LevelDOWN API
    return process.nextTick(function () { callback(new Error('NotFound')) })
  }
  process.nextTick(function () {
    callback(null, value)
  })
}

FakeLevelDOWN.prototype._del = function (key, options, callback) {
  delete this._store['_' + key]
  process.nextTick(callback)
}

// Now use it with levelup

var levelup = require('levelup')

var db = levelup(new FakeLevelDOWN('/who/cares'))

db.put('foo', 'bar', function (err) {
  if (err) throw err
  db.get('foo', function (err, value) {
    if (err) throw err
    console.log('Got foo =', value)
  })
})
```

See [`memdown`](https://github.com/Level/memdown/) if you are looking for a complete in-memory replacement for `leveldown`.

## Extensible API

Remember that each of these methods, if you implement them, will receive exactly the number and order of arguments described. Optional arguments will be converted to sensible defaults.

### AbstractLevelDOWN(location)
### AbstractLevelDOWN#status

An `AbstractLevelDOWN` based database can be in one of the following states:

* `'new'` - newly created, not opened or closed
* `'opening'` - waiting for the database to be opened
* `'open'` - successfully opened the database, available for use
* `'closing'` - waiting for the database to be closed
* `'closed'` - database has been successfully closed, should not be used

### AbstractLevelDOWN#_open(options, callback)
### AbstractLevelDOWN#_close(callback)
### AbstractLevelDOWN#_get(key, options, callback)
### AbstractLevelDOWN#_put(key, value, options, callback)
### AbstractLevelDOWN#_del(key, options, callback)
### AbstractLevelDOWN#_batch(array, options, callback)

If `batch()` is called without arguments or with only an options object then it should return a `Batch` object with chainable methods. Otherwise it will invoke a classic batch operation.

### AbstractLevelDOWN#_chainedBatch()

By default a `batch()` operation without arguments returns a blank `AbstractChainedBatch` object. The prototype is available on the main exports for you to extend. If you want to implement chainable batch operations then you should extend the `AbstractChaindBatch` and return your object in the `_chainedBatch()` method.

### AbstractLevelDOWN#_approximateSize(start, end, callback)
### AbstractLevelDOWN#_serializeKey(key)
### AbstractLevelDOWN#_serializeValue(value)
### AbstractLevelDOWN#_iterator(options)

By default an `iterator()` operation returns a blank `AbstractIterator` object. The prototype is available on the main exports for you to extend. If you want to implement iterator operations then you should extend the `AbstractIterator` and return your object in the `_iterator(options)` method.

`AbstractIterator` implements the basic state management found in LevelDOWN. It keeps track of when a `next()` is in progress and when an `end()` has been called so it doesn't allow concurrent `next()` calls, it does allow `end()` while a `next()` is in progress and it doesn't allow either `next()` or `end()` after `end()` has been called.

### AbstractIterator(db)

Provided with the current instance of `AbstractLevelDOWN` by default.

### AbstractIterator#_next(callback)
### AbstractIterator#_end(callback)

### AbstractChainedBatch
Provided with the current instance of `AbstractLevelDOWN` by default.

### AbstractChainedBatch#_put(key, value)
### AbstractChainedBatch#_del(key)
### AbstractChainedBatch#_clear()
### AbstractChainedBatch#_write(options, callback)
### AbstractChainedBatch#_serializeKey(key)
### AbstractChainedBatch#_serializeValue(value)

### isLevelDown(db)

Returns `true` if `db` has the same public api as `abstract-leveldown`, otherwise `false`. This is a utility function and it's not part of the extensible api.

<a name="contributing"></a>
Contributing
------------

`abstract-leveldown` is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [contribution guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

<a name="license"></a>
License &amp; Copyright
-------------------

Copyright &copy; 2013-2017 `abstract-leveldown` [contributors](https://github.com/level/community#contributors).

`abstract-leveldown` is licensed under the MIT license. All rights not explicitly granted in the MIT license are reserved. See the included `LICENSE.md` file for more details.

[level-badge]: http://leveldb.org/img/badge.svg
