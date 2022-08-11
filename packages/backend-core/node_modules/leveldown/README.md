# leveldown

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/leveldown.svg?label=&logo=npm)](https://www.npmjs.com/package/leveldown)
[![Node version](https://img.shields.io/node/v/leveldown.svg)](https://www.npmjs.com/package/leveldown)
[![Travis](https://img.shields.io/travis/com/Level/leveldown.svg?logo=travis&label=)](https://travis-ci.com/Level/leveldown)
[![AppVeyor](https://img.shields.io/appveyor/ci/Level/leveldown.svg?logo=appveyor&label=)](https://ci.appveyor.com/project/Level/leveldown)
[![Cirrus CI](https://img.shields.io/cirrus/github/Level/leveldown?logo=cirrus-ci&label=)](https://cirrus-ci.com/github/Level/leveldown)
[![npm](https://img.shields.io/npm/dm/leveldown.svg?label=dl)](https://www.npmjs.com/package/leveldown)
[![Coverage Status](https://coveralls.io/repos/github/Level/leveldown/badge.svg)](https://coveralls.io/github/Level/leveldown)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## Table of Contents

<details><summary>Click to expand</summary>

- [Introduction](#introduction)
- [Supported Platforms](#supported-platforms)
- [API](#api)
- [Safety](#safety)
- [Snapshots](#snapshots)
- [Getting Support](#getting-support)
- [Contributing](#contributing)
- [Donate](#donate)
- [License](#license)

</details>

## Introduction

This module was originally part of [`levelup`](https://github.com/Level/levelup) but was later extracted and now serves as a stand-alone binding for LevelDB.

It is **strongly recommended** that you use `levelup` in preference to `leveldown` unless you have measurable performance reasons to do so. `levelup` is optimised for usability and safety. Although we are working to improve the safety of the `leveldown` interface it is still easy to crash your Node process if you don't do things in just the right way.

See the section on <a href="#safety">safety</a> below for details of known unsafe operations with `leveldown`.

## Supported Platforms

We aim to support _at least_ Active LTS and Current Node.js releases, Electron 4.0.0, as well as any future Node.js and Electron releases thanks to [N-API](https://nodejs.org/api/n-api.html). The minimum node version for `leveldown` is `8.6.0`. Conversely, for node >= 12, the minimum `leveldown` version is `5.0.0`.

The `leveldown` npm package ships with prebuilt binaries for popular 64-bit platforms as well as ARM, Android and Alpine (musl) and is known to work on:

- **Linux** (including ARM platforms such as Raspberry Pi and Kindle)
- **Mac OS**
- **Solaris** (SmartOS & Nodejitsu)
- **FreeBSD**
- **Windows**

When installing `leveldown`, [`node-gyp-build`](https://github.com/prebuild/node-gyp-build) will check if a compatible binary exists and fallback to a compile step if it doesn't. In that case you'll need a [valid `node-gyp` installation](https://github.com/nodejs/node-gyp#installation).

If you don't want to use the prebuilt binary for the platform you are installing on, specify the `--build-from-source` flag when you install. One of:

```
npm install --build-from-source
npm install leveldown --build-from-source
```

If you are working on `leveldown` itself and want to re-compile the C++ code, run `npm run rebuild`.

### Notes

- If you get compilation errors on Node.js 12, please ensure you have `leveldown` >= 5. This can be checked by running `npm ls leveldown`.
- On Linux flavors with an old glibc (Debian 8, Ubuntu 14.04, RHEL 7, CentOS 7) you must either update `leveldown` to >= 5.3.0 or use `--build-from-source`.
- On Alpine 3 it was previously necessary to use `--build-from-source`. This is no longer the case.
- The Android prebuilds are made for and built against Node.js core rather than the [`nodejs-mobile`](https://github.com/JaneaSystems/nodejs-mobile) fork.

## API

**If you are upgrading:** please see [`UPGRADING.md`](UPGRADING.md).

- <a href="#ctor"><code><b>leveldown()</b></code></a>
- <a href="#leveldown_open"><code>db.<b>open()</b></code></a>
- <a href="#leveldown_close"><code>db.<b>close()</b></code></a>
- <a href="#leveldown_put"><code>db.<b>put()</b></code></a>
- <a href="#leveldown_get"><code>db.<b>get()</b></code></a>
- <a href="#leveldown_del"><code>db.<b>del()</b></code></a>
- <a href="#leveldown_batch"><code>db.<b>batch()</b></code></a> _(array form)_
- <a href="#leveldown_chainedbatch"><code>db.<b>batch()</b></code></a> _(chained form)_
- <a href="#leveldown_approximateSize"><code>db.<b>approximateSize()</b></code></a>
- <a href="#leveldown_compactRange"><code>db.<b>compactRange()</b></code></a>
- <a href="#leveldown_getProperty"><code>db.<b>getProperty()</b></code></a>
- <a href="#leveldown_iterator"><code>db.<b>iterator()</b></code></a>
- <a href="#leveldown_clear"><code>db.<b>clear()</b></code></a>
- <a href="#chainedbatch"><code>chainedBatch</code></a>
  - <a href="#chainedbatch_put"><code>chainedBatch.<b>put()</b></code></a>
  - <a href="#chainedbatch_del"><code>chainedBatch.<b>del()</b></code></a>
  - <a href="#chainedbatch_clear"><code>chainedBatch.<b>clear()</b></code></a>
  - <a href="#chainedbatch_write"><code>chainedBatch.<b>write()</b></code></a>
  - <a href="#chainedbatch_db"><code>chainedBatch.<b>db</b></code></a>
- <a href="#iterator"><code>iterator</b></code></a>
  - <a href="#iterator_next"><code>iterator.<b>next()</b></code></a>
  - <a href="#iterator_seek"><code>iterator.<b>seek()</b></code></a>
  - <a href="#iterator_end"><code>iterator.<b>end()</b></code></a>
  - <a href="#iterator_db"><code>iterator.<b>db</b></code></a>
- <a href="#leveldown_destroy"><code>leveldown.<b>destroy()</b></code></a>
- <a href="#leveldown_repair"><code>leveldown.<b>repair()</b></code></a>

<a name="ctor"></a>

### `db = leveldown(location)`

<code>leveldown()</code> returns a new `leveldown` instance. `location` is a String pointing to the LevelDB location to be opened.

<a name="leveldown_open"></a>

### `db.open([options, ]callback)`

<code>open()</code> is an instance method on an existing database object.

The `callback` function will be called with no arguments when the database has been successfully opened, or with a single `error` argument if the open operation failed for any reason.

#### `options`

The optional `options` argument may contain:

- `createIfMissing` (boolean, default: `true`): If `true`, will initialise an empty database at the specified location if one doesn't already exist. If `false` and a database doesn't exist you will receive an error in your `open()` callback and your database won't open.

- `errorIfExists` (boolean, default: `false`): If `true`, you will receive an error in your `open()` callback if the database exists at the specified location.

- `compression` (boolean, default: `true`): If `true`, all _compressible_ data will be run through the Snappy compression algorithm before being stored. Snappy is very fast and shouldn't gain much speed by disabling so leave this on unless you have good reason to turn it off.

- `cacheSize` (number, default: `8 * 1024 * 1024` = 8MB): The size (in bytes) of the in-memory [LRU](http://en.wikipedia.org/wiki/Cache_algorithms#Least_Recently_Used) cache with frequently used uncompressed block contents.

**Advanced options**

The following options are for advanced performance tuning. Modify them only if you can prove actual benefit for your particular application.

- `writeBufferSize` (number, default: `4 * 1024 * 1024` = 4MB): The maximum size (in bytes) of the log (in memory and stored in the .log file on disk). Beyond this size, LevelDB will convert the log data to the first level of sorted table files. From the LevelDB documentation:

> Larger values increase performance, especially during bulk loads. Up to two write buffers may be held in memory at the same time, so you may wish to adjust this parameter to control memory usage. Also, a larger write buffer will result in a longer recovery time the next time the database is opened.

- `blockSize` (number, default `4096` = 4K): The _approximate_ size of the blocks that make up the table files. The size related to uncompressed data (hence "approximate"). Blocks are indexed in the table file and entry-lookups involve reading an entire block and parsing to discover the required entry.

- `maxOpenFiles` (number, default: `1000`): The maximum number of files that LevelDB is allowed to have open at a time. If your data store is likely to have a large working set, you may increase this value to prevent file descriptor churn. To calculate the number of files required for your working set, divide your total data by `'maxFileSize'`.

- `blockRestartInterval` (number, default: `16`): The number of entries before restarting the "delta encoding" of keys within blocks. Each "restart" point stores the full key for the entry, between restarts, the common prefix of the keys for those entries is omitted. Restarts are similar to the concept of keyframes in video encoding and are used to minimise the amount of space required to store keys. This is particularly helpful when using deep namespacing / prefixing in your keys.

- `maxFileSize` (number, default: `2* 1024 * 1024` = 2MB): The maximum amount of bytes to write to a file before switching to a new one. From the LevelDB documentation:

> ... if your filesystem is more efficient with larger files, you could consider increasing the value. The downside will be longer compactions and hence longer latency/performance hiccups. Another reason to increase this parameter might be when you are initially populating a large database.

<a name="leveldown_close"></a>

### `db.close(callback)`

<code>close()</code> is an instance method on an existing database object. The underlying LevelDB database will be closed and the `callback` function will be called with no arguments if the operation is successful or with a single `error` argument if the operation failed for any reason.

`leveldown` waits for any pending operations to finish before closing. For example:

```js
db.put('key', 'value', function (err) {
  // This happens first
})

db.close(function (err) {
  // This happens second
})
```

<a name="leveldown_put"></a>

### `db.put(key, value[, options], callback)`

<code>put()</code> is an instance method on an existing database object, used to store new entries, or overwrite existing entries in the LevelDB store.

The `key` and `value` objects may either be strings or Buffers. Other object types are converted to strings with the `toString()` method. Keys may not be `null` or `undefined` and objects converted with `toString()` should not result in an empty-string. Values may not be `null` or `undefined`. Values of `''`, `[]` and `Buffer.alloc(0)` (and any object resulting in a `toString()` of one of these) will be stored as a zero-length character array and will therefore be retrieved as either `''` or `Buffer.alloc(0)` depending on the type requested.

A richer set of data-types is catered for in `levelup`.

#### `options`

The only property currently available on the `options` object is `sync` _(boolean, default: `false`)_. If you provide a `sync` value of `true` in your `options` object, LevelDB will perform a synchronous write of the data; although the operation will be asynchronous as far as Node is concerned. Normally, LevelDB passes the data to the operating system for writing and returns immediately, however a synchronous write will use `fsync()` or equivalent so your callback won't be triggered until the data is actually on disk. Synchronous filesystem writes are **significantly** slower than asynchronous writes but if you want to be absolutely sure that the data is flushed then you can use `{ sync: true }`.

The `callback` function will be called with no arguments if the operation is successful or with a single `error` argument if the operation failed for any reason.

<a name="leveldown_get"></a>

### `db.get(key[, options], callback)`

<code>get()</code> is an instance method on an existing database object, used to fetch individual entries from the LevelDB store.

The `key` object may either be a string or a Buffer and cannot be `undefined` or `null`. Other object types are converted to strings with the `toString()` method and the resulting string _may not_ be a zero-length. A richer set of data-types is catered for in `levelup`.

Values fetched via `get()` that are stored as zero-length character arrays (`null`, `undefined`, `''`, `[]`, `Buffer.alloc(0)`) will return as empty-`String` (`''`) or `Buffer.alloc(0)` when fetched with `asBuffer: true` (see below).

#### `options`

The optional `options` object may contain:

- `fillCache` (boolean, default: `true`): LevelDB will by default fill the in-memory LRU Cache with data from a call to get. Disabling this is done by setting `fillCache` to `false`.

- `asBuffer` (boolean, default: `true`): Used to determine whether to return the `value` of the entry as a string or a Buffer. Note that converting from a Buffer to a string incurs a cost so if you need a string (and the `value` can legitimately become a UTF8 string) then you should fetch it as one with `{ asBuffer: false }` and you'll avoid this conversion cost.

The `callback` function will be called with a single `error` if the operation failed for any reason. If successful the first argument will be `null` and the second argument will be the `value` as a string or Buffer depending on the `asBuffer` option.

<a name="leveldown_del"></a>

### `db.del(key[, options], callback)`

<code>del()</code> is an instance method on an existing database object, used to delete entries from the LevelDB store.

The `key` object may either be a string or a Buffer and cannot be `undefined` or `null`. Other object types are converted to strings with the `toString()` method and the resulting string _may not_ be a zero-length. A richer set of data-types is catered for in `levelup`.

#### `options`

The only property currently available on the `options` object is `sync` _(boolean, default: `false`)_. See <a href="#leveldown_put">leveldown#put()</a> for details about this option.

The `callback` function will be called with no arguments if the operation is successful or with a single `error` argument if the operation failed for any reason.

<a name="leveldown_batch"></a>

### `db.batch(operations[, options], callback)` _(array form)_

Perform multiple _put_ and/or _del_ operations in bulk. The `operations` argument must be an `Array` containing a list of operations to be executed sequentially, although as a whole they are performed as an atomic operation.

Each operation is contained in an object having the following properties: `type`, `key`, `value`, where the `type` is either `'put'` or `'del'`. In the case of `'del'` the `value` property is ignored.

Any entries where the `key` or `value` (in the case of `'put'`) is `null` or `undefined` will cause an error to be returned on the `callback`. Any entries where the `type` is `'put'` that have a `value` of `[]`, `''` or `Buffer.alloc(0)` will be stored as a zero-length character array and therefore be fetched during reads as either `''` or `Buffer.alloc(0)` depending on how they are requested. See [`levelup`](https://github.com/Level/levelup#batch) for full documentation on how this works in practice.

The optional `options` argument may contain:

- `sync` (boolean, default: `false`). See <a href="#leveldown_put"><code>db.put()</code></a> for details about this option.

The `callback` function will be called with no arguments if the batch is successful or with an `Error` if the batch failed for any reason.

<a name="leveldown_chainedbatch"></a>

### `db.batch()` _(chained form)_

Returns a new [`chainedBatch`](#chainedbatch) instance.

<a name="leveldown_approximateSize"></a>

### `db.approximateSize(start, end, callback)`

<code>approximateSize()</code> is an instance method on an existing database object. Used to get the approximate number of bytes of file system space used by the range `[start..end)`. The result may not include recently written data.

The `start` and `end` parameters may be strings or Buffers representing keys in the LevelDB store.

The `callback` function will be called with a single `error` if the operation failed for any reason. If successful the first argument will be `null` and the second argument will be the approximate size as a Number.

<a name="leveldown_compactRange"></a>

### `db.compactRange(start, end, callback)`

<code>compactRange()</code> is an instance method on an existing database object. Used to manually trigger a database compaction in the range `[start..end)`.

The `start` and `end` parameters may be strings or Buffers representing keys in the LevelDB store.

The `callback` function will be called with no arguments if the operation is successful or with a single `error` argument if the operation failed for any reason.

<a name="leveldown_getProperty"></a>

### `db.getProperty(property)`

<code>getProperty</code> can be used to get internal details from LevelDB. When issued with a valid property string, a readable string will be returned (this method is synchronous).

Currently, the only valid properties are:

- <b><code>'leveldb.num-files-at-levelN'</code></b>: return the number of files at level _N_, where N is an integer representing a valid level (e.g. "0").

- <b><code>'leveldb.stats'</code></b>: returns a multi-line string describing statistics about LevelDB's internal operation.

- <b><code>'leveldb.sstables'</code></b>: returns a multi-line string describing all of the _sstables_ that make up contents of the current database.

<a name="leveldown_iterator"></a>

### `db.iterator([options])`

Returns a new [`iterator`](#iterator) instance. The optional `options` object may contain:

- `gt` (greater than), `gte` (greater than or equal) define the lower bound of the values to be fetched and will determine the starting point where `reverse` is _not_ `true`. Only records where the key is greater than (or equal to) this option will be included in the range. When `reverse` is `true` the order will be reversed, but the records returned will be the same.

- `lt` (less than), `lte` (less than or equal) define the higher bound of the range to be fetched and will determine the starting point where `reverse` is _not_ `true`. Only records where the key is less than (or equal to) this option will be included in the range. When `reverse` is `true` the order will be reversed, but the records returned will be the same.

- `start, end` legacy ranges - instead use `gte, lte`

- `reverse` _(boolean, default: `false`)_: a boolean, set to `true` if you want the stream to go in reverse order. Beware that due to the way LevelDB works, a reverse seek will be slower than a forward seek.

- `keys` (boolean, default: `true`): whether the callback to the `next()` method should receive a non-null `key`. There is a small efficiency gain if you ultimately don't care what the keys are as they don't need to be converted and copied into JavaScript.

- `values` (boolean, default: `true`): whether the callback to the `next()` method should receive a non-null `value`. There is a small efficiency gain if you ultimately don't care what the values are as they don't need to be converted and copied into JavaScript.

- `limit` (number, default: `-1`): limit the number of results collected by this iterator. This number represents a _maximum_ number of results and may not be reached if you get to the end of the store or your `end` value first. A value of `-1` means there is no limit.

- `fillCache` (boolean, default: `false`): whether LevelDB's LRU-cache should be filled with data read.

- `keyAsBuffer` (boolean, default: `true`): Used to determine whether to return the `key` of each entry as a string or a Buffer. Note that converting from a Buffer to a string incurs a cost so if you need a string (and the `value` can legitimately become a UTF8 string) then you should fetch it as one.

- `valueAsBuffer` (boolean, default: `true`): Used to determine whether to return the `value` of each entry as a string or a Buffer.

<a name="leveldown_clear"></a>

### `db.clear([options, ]callback)`

Delete all entries or a range. Not guaranteed to be atomic. Accepts the following range options (with the same rules as on iterators):

- `gt` (greater than), `gte` (greater than or equal) define the lower bound of the range to be deleted. Only entries where the key is greater than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries deleted will be the same.
- `lt` (less than), `lte` (less than or equal) define the higher bound of the range to be deleted. Only entries where the key is less than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries deleted will be the same.
- `reverse` _(boolean, default: `false`)_: delete entries in reverse order. Only effective in combination with `limit`, to remove the last N records.
- `limit` _(number, default: `-1`)_: limit the number of entries to be deleted. This number represents a _maximum_ number of entries and may not be reached if you get to the end of the range first. A value of `-1` means there is no limit. When `reverse=true` the entries with the highest keys will be deleted instead of the lowest keys.

If no options are provided, all entries will be deleted. The `callback` function will be called with no arguments if the operation was successful or with an `Error` if it failed for any reason.

<a name="chainedbatch"></a>

### `chainedBatch`

<a name="chainedbatch_put"></a>

#### `chainedBatch.put(key, value)`

Queue a `put` operation on this batch. This may throw if `key` or `value` is invalid, following the same rules as the <a href="#leveldown_batch">array form of <code>db.batch()</code></a>.

<a name="chainedbatch_del"></a>

#### `chainedBatch.del(key)`

Queue a `del` operation on this batch. This may throw if `key` is invalid.

<a name="chainedbatch_clear"></a>

#### `chainedBatch.clear()`

Clear all queued operations on this batch.

<a name="chainedbatch_write"></a>

#### `chainedBatch.write([options, ]callback)`

Commit the queued operations for this batch. All operations will be written atomically, that is, they will either all succeed or fail with no partial commits.

The optional `options` argument may contain:

- `sync` (boolean, default: `false`). See <a href="#leveldown_put"><code>db.put()</code></a> for details about this option.

The `callback` function will be called with no arguments if the batch is successful or with an `Error` if the batch failed for any reason. After `write` has been called, no further operations are allowed.

<a name="chainedbatch_db"></a>

#### `chainedBatch.db`

A reference to the `db` that created this chained batch.

### `iterator`

<a name="iterator_next"></a>

#### `iterator.next(callback)`

<code>next()</code> is an instance method on an existing iterator object, used to increment the underlying LevelDB iterator and return the entry at that location.

the `callback` function will be called with no arguments in any of the following situations:

- the iterator comes to the end of the store
- the `end` key has been reached; or
- the `limit` has been reached; or
- the last `seek()` was out of range

Otherwise, the `callback` function will be called with the following 3 arguments:

- `error` - any error that occurs while incrementing the iterator.
- `key` - either a string or a Buffer depending on the `keyAsBuffer` argument when the `iterator()` was called.
- `value` - either a string or a Buffer depending on the `valueAsBuffer` argument when the `iterator()` was called.

<a name="iterator_seek"></a>

#### `iterator.seek(key)`

<code>seek()</code> is an instance method on an existing iterator object, used to seek the underlying LevelDB iterator to a given key.

By calling <code>seek(key)</code>, subsequent calls to <code>next(cb)</code> will return key/values larger or smaller than `key`, based on your <code>reverse</code> setting in the iterator constructor.

<a name="iterator_end"></a>

#### `iterator.end(callback)`

<code>end()</code> is an instance method on an existing iterator object. The underlying LevelDB iterator will be deleted and the `callback` function will be called with no arguments if the operation is successful or with a single `error` argument if the operation failed for any reason.

<a name="iterator_db"></a>

#### `iterator.db`

A reference to the `db` that created this iterator.

<a name="leveldown_destroy"></a>

### `leveldown.destroy(location, callback)`

<code>destroy()</code> is used to completely remove an existing LevelDB database directory. You can use this function in place of a full directory _rm_ if you want to be sure to only remove LevelDB-related files. If the directory only contains LevelDB files, the directory itself will be removed as well. If there are additional, non-LevelDB files in the directory, those files, and the directory, will be left alone.

The callback will be called when the destroy operation is complete, with a possible `error` argument.

<a name="leveldown_repair"></a>

### `leveldown.repair(location, callback)`

<code>repair()</code> can be used to attempt a restoration of a damaged LevelDB store. From the LevelDB documentation:

> If a DB cannot be opened, you may attempt to call this method to resurrect as much of the contents of the database as possible. Some data may be lost, so be careful when calling this function on a database that contains important information.

You will find information on the _repair_ operation in the _LOG_ file inside the store directory.

A `repair()` can also be used to perform a compaction of the LevelDB log into table files.

The callback will be called when the repair operation is complete, with a possible `error` argument.

## Safety

### Database State

Currently `leveldown` does not track the state of the underlying LevelDB instance. This means that calling `open()` on an already open database may result in an error. Likewise, calling any other operation on a non-open database may result in an error.

`levelup` currently tracks and manages state and will prevent out-of-state operations from being send to `leveldown`. If you use `leveldown` directly then you must track and manage state for yourself.

## Snapshots

`leveldown` exposes a feature of LevelDB called [snapshots](https://github.com/google/leveldb/blob/master/doc/index.md#snapshots). This means that when you do e.g. `createReadStream` and `createWriteStream` at the same time, any data modified by the write stream will not affect data emitted from the read stream. In other words, a LevelDB Snapshot captures the latest state at the time the snapshot was created, enabling the snapshot to iterate or read the data without seeing any subsequent writes. Any read not performed on a snapshot will implicitly use the latest state.

## Getting Support

There are multiple ways you can find help in using LevelDB in Node.js:

- **IRC:** you'll find an active group of `levelup` users in the **##leveldb** channel on Freenode, including most of the contributors to this project.
- **Mailing list:** there is an active [Node.js LevelDB](https://groups.google.com/forum/#!forum/node-levelup) Google Group.
- **GitHub:** you're welcome to open an issue here on this GitHub repository if you have a question.

## Contributing

[`Level/leveldown`](https://github.com/Level/leveldown) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

### Git Submodules

This project uses Git Submodules. This means that you should clone it recursively if you're planning on working on it:

```bash
$ git clone --recurse-submodules https://github.com/Level/leveldown.git
```

Alternatively, you can initialize submodules inside the cloned folder:

```bash
$ git submodule update --init --recursive
```

### Publishing

1. Increment the version: `npm version ..`
2. Push to GitHub: `git push --follow-tags`
3. Wait for Travis and AppVeyor builds to complete
4. Download prebuilds into `./prebuilds`: `npm run download-prebuilds`
5. Optionally verify loading a prebuild: `npm run test-prebuild`
6. Optionally verify which files npm will include: `irish-pub`
7. Add changelog to the GitHub release
8. Finally: `npm publish`

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level) and [npm](https://www.npmjs.com/) packages. 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2012-present Rod Vagg and [Contributors](CONTRIBUTORS.md).

_`leveldown` builds on the excellent work of the LevelDB and Snappy teams from Google and additional contributors. LevelDB and Snappy are both issued under the [New BSD License](http://opensource.org/licenses/BSD-3-Clause). A large portion of `leveldown` Windows support comes from the [Windows LevelDB port](http://code.google.com/r/kkowalczyk-leveldb/) (archived) by [Krzysztof Kowalczyk](http://blog.kowalczyk.info/) ([`@kjk`](https://twitter.com/kjk)). If you're using `leveldown` on Windows, you should give him your thanks!_

[level-badge]: https://leveljs.org/img/badge.svg
