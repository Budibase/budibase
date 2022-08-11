# level-supports

> **Create a manifest describing the abilities of a [`levelup`](https://github.com/Level/levelup) or [`abstract-leveldown`](https://github.com/Level/abstract-leveldown) db.**

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/level-supports.svg?label=&logo=npm)](https://www.npmjs.com/package/level-supports)
[![Node version](https://img.shields.io/node/v/level-supports.svg)](https://www.npmjs.com/package/level-supports)
[![Travis](https://img.shields.io/travis/com/Level/supports.svg?logo=travis&label=)](https://travis-ci.com/Level/supports)
[![Coverage Status](https://coveralls.io/repos/github/Level/supports/badge.svg)](https://coveralls.io/github/Level/supports)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## Usage

```js
const supports = require('level-supports')

db.supports = supports({
  bufferKeys: true,
  additionalMethods: {
    approximateSize: true
  }
})
```

Receivers of the db can then use it like so:

```js
if (!db.supports.permanence) {
  throw new Error('Persistent storage is required')
}

if (db.supports.bufferKeys && db.supports.promises) {
  await db.put(Buffer.from('key'), 'value')
}
```

## API

### `manifest = supports([manifest, ..])`

Given zero or more manifest objects, returns a merged and enriched manifest object that has:

- Truthy properties for each of the features listed below
- An `additionalMethods` object

For future extensibility, the properties are truthy rather than strictly typed booleans. Falsy or absent properties are converted to `false`, other values are allowed:

```js
supports().streams // false
supports({ streams: true }).streams // true
supports({ streams: {} }).streams // {}
supports({ streams: 1 }, { streams: 2 }).streams // 2
```

For consumers of the manifest this means they should check support like so:

```js
if (db.supports.streams)
```

Rather than:

```js
if (db.supports.streams === true)
```

**Note:** the manifest describes high-level features that typically encompass multiple methods of a db. It is currently not a goal to describe a full API, or versions of it.

## Features

### `bufferKeys` (boolean)

Does the db support [Buffer](https://nodejs.org/api/buffer.html) keys? May depend on runtime environment as well. Does _not_ include support of other binary types like typed arrays (which is why this is called `bufferKeys` rather than `binaryKeys`).

### `snapshots` (boolean)

Does the db have snapshot guarantees (meaning that reads are unaffected by simultaneous writes)? Must be `false` if any of the following is true:

- Reads don't operate on a [snapshot](https://github.com/Level/abstract-leveldown#iterator)
- Snapshots are created asynchronously.

### `permanence` (boolean)

Does data survive after process exit? Is `false` for e.g. [`memdown`](https://github.com/Level/memdown), typically `true`.

### `seek` (boolean)

Does `db.iterator()` support [`seek(..)`](https://github.com/Level/abstract-leveldown/#iteratorseektarget)?

#### `clear` (boolean)

Does db support [`db.clear(..)`](https://github.com/Level/abstract-leveldown/#dbclearoptions-callback)? For an overview, see [Level/community#79](https://github.com/Level/community/issues/79).

### `status` (boolean)

Does db have a [`status`](https://github.com/Level/abstract-leveldown/#dbstatus) property? Currently available on `abstract-leveldown` implementations, but not `levelup`.

### `deferredOpen` (boolean)

Can operations like `db.put()` be called without explicitly opening the db? Like so:

```js
var db = level()
db.put('key', 'value', callback)
```

Rather than:

```js
var db = level()

db.open(function (err) {
  if (err) throw err
  db.put('key', 'value', callback)
})
```

_TBD: whether this also includes methods like `isOpen()` and `isClosed()`._

### `openCallback` (boolean)

Does the db constructor take a callback?

```js
var db = level(.., callback)
```

To the same effect as:

```js
var db = level()
db.open(.., callback)
```

### `createIfMissing`, `errorIfExists` (boolean)

Does `db.open(options, ..)` support these (`leveldown`) options?

### `promises` (boolean)

Do all db methods (that don't otherwise have a return value) support promises, in addition to callbacks? Such that, when a callback argument is omitted, a promise is returned:

```js
db.put('key', 'value', callback)
await db.put('key', 'value')
```

_Note: iterators are currently exonerated because they, at the time of writing, don't support promises anywhere._

### `streams` (boolean)

Does db have the methods `createReadStream`, `createKeyStream` and `createValueStream`, following the API currently documented in `levelup`?

### `encodings` (boolean)

Do all relevant db methods take `keyEncoding` and `valueEncoding` options?

_TBD: what this means for `*asBuffer` options._

### `additionalMethods` (object)

In the form of:

```js
{
  foo: true,
  bar: true
}
```

Which says the db has two methods, `foo` and `bar`, that are not part of the `abstract-leveldown` interface. It might be used like so:

```js
if (db.supports.additionalMethods.foo) {
  db.foo()
}
```

For future extensibility, the properties of `additionalMethods` should be taken as truthy rather than strictly typed booleans. We may add additional metadata (see [#1](https://github.com/Level/supports/issues/1)).

## Install

With [npm](https://npmjs.org) do:

```
npm install level-supports
```

## Contributing

[`Level/supports`](https://github.com/Level/supports) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level) and [npm](https://www.npmjs.com/) packages. 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2019-present [Contributors](CONTRIBUTORS.md).

[level-badge]: https://leveljs.org/img/badge.svg
