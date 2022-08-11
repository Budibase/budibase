# encoding-down

> An [`abstract-leveldown`][abstract-leveldown] implementation that wraps another store to encode keys and values.

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/encoding-down.svg?label=&logo=npm)](https://www.npmjs.com/package/encoding-down)
[![Node version](https://img.shields.io/node/v/encoding-down.svg)](https://www.npmjs.com/package/encoding-down)
[![Travis](https://img.shields.io/travis/Level/com/encoding-down.svg?logo=travis&label=)](https://travis-ci.com/Level/encoding-down)
[![Coverage Status](https://coveralls.io/repos/github/Level/encoding-down/badge.svg)](https://coveralls.io/github/Level/encoding-down)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dm/encoding-down.svg?label=dl)](https://www.npmjs.com/package/encoding-down)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## Introduction

Stores like [`leveldown`][leveldown] can only store strings and Buffers. Other types, though accepted, are [_serialized_](https://github.com/Level/abstract-leveldown#db_serializekeykey) before storage, which is an irreversible type conversion. For a richer set of data types you can wrap such a store with `encoding-down`. It allows you to specify an _encoding_ to use for keys and values independently. This not only widens the range of input types, but also limits the range of output types. The encoding is applied to all read and write operations: it encodes writes and decodes reads.

[Many encodings are builtin][builtin-encodings] courtesy of [`level-codec`][level-codec]. The default encoding is `utf8` which ensures you'll always get back a string. You can also provide a custom encoding like `bytewise` - [or your own](#custom-encodings)!

## Usage

Without any options, `encoding-down` defaults to the `utf8` encoding.

```js
var levelup = require('levelup')
var leveldown = require('leveldown')
var encode = require('encoding-down')

var db = levelup(encode(leveldown('./db1')))

db.put('example', Buffer.from('encoding-down'), function (err) {
  db.get('example', function (err, value) {
    console.log(typeof value, value) // 'string encoding-down'
  })
})
```

Can we store objects? Yes!

```js
var db = levelup(encode(leveldown('./db2'), { valueEncoding: 'json' }))

db.put('example', { awesome: true }, function (err) {
  db.get('example', function (err, value) {
    console.log(value) // { awesome: true }
    console.log(typeof value) // 'object'
  })
})
```

How about storing Buffers, but getting back a hex-encoded string?

```js
var db = levelup(encode(leveldown('./db3'), { valueEncoding: 'hex' }))

db.put('example', Buffer.from([0, 255]), function (err) {
  db.get('example', function (err, value) {
    console.log(typeof value, value) // 'string 00ff'
  })
})
```

What if we previously stored binary data?

```js
var db = levelup(encode(leveldown('./db4'), { valueEncoding: 'binary' }))

db.put('example', Buffer.from([0, 255]), function (err) {
  db.get('example', function (err, value) {
    console.log(typeof value, value) // 'object <Buffer 00 ff>'
  })

  // Override the encoding for this operation
  db.get('example', { valueEncoding: 'base64' }, function (err, value) {
    console.log(typeof value, value) // 'string AP8='
  })
})
```

And what about keys?

```js
var db = levelup(encode(leveldown('./db5'), { keyEncoding: 'json' }))

db.put({ awesome: true }, 'example', function (err) {
  db.get({ awesome: true }, function (err, value) {
    console.log(value) // 'example'
  })
})
```

```js
var db = levelup(encode(leveldown('./db6'), { keyEncoding: 'binary' }))

db.put(Buffer.from([0, 255]), 'example', function (err) {
  db.get('00ff', { keyEncoding: 'hex' }, function (err, value) {
    console.log(value) // 'example'
  })
})
```

## Usage with [`level`][level]

The [`level`][level] module conveniently bundles `encoding-down` and passes its `options` to `encoding-down`. This means you can simply do:

```js
var level = require('level')
var db = level('./db7', { valueEncoding: 'json' })

db.put('example', 42, function (err) {
  db.get('example', function (err, value) {
    console.log(value) // 42
    console.log(typeof value) // 'number'
  })
})
```

## API

### `db = require('encoding-down')(db[, options])`

- `db` must be an [`abstract-leveldown`][abstract-leveldown] compliant store
- `options` are passed to [`level-codec`][level-codec]:
  - `keyEncoding`: encoding to use for keys
  - `valueEncoding`: encoding to use for values

Both encodings default to `'utf8'`. They can be a string (builtin `level-codec` encoding) or an object (custom encoding).

## Custom encodings

Please refer to [`level-codec` documentation][encoding-format] for a precise description of the format. Here's a quick example with `level` and `async/await` just for fun:

```js
var level = require('level')
var lexint = require('lexicographic-integer')

async function main () {
  var db = level('./db8', {
    keyEncoding: {
      type: 'lexicographic-integer',
      encode: (n) => lexint.pack(n, 'hex'),
      decode: lexint.unpack,
      buffer: false
    }
  })

  await db.put(2, 'example')
  await db.put(10, 'example')

  // Without our encoding, the keys would sort as 10, 2.
  db.createKeyStream().on('data', console.log) // 2, 10
}

main()
```

With an npm-installed encoding (modularity ftw!) we can reduce the above to:

```js
var level = require('level')
var lexint = require('lexicographic-integer-encoding')('hex')

var db = level('./db8', {
  keyEncoding: lexint
})
```

## Contributing

[`Level/encoding-down`](https://github.com/Level/encoding-down) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level) and [npm](https://www.npmjs.com/) packages. 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2012-present [Contributors](CONTRIBUTORS.md).

[level-badge]: https://leveljs.org/img/badge.svg

[abstract-leveldown]: https://github.com/Level/abstract-leveldown

[leveldown]: https://github.com/Level/leveldown

[level]: https://github.com/Level/level

[level-codec]: https://github.com/Level/codec

[builtin-encodings]: https://github.com/Level/codec#builtin-encodings

[encoding-format]: https://github.com/Level/codec#encoding-format
