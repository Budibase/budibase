# level-js

> An [`abstract-leveldown`][abstract-leveldown] compliant store on top of [IndexedDB][indexeddb].

[![level badge][level-badge]][awesome]
[![npm](https://img.shields.io/npm/v/level-js.svg?label=&logo=npm)](https://www.npmjs.com/package/level-js)
[![Travis](https://img.shields.io/travis/com/Level/level-js.svg?logo=travis&label=)](https://travis-ci.com/Level/level-js)
[![npm](https://img.shields.io/npm/dm/level-js.svg?label=dl)](https://www.npmjs.com/package/level-js)
[![Coverage Status](https://coveralls.io/repos/github/Level/level-js/badge.svg)](https://coveralls.io/github/Level/level-js)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## Table of Contents

<details><summary>Click to expand</summary>

- [Background](#background)
- [Example](#example)
- [Browser Support](#browser-support)
- [Type Support](#type-support)
- [Install](#install)
- [API](#api)
- [Running Tests](#running-tests)
- [Big Thanks](#big-thanks)
- [Contributing](#contributing)
- [Donate](#donate)
- [License](#license)

</details>

## Background

Here are the goals of `level-js`:

- Store large amounts of data in modern browsers
- Pass the full [`abstract-leveldown`][abstract-leveldown] test suite
- Support string and [`Buffer`][buffer] keys and values
- Be as fast as possible
- ~~Sync with [multilevel](https://github.com/juliangruber/multilevel) over ASCII or binary transports.~~

Being `abstract-leveldown` compliant means you can use many of the [Level modules][awesome] on top of this library.

## Example

**If you are upgrading:** please see [UPGRADING.md](UPGRADING.md).

```js
var levelup = require('levelup')
var leveljs = require('level-js')
var db = levelup(leveljs('bigdata'))

db.put('hello', Buffer.from('world'), function (err) {
  if (err) throw err

  db.get('hello', function (err, value) {
    if (err) throw err

    console.log(value.toString()) // 'world'
  })
})
```

In ES6 browsers:

```js
const levelup = require('levelup')
const leveljs = require('level-js')
const db = levelup(leveljs('bigdata'))

await db.put('hello', Buffer.from('world'))
const value = await db.get('hello')
```

## Browser Support

[![Sauce Test Status](https://saucelabs.com/browser-matrix/level-js.svg)](https://saucelabs.com/u/level-js)

## Type Support

Keys and values can be a string or [`Buffer`][buffer]. Any other type will be irreversibly stringified. The only exceptions are `null` and `undefined`. Keys and values of that type are rejected.

In order to sort string and Buffer keys the same way, for compatibility with `leveldown` and the larger ecosystem, `level-js` internally converts keys and values to binary before passing them to IndexedDB. If binary keys are not supported by the environment (like IE11) `level-js` falls back to `String(key)`.

If you desire non-destructive encoding (e.g. to store and retrieve numbers as-is), wrap `level-js` with [`encoding-down`][encoding-down]. Alternatively install [`level`][level] which conveniently bundles [`levelup`][levelup], `level-js` and `encoding-down`. Such an approach is also recommended if you want to achieve universal (isomorphic) behavior. For example, you could have [`leveldown`][leveldown] in a backend and `level-js` in the frontend. The `level` package does exactly that.

When getting or iterating keys and values, regardless of the type with which they were stored, keys and values will return as a Buffer unless the `asBuffer`, `keyAsBuffer` or `valueAsBuffer` options are set, in which case strings are returned. Setting these options is not needed when `level-js` is wrapped with `encoding-down`, which determines the optimal return type by the chosen encoding.

```js
db.get('key', { asBuffer: false })
db.iterator({ keyAsBuffer: false, valueAsBuffer: false })
```

## Install

With [npm](https://npmjs.org) do:

```bash
npm install level-js
```

Not to be confused with [leveljs](https://www.npmjs.com/package/leveljs).

This library is best used with [browserify](http://browserify.org).

## API

### `db = leveljs(location[, options])`

Returns a new `leveljs` instance. `location` is the string name of the [`IDBDatabase`](https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase) to be opened, as well as the object store within that database. The database name will be prefixed with `options.prefix`.

#### `options`

The optional `options` argument may contain:

- `prefix` _(string, default: `'level-js-'`)_: Prefix for `IDBDatabase` name.
- `version` _(string | number, default: `1`)_: The version to open the database with.

See [`IDBFactory#open`](https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/open) for more details.

## Running Tests

```sh
git clone git@github.com:Level/level-js.git
cd level-js
npm install
npm test
```

It will print out a URL to open in a browser of choice.

## Big Thanks

Cross-browser Testing Platform and Open Source ♥ Provided by [Sauce Labs](https://saucelabs.com).

[![Sauce Labs logo](./sauce-labs.svg)](https://saucelabs.com)

## Contributing

[`Level/level-js`](https://github.com/Level/level-js) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level) and [npm](https://www.npmjs.com/) packages. 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2012-present [Max Ogden](https://github.com/maxogden) and [Contributors](CONTRIBUTORS.md).

[level-badge]: https://leveljs.org/img/badge.svg

[indexeddb]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

[buffer]: https://nodejs.org/api/buffer.html

[awesome]: https://github.com/Level/awesome

[abstract-leveldown]: https://github.com/Level/abstract-leveldown

[levelup]: https://github.com/Level/levelup

[leveldown]: https://github.com/Level/leveldown

[level]: https://github.com/Level/level

[encoding-down]: https://github.com/Level/encoding-down
