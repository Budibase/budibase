# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog][changelog].

## 5.0.0

Support of keys & values other than strings and Buffers has been dropped. Internally `level-js` now stores keys & values as binary which solves a number of compatibility issues ([Level/memdown#186](https://github.com/Level/memdown/issues/186)). If you pass in a key or value that isn't a string or Buffer, it will be irreversibly stringified.

Existing IndexedDB databases created with `level-js@4` can be read only if they used binary keys and string or binary values. Other types will come out stringified, and string keys will sort incorrectly. Use the included `upgrade()` utility to convert stored data to binary (in so far the environment supports it):

```js
var leveljs = require('level-js')
var db = leveljs('my-db')

db.open(function (err) {
  if (err) throw err

  db.upgrade(function (err) {
    if (err) throw err
  })
})
```

Or with (the upcoming release of) `level`:

```js
var level = require('level')
var reachdown = require('reachdown')
var db = level('my-db')

db.open(function (err) {
  if (err) throw err

  reachdown(db, 'level-js').upgrade(function (err) {
    if (err) throw err
  })
})
```

## 4.0.0

This is an upgrade to `abstract-leveldown@6` which solves long-standing issues around serialization and type support.

### Range options are now serialized

Previously, range options like `lt` were passed through as-is by `abstract-leveldown`, unlike keys. For `level-js` it means that Buffers and arrays, if not supported by the environment (e.g. Microsoft Edge), will be stringified.

### The rules for range options have been relaxed

Because `null`, `undefined`, zero-length strings and zero-length buffers are significant types in encodings like `bytewise` and `charwise`, they became valid as range options in `abstract-leveldown`. This means `db.iterator({ gt: undefined })` is not the same as `db.iterator({})`.

In the case of `level-js`, when used by itself, the aforementioned change means that `db.iterator({ gt: undefined })` will throw an error as `undefined` is not a valid IndexedDB key type. On the other hand `db.iterator({ gt: '' })` is valid and thus now supported. For details on sort order (which is richer than in `leveldown`) please see [the readme](README.md).

### Nullish values are rejected

In addition to rejecting `null` and `undefined` as _keys_, `abstract-leveldown` now also rejects these types as _values_, due to preexisting significance in streams and iterators.

### Zero-length array keys are rejected

Though this was already the case (both in IndexedDB and `abstract-leveldown`), `abstract-leveldown` has replaced the behavior with an explicit `Array.isArray()` check and a new error message.

### Boolean and `NaN` keys (as well as range options) are rejected

Previously, for compliance with `abstract-leveldown` tests that have since been removed, they were stringified. As of `level-js@4` they are rejected (by IndexedDB).

### Added mobile browser support

iPhone and Android `latest` are now officially supported. At the time of writing that's iPhone 12.0 and Android 7.1 (note that's Chrome for Android, not the old stock browser). Older versions (iPhone 10+ and Android 6+) did pass our tests but are not included in the test matrix going forward. Feel free to open an issue if you need/want these versions to be supported.

### The value of `iterator#db` has changed

Though this was undocumented and only for internal use, the `db` property on an iterator pointed to an `IDBDatabase`. To comply with `abstract-leveldown` the `db` property now points to the `level-js` instance that created that iterator.

## 3.0.0

This release brings `level-js` up to par with latest [`levelup`][levelup] (v2), [`abstract-leveldown`][abstract-leveldown] (v5) and IndexedDB Second Edition. It targets modern `browserify` preferring [`Buffer`][buffer] over `ArrayBuffer`. Lastly, [`IDBWrapper`][idbwrapper] has been replaced with straight IndexedDB code.

### Usage with [`levelup`][levelup]

Usage has changed to:

```js
const levelup = require('levelup')
const leveljs = require('leveljs')

const db = levelup(leveljs('mydb'))
```

From the old:

```js
const db = levelup('mydb', { db: leveljs })
```

Friendly reminder: encodings have moved from [`levelup`][levelup] to [`encoding-down`][encoding-down]. To get identical functionality to `levelup < 2` please use the [`level-browserify`][level-browserify] convenience package or wrap `level-js` with `encoding-down`:

```js
const encode = require('encoding-down')
const db = levelup(encode(leveljs('mydb')))
```

### New database prefix

The default prefix of the [`IDBDatabase`][idbdatabase] name has changed from `IDBWrapper-` to `level-js-`. To access databases created using `level-js < 3`, pass a custom prefix to the `level-js` constructor:

```js
const db = levelup(leveljs('mydb', { prefix: 'IDBWrapper-' }))
```

### Browser support

As a result of removing [`IDBWrapper`][idbwrapper], only modern browsers with a non-prefixed `window.indexedDB` are supported in this release. The current test matrix of `level-js` includes the latest versions of Chrome, Firefox, Safari, Edge and IE.

:fire: Internet Explorer 10 is no longer supported.

### Type support

All value types of the [structured clone algorithm][structured-clone-algorithm] and all key types of IndexedDB Second Edition are now supported. This means you can store almost any JavaScript type without the need for [`encoding-down`][encoding-down]. In addition, you can use [`Buffer`][buffer] for both keys and values. For details and caveats please see the [readme][readme].

### No backpressure

In `level-js`, iterators are powered by IndexedDB cursors. To fulfill [`abstract-leveldown`][abstract-leveldown] snapshot guarantees (reads not being affected by simultaneous writes) cursors are started immediately and continuously read from, filling an in-memory cache.

Though `level-js` now passes the full [`abstract-leveldown`][abstract-leveldown] test suite, fulfilling the snapshot guarantee means a loss of backpressure. Memory consumption might increase if an iterator is not consumed fast enough. A future release will have an option to favor backpressure over snapshot guarantees.

### Removed `raw` option

Because `level-js` no longer stringifies values, the `raw` option (which bypassed conversion) became unnecessary and has been removed. If you use [`level-browserify`][level-browserify] or [`levelup`][levelup] with [`encoding-down`][encoding-down], you can store and retrieve raw values (as returned by IndexedDB) using the `id` encoding. Please refer to the [readme][readme] for an example.

### New `destroy()` function signature

Previously, a `level-js` instance could be passed to `destroy()`:

```js
leveljs.destroy(db, callback)
```

This was useful to destroy a database that used a custom prefix. The new signature is `destroy(location[, prefix], callback)`.

### Strict `.batch(array)`

The upgrade to [`abstract-leveldown`][abstract-leveldown] comes with a [breaking change](https://github.com/Level/abstract-leveldown/commit/a2621ad70571f6ade9d2be42632ece042e068805) for the array version of `.batch()`. This change ensures all elements in the batch array are objects. If you previously passed arrays to `.batch()` that contained `undefined` or `null`, they would be silently ignored. Now this will produce an error.

[readme]: README.md

[changelog]: CHANGELOG.md

[buffer]: https://nodejs.org/api/buffer.html

[idbwrapper]: https://www.npmjs.com/package/idb-wrapper

[abstract-leveldown]: https://github.com/Level/abstract-leveldown

[levelup]: https://github.com/Level/levelup

[encoding-down]: https://github.com/Level/encoding-down

[level-browserify]: https://github.com/Level/level-browserify

[idbdatabase]: https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase

[structured-clone-algorithm]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
