# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## 6.0.0

**No breaking changes to the `level` API. If you're only using `level` in Node.js or Electron, you can upgrade without thinking twice.**

The major bump is for browsers, because `level` upgraded to [`level-js@5`](https://github.com/Level/level-js):

> Support of keys & values other than strings and Buffers has been dropped. Internally `level-js` now stores keys & values as binary which solves a number of compatibility issues ([Level/memdown#186](https://github.com/Level/memdown/issues/186)). If you pass in a key or value that isn't a string or Buffer, it will be irreversibly stringified.
>
> Existing IndexedDB databases created with `level-js@4` \[via `level@5`] can be read only if they used binary keys and string or binary values. Other types will come out stringified, and string keys will sort incorrectly. Use the included `upgrade()` utility to convert stored data to binary (in so far the environment supports it):
>
> ```js
> var level = require('level')
> var reachdown = require('reachdown')
> var db = level('my-db')
>
> db.open(function (err) {
>   if (err) throw err
>
>   reachdown(db, 'level-js').upgrade(function (err) {
>     if (err) throw err
>   })
> })
> ```

### New Features :sparkles:

In case you missed it (a few of these already floated into `level@5`) some exciting new features are now available in all environments:

- Added [`db.clear()`](https://github.com/Level/level#dbclearoptions-callback) to delete all entries or a range! Also works in [`subleveldown`](https://github.com/Level/subleveldown) - empty that bucket!
- Check out [`db.supports`](https://github.com/Level/level#supports): a manifest describing the features of a db!
- Glorious: `leveldown` ships a prebuilt binary for Linux that is now [compatible with Debian 8, Ubuntu 14.04, RHEL 7, CentOS 7 and other flavors with an old glibc](https://github.com/Level/leveldown/pull/674)!
- With thanks to [Cirrus CI](https://cirrus-ci.org/), `leveldown` is now [continuously tested in FreeBSD](https://github.com/Level/leveldown/pull/678)!

Go forth and build amazing things.

## 5.0.0

Upgraded to [`leveldown@5.0.0`](https://github.com/Level/leveldown/blob/v5.0.0/UPGRADING.md#v5) and (through `level-packager@5`) [`levelup@4`](https://github.com/Level/levelup/blob/v4.0.0/UPGRADING.md#v4) and [`encoding-down@6`](https://github.com/Level/encoding-down/blob/v6.0.0/UPGRADING.md#v6). Please follow these links for more information. A quick summary: range options (e.g. `gt`) are now serialized the same as keys, `{ gt: undefined }` is not the same as `{}`, nullish values are now rejected and streams are backed by [`readable-stream@3`](https://github.com/nodejs/readable-stream#version-3xx).

In addition, `level` got browser support! It uses [`leveldown`](https://github.com/Level/leveldown) in node and [`level-js`](https://github.com/Level/level-js) in browsers (backed by [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)). As such, [`level-browserify`](https://github.com/Level/level-browserify) is not needed anymore and will be deprecated later on. To learn what the integration of `level-js` means for platform, browser and type support, please see the updated [README](README.md#supported-platforms).

## 4.0.0

Dropped support for node 4. No other breaking changes.

## 3.0.0

No breaking changes to the `level` API.

This is an upgrade to `leveldown@^3.0.0` which is based on `abstract-leveldown@~4.0.0` which in turn contains breaking changes to [`.batch()`](https://github.com/Level/abstract-leveldown/commit/a2621ad70571f6ade9d2be42632ece042e068805). Though this is negated by `levelup`, we decided to release a new major version in the event of dependents reaching down into `db.db`.

## 2.0.0

No breaking changes to the `level` API.

The parts that make up `level` have been refactored to increase modularity. This is an upgrade to `leveldown@~2.0.0` and `level-packager@~2.0.0`, which in turn upgraded to `levelup@^2.0.0`. The responsibility of encoding keys and values moved from [`levelup`](https://github.com/Level/levelup) to [`encoding-down`](https://github.com/Level/encoding-down), which comes bundled with [`level-packager`](https://github.com/Level/packager).

Being a convenience package, `level` glues the parts back together to form a drop-in replacement for the users of `levelup@1`, while staying fully compatible with `level@1`. One thing we do get for free, is native Promise support.

```js
const db = level('db')
await db.put('foo', 'bar')
console.log(await db.get('foo'))
```

This does not affect the existing callback API, functionality-wise or performance-wise.

For more information please check the corresponding `CHANGELOG.md` for:

- [`levelup`](https://github.com/Level/levelup/blob/master/CHANGELOG.md)
- [`leveldown`](https://github.com/Level/leveldown/blob/master/CHANGELOG.md)
- [`level-packager`](https://github.com/Level/packager/blob/master/CHANGELOG.md)
