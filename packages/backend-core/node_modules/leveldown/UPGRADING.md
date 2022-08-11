# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## v5

This is a rewrite to N-API - which is a huge milestone, achieved without an impact on write performance - and an upgrade to `abstract-leveldown` v6, which solves long-standing issues around serialization and type support.

### N-API rewrite

N-API is the latest interface for native addons in Node.js. Main benefit is that `leveldown` became independent of the V8 version, which means it will be compatible with future versions of Node.js. As long as the native code doesn't change, it doesn't need to be recompiled as new versions of Node.js are released. This helps greatly with both maintenance and when delivering code to consumers.

Because N-API has an experimental status in node 6 and early 8.x releases, support of node 6 has been dropped and the minimum node version for `leveldown` is now 8.6.0. Conversely, for node >= 12, `leveldown@5` is the minimum version.

### Prebuilt binaries are now shipped in npm package

Previously, they were downloaded from GitHub by an npm `postinstall` script. In addition, `leveldown` now includes prebuilt binaries for Linux ARMv7, Linux ARM64, Android ARMv7 and Android ARM64. The latter target node core (rather than the formerly needed [`nodejs-mobile`](https://github.com/janeasystems/nodejs-mobile) fork).

### Range options are now serialized

Previously, range options like `lt` were passed through as-is by `abstract-leveldown`, unlike keys. For `leveldown` it means that range option types other than a string or Buffer will be stringified.

### The rules for range options have been relaxed

Because `null`, `undefined`, zero-length strings and zero-length buffers are significant types in encodings like `bytewise` and `charwise`, they became valid as range options in `abstract-leveldown`. This means `db.iterator({ gt: undefined })` is not the same as `db.iterator({})`.

In the case of `leveldown`, when used by itself, the aforementioned change means that `db.iterator({ gt: undefined })` is now effectively the same as `db.iterator({ gt: 'undefined' })`, making it explicit that `leveldown` only supports strings and buffers.

### Seeking became part of official `abstract-leveldown` API

As a result of this, the `target` argument in `iterator.seek(target)` is now serialized. Meaning any type other than a string or Buffer will be stringified. Like before, if the result is a zero-length string or Buffer, an error will be thrown.

### Nullish values are rejected

In addition to rejecting `null` and `undefined` as _keys_, `abstract-leveldown` now also rejects these types as _values_, due to preexisting significance in streams and iterators.

### Zero-length array keys are rejected

Though this was already the case, `abstract-leveldown` has replaced the behavior with an explicit `Array.isArray()` check and a new error message.

### The `sync` option of `chainedBatch` has moved

The `sync` option has moved to `chainedBatch.write(options)`. Previously, `sync` was half-documented and half-implemented.

### Various segmentation faults have been fixed

It is now safe to call `db.close()` before `db.put()` completes, to call `db.iterator()` on a non-open db and to call `db.close()` having created many iterators regardless of their state (idle, nexting, ending or ended). To achieve this, `leveldown` waits for pending operations before closing:

```js
db.put('key', 'value', function (err) {
  console.log('this happens first')
})

db.close(function (err) {
  console.log('this happens second')
})
```

A future release will do the same for other operations like `get` and `batch`.

## v4

Dropped support for node 4. No other breaking changes.

## v3.0.1

If you're using node v10 you'll need at least `leveldown@2.0.1` to successfully compile. In addition, if you want prebuilt binaries you'll need at least `leveldown@3.0.1`.

## v3

#### `.batch(array)` enforces objects

This major release contains an upgrade to `abstract-leveldown` with a [breaking change](https://github.com/Level/abstract-leveldown/commit/a2621ad70571f6ade9d2be42632ece042e068805) for the array version of `.batch()`. This change ensures all elements in the batch array are objects.

If you previously passed arrays to `.batch()` that contained `undefined` or `null`, they would be silently ignored. Now this will produce an error.
