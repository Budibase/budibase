# level

> Fast & simple storage. A Node.js-style `LevelDB` wrapper for Node.js, Electron and browsers.

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/level.svg?label=&logo=npm)](https://www.npmjs.com/package/level)
[![Node version](https://img.shields.io/node/v/level.svg)](https://www.npmjs.com/package/level)
[![Travis](https://img.shields.io/travis/com/Level/level.svg?logo=travis&label=)](https://travis-ci.com/Level/level)
[![AppVeyor](https://img.shields.io/appveyor/ci/Level/level.svg?logo=appveyor&label=)](https://ci.appveyor.com/project/Level/level)
[![Coverage Status](https://coveralls.io/repos/github/Level/level/badge.svg)](https://coveralls.io/github/Level/level)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dm/level.svg?label=dl)](https://www.npmjs.com/package/level)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## Table of Contents

<details><summary>Click to expand</summary>

- [Introduction](#introduction)
- [Usage](#usage)
- [Supported Platforms](#supported-platforms)
- [API](#api)
- [Promise Support](#promise-support)
- [Events](#events)
- [Contributing](#contributing)
- [Donate](#donate)
- [License](#license)

</details>

## Introduction

This is a convenience package that:

- exports a function that returns a [`levelup`](https://github.com/Level/levelup#ctor) instance when invoked
- bundles the current release of [`leveldown`][leveldown] and [`level-js`][level-js]
- leverages encodings using [`encoding-down`][encoding-down].

Use this package to avoid having to explicitly install `leveldown` or `level-js` when you just want to use `levelup`. It uses `leveldown` in Node.js or Electron and `level-js` in browsers (when bundled by [`browserify`](https://github.com/browserify/browserify), [`webpack`](https://webpack.js.org/), [`rollup`](https://rollupjs.org/) or similar). For a quick start, visit [`browserify-starter`](https://github.com/Level/browserify-starter) or [`webpack-starter`](https://github.com/Level/webpack-starter). Note: `rollup` currently fails to properly resolve the [`browser`](package.json) field.

## Usage

**If you are upgrading:** please see [`UPGRADING.md`](UPGRADING.md).

```js
var level = require('level')

// 1) Create our database, supply location and options.
//    This will create or open the underlying store.
var db = level('my-db')

// 2) Put a key & value
db.put('name', 'Level', function (err) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error

  // 3) Fetch by key
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found

    // Ta da!
    console.log('name=' + value)
  })
})
```

## Supported Platforms

At the time of writing, `level` works in Node.js 8+ and Electron 3+ on Linux, Mac OS, Windows and FreeBSD, including any future Node.js and Electron release thanks to [N-API](https://nodejs.org/api/n-api.html), including ARM platforms like Raspberry Pi and Android, as well as in Chrome, Firefox, IE 11, Edge, Safari, iPhone and Chrome for Android. For details, see [Supported Platforms](https://github.com/Level/leveldown#supported-platforms) of `leveldown` and [Browser Support](https://github.com/Level/level-js#browser-support) of `level-js`.

Binary values are supported across the board; in browsers that support [IndexedDB Second Edition](https://www.w3.org/TR/IndexedDB-2/) (like Chrome and Firefox) you can also use binary keys.

If you want to use [Promises](#promise-support), you will need a polyfill like [`pinkie`](https://github.com/floatdrop/pinkie) in older browsers like IE.

## API

For options specific to [`leveldown`][leveldown] and [`level-js`][level-js] ("underlying store" from here on out), please see their respective READMEs.

- <a href="#ctor"><code><b>level()</b></code></a>
- <a href="#supports"><code>db.<b>supports</b></code></a>
- <a href="#open"><code>db.<b>open()</b></code></a>
- <a href="#close"><code>db.<b>close()</b></code></a>
- <a href="#put"><code>db.<b>put()</b></code></a>
- <a href="#get"><code>db.<b>get()</b></code></a>
- <a href="#del"><code>db.<b>del()</b></code></a>
- <a href="#batch"><code>db.<b>batch()</b></code></a> _(array form)_
- <a href="#batch_chained"><code>db.<b>batch()</b></code></a> _(chained form)_
- <a href="#isOpen"><code>db.<b>isOpen()</b></code></a>
- <a href="#isClosed"><code>db.<b>isClosed()</b></code></a>
- <a href="#createReadStream"><code>db.<b>createReadStream()</b></code></a>
- <a href="#createKeyStream"><code>db.<b>createKeyStream()</b></code></a>
- <a href="#createValueStream"><code>db.<b>createValueStream()</b></code></a>
- <a href="#iterator"><code>db.<b>iterator()</b></code></a>
- <a href="#clear"><code>db.<b>clear()</b></code></a>

<a name="ctor"></a>

### `db = level(location[, options[, callback]])`

The main entry point for creating a new `levelup` instance.

- `location` is a string pointing to the LevelDB location to be opened or in browsers, the name of the [`IDBDatabase`](https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase) to be opened.
- `options` is passed on to the underlying store.
- `options.keyEncoding` and `options.valueEncoding` are passed to [`encoding-down`][encoding-down], default encoding is `'utf8'`

Calling `level('my-db')` will also open the underlying store. This is an asynchronous operation which will trigger your callback if you provide one. The callback should take the form `function (err, db) {}` where `db` is the `levelup` instance. If you don't provide a callback, any read & write operations are simply queued internally until the store is fully opened.

This leads to two alternative ways of managing a `levelup` instance:

```js
level(location, options, function (err, db) {
  if (err) throw err

  db.get('foo', function (err, value) {
    if (err) return console.log('foo does not exist')
    console.log('got foo =', value)
  })
})
```

Versus the equivalent:

```js
// Will throw if an error occurs
var db = level(location, options)

db.get('foo', function (err, value) {
  if (err) return console.log('foo does not exist')
  console.log('got foo =', value)
})
```

The constructor function has a `.errors` property which provides access to the different error types from [`level-errors`](https://github.com/Level/errors#api). See example below on how to use it:

```js
level('my-db', { createIfMissing: false }, function (err, db) {
  if (err instanceof level.errors.OpenError) {
    console.log('failed to open database')
  }
})
```

Note that `createIfMissing` is an option specific to [`leveldown`][leveldown].

<a name="supports"></a>

### `db.supports`

A read-only [manifest](https://github.com/Level/supports). Not [widely supported yet](https://github.com/Level/community/issues/83). Might be used like so:

```js
if (!db.supports.permanence) {
  throw new Error('Persistent storage is required')
}

if (db.supports.bufferKeys && db.supports.promises) {
  await db.put(Buffer.from('key'), 'value')
}
```

<a name="open"></a>

### `db.open([callback])`

Opens the underlying store. In general you should never need to call this method directly as it's automatically called by <a href="#ctor"><code>levelup()</code></a>.

However, it is possible to _reopen_ the store after it has been closed with <a href="#close"><code>close()</code></a>, although this is not generally advised.

If no callback is passed, a promise is returned.

<a name="close"></a>

### `db.close([callback])`

<code>close()</code> closes the underlying store. The callback will receive any error encountered during closing as the first argument.

You should always clean up your `levelup` instance by calling `close()` when you no longer need it to free up resources. A store cannot be opened by multiple instances of `levelup` simultaneously.

If no callback is passed, a promise is returned.

<a name="put"></a>

### `db.put(key, value[, options][, callback])`

<code>put()</code> is the primary method for inserting data into the store. Both `key` and `value` can be of any type as far as `levelup` is concerned.

- `options` is passed on to the underlying store
- `options.keyEncoding` and `options.valueEncoding` are passed to [`encoding-down`][encoding-down], allowing you to override the key- and/or value encoding for this `put` operation.

If no callback is passed, a promise is returned.

<a name="get"></a>

### `db.get(key[, options][, callback])`

<code>get()</code> is the primary method for fetching data from the store. The `key` can be of any type. If it doesn't exist in the store then the callback or promise will receive an error. A not-found err object will be of type `'NotFoundError'` so you can `err.type == 'NotFoundError'` or you can perform a truthy test on the property `err.notFound`.

```js
db.get('foo', function (err, value) {
  if (err) {
    if (err.notFound) {
      // handle a 'NotFoundError' here
      return
    }
    // I/O or other error, pass it up the callback chain
    return callback(err)
  }

  // .. handle `value` here
})
```

- `options` is passed on to the underlying store.
- `options.keyEncoding` and `options.valueEncoding` are passed to [`encoding-down`][encoding-down], allowing you to override the key- and/or value encoding for this `get` operation.

If no callback is passed, a promise is returned.

<a name="del"></a>

### `db.del(key[, options][, callback])`

<code>del()</code> is the primary method for removing data from the store.

```js
db.del('foo', function (err) {
  if (err)
    // handle I/O or other error
});
```

- `options` is passed on to the underlying store.
- `options.keyEncoding` is passed to [`encoding-down`][encoding-down], allowing you to override the key encoding for this `del` operation.

If no callback is passed, a promise is returned.

<a name="batch"></a>

### `db.batch(array[, options][, callback])` _(array form)_

<code>batch()</code> can be used for very fast bulk-write operations (both _put_ and _delete_). The `array` argument should contain a list of operations to be executed sequentially, although as a whole they are performed as an atomic operation inside the underlying store.

Each operation is contained in an object having the following properties: `type`, `key`, `value`, where the _type_ is either `'put'` or `'del'`. In the case of `'del'` the `value` property is ignored. Any entries with a `key` of `null` or `undefined` will cause an error to be returned on the `callback` and any `type: 'put'` entry with a `value` of `null` or `undefined` will return an error.

```js
var ops = [
  { type: 'del', key: 'father' },
  { type: 'put', key: 'name', value: 'Yuri Irsenovich Kim' },
  { type: 'put', key: 'dob', value: '16 February 1941' },
  { type: 'put', key: 'spouse', value: 'Kim Young-sook' },
  { type: 'put', key: 'occupation', value: 'Clown' }
]

db.batch(ops, function (err) {
  if (err) return console.log('Ooops!', err)
  console.log('Great success dear leader!')
})
```

- `options` is passed on to the underlying store.
- `options.keyEncoding` and `options.valueEncoding` are passed to [`encoding-down`][encoding-down], allowing you to override the key- and/or value encoding of operations in this batch.

If no callback is passed, a promise is returned.

<a name="batch_chained"></a>

### `db.batch()` _(chained form)_

<code>batch()</code>, when called with no arguments will return a `Batch` object which can be used to build, and eventually commit, an atomic batch operation. Depending on how it's used, it is possible to obtain greater performance when using the chained form of `batch()` over the array form.

```js
db.batch()
  .del('father')
  .put('name', 'Yuri Irsenovich Kim')
  .put('dob', '16 February 1941')
  .put('spouse', 'Kim Young-sook')
  .put('occupation', 'Clown')
  .write(function () { console.log('Done!') })
```

**`batch.put(key, value)`**

Queue a _put_ operation on the current batch, not committed until a `write()` is called on the batch.

This method may `throw` a `WriteError` if there is a problem with your put (such as the `value` being `null` or `undefined`).

**`batch.del(key)`**

Queue a _del_ operation on the current batch, not committed until a `write()` is called on the batch.

This method may `throw` a `WriteError` if there is a problem with your delete.

**`batch.clear()`**

Clear all queued operations on the current batch, any previous operations will be discarded.

**`batch.length`**

The number of queued operations on the current batch.

**`batch.write([options][, callback])`**

Commit the queued operations for this batch. All operations not _cleared_ will be written to the underlying store atomically, that is, they will either all succeed or fail with no partial commits.

- `options` is passed on to the underlying store.
- `options.keyEncoding` and `options.valueEncoding` are not supported here.

If no callback is passed, a promise is returned.

<a name="isOpen"></a>

### `db.isOpen()`

A `levelup` instance can be in one of the following states:

- _"new"_     - newly created, not opened or closed
- _"opening"_ - waiting for the underlying store to be opened
- _"open"_    - successfully opened the store, available for use
- _"closing"_ - waiting for the store to be closed
- _"closed"_  - store has been successfully closed, should not be used

`isOpen()` will return `true` only when the state is "open".

<a name="isClosed"></a>

### `db.isClosed()`

`isClosed()` will return `true` only when the state is "closing" _or_ "closed", it can be useful for determining if read and write operations are permissible.

<a name="createReadStream"></a>

### `db.createReadStream([options])`

Returns a [Readable Stream](https://nodejs.org/docs/latest/api/stream.html#stream_readable_streams) of key-value pairs. A pair is an object with `key` and `value` properties. By default it will stream all entries in the underlying store from start to end. Use the options described below to control the range, direction and results.

```js
db.createReadStream()
  .on('data', function (data) {
    console.log(data.key, '=', data.value)
  })
  .on('error', function (err) {
    console.log('Oh my!', err)
  })
  .on('close', function () {
    console.log('Stream closed')
  })
  .on('end', function () {
    console.log('Stream ended')
  })
```

You can supply an options object as the first parameter to `createReadStream()` with the following properties:

- `gt` (greater than), `gte` (greater than or equal) define the lower bound of the range to be streamed. Only entries where the key is greater than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same.

- `lt` (less than), `lte` (less than or equal) define the higher bound of the range to be streamed. Only entries where the key is less than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries streamed will be the same.

- `reverse` _(boolean, default: `false`)_: stream entries in reverse order. Beware that due to the way that stores like LevelDB work, a reverse seek can be slower than a forward seek.

- `limit` _(number, default: `-1`)_: limit the number of entries collected by this stream. This number represents a _maximum_ number of entries and may not be reached if you get to the end of the range first. A value of `-1` means there is no limit. When `reverse=true` the entries with the highest keys will be returned instead of the lowest keys.

- `keys` _(boolean, default: `true`)_: whether the results should contain keys. If set to `true` and `values` set to `false` then results will simply be keys, rather than objects with a `key` property. Used internally by the `createKeyStream()` method.

- `values` _(boolean, default: `true`)_: whether the results should contain values. If set to `true` and `keys` set to `false` then results will simply be values, rather than objects with a `value` property. Used internally by the `createValueStream()` method.

Legacy options:

- `start`: instead use `gte`

- `end`: instead use `lte`

Underlying stores may have additional options.

<a name="createKeyStream"></a>

### `db.createKeyStream([options])`

Returns a [Readable Stream](https://nodejs.org/docs/latest/api/stream.html#stream_readable_streams) of keys rather than key-value pairs. Use the same options as described for <a href="#createReadStream"><code>createReadStream</code></a> to control the range and direction.

You can also obtain this stream by passing an options object to `createReadStream()` with `keys` set to `true` and `values` set to `false`. The result is equivalent; both streams operate in [object mode](https://nodejs.org/docs/latest/api/stream.html#stream_object_mode).

```js
db.createKeyStream()
  .on('data', function (data) {
    console.log('key=', data)
  })

// same as:
db.createReadStream({ keys: true, values: false })
  .on('data', function (data) {
    console.log('key=', data)
  })
```

<a name="createValueStream"></a>

### `db.createValueStream([options])`

Returns a [Readable Stream](https://nodejs.org/docs/latest/api/stream.html#stream_readable_streams) of values rather than key-value pairs. Use the same options as described for <a href="#createReadStream"><code>createReadStream</code></a> to control the range and direction.

You can also obtain this stream by passing an options object to `createReadStream()` with `values` set to `true` and `keys` set to `false`. The result is equivalent; both streams operate in [object mode](https://nodejs.org/docs/latest/api/stream.html#stream_object_mode).

```js
db.createValueStream()
  .on('data', function (data) {
    console.log('value=', data)
  })

// same as:
db.createReadStream({ keys: false, values: true })
  .on('data', function (data) {
    console.log('value=', data)
  })
```

<a name="iterator"></a>

### `db.iterator([options])`

Returns an [`abstract-leveldown` iterator](https://github.com/Level/abstract-leveldown/#iterator), which is what powers the readable streams above. Options are the same as the range options of <a href="#createReadStream"><code>createReadStream</code></a> and are passed to the underlying store.

<a name="clear"></a>

### `db.clear([options][, callback])`

**This method is experimental. Not all underlying stores support it yet. Consult [Level/community#79](https://github.com/Level/community/issues/79) to find out if your (combination of) dependencies support `db.clear()`.**

Delete all entries or a range. Not guaranteed to be atomic. Accepts the following range options (with the same rules as on iterators):

- `gt` (greater than), `gte` (greater than or equal) define the lower bound of the range to be deleted. Only entries where the key is greater than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries deleted will be the same.
- `lt` (less than), `lte` (less than or equal) define the higher bound of the range to be deleted. Only entries where the key is less than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries deleted will be the same.
- `reverse` _(boolean, default: `false`)_: delete entries in reverse order. Only effective in combination with `limit`, to remove the last N records.
- `limit` _(number, default: `-1`)_: limit the number of entries to be deleted. This number represents a _maximum_ number of entries and may not be reached if you get to the end of the range first. A value of `-1` means there is no limit. When `reverse=true` the entries with the highest keys will be deleted instead of the lowest keys.

If no options are provided, all entries will be deleted. The `callback` function will be called with no arguments if the operation was successful or with an `WriteError` if it failed for any reason.

If no callback is passed, a promise is returned.

## Promise Support

`level(up)` ships with native `Promise` support out of the box.

Each function taking a callback also can be used as a promise, if the callback is omitted. This applies for:

- `db.get(key[, options])`
- `db.put(key, value[, options])`
- `db.del(key[, options])`
- `db.batch(ops[, options])`
- `db.batch().write()`
- `db.clear(options)`

The only exception is the `level` constructor itself, which if no callback is passed will lazily open the underlying store in the background.

Example:

```js
var db = level('my-db')

db.put('foo', 'bar')
  .then(function () { return db.get('foo') })
  .then(function (value) { console.log(value) })
  .catch(function (err) { console.error(err) })
```

Or using `async/await`:

```js
var main = async () => {
  var db = level('my-db')

  await db.put('foo', 'bar')
  console.log(await db.get('foo'))
}
```

## Events

`levelup` is an [`EventEmitter`](https://nodejs.org/api/events.html) and emits the following events.

| Event     | Description                 | Arguments            |
| :-------- | :-------------------------- | :------------------- |
| `put`     | Key has been updated        | `key, value` (any)   |
| `del`     | Key has been deleted        | `key` (any)          |
| `batch`   | Batch has executed          | `operations` (array) |
| `opening` | Underlying store is opening | -                    |
| `open`    | Store has opened            | -                    |
| `ready`   | Alias of `open`             | -                    |
| `closing` | Store is closing            | -                    |
| `closed`  | Store has closed.           | -                    |

For example you can do:

```js
db.on('put', function (key, value) {
  console.log('inserted', { key, value })
})
```

## Contributing

[`Level/level`](https://github.com/Level/level) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level) and [npm](https://www.npmjs.com/) packages. 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2013-present Rod Vagg and [Contributors](CONTRIBUTORS.md).

[level-badge]: https://leveljs.org/img/badge.svg

[leveldown]: https://github.com/Level/leveldown

[level-js]: https://github.com/Level/level-js

[encoding-down]: https://github.com/Level/encoding-down
