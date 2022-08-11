# level-iterator-stream

> Turn an [abstract-leveldown](https://github.com/Level/abstract-leveldown) iterator into a readable stream.

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/level-iterator-stream.svg?label=&logo=npm)](https://www.npmjs.com/package/level-iterator-stream)
[![Node version](https://img.shields.io/node/v/level-iterator-stream.svg)](https://www.npmjs.com/package/level-iterator-stream)
[![Travis](https://img.shields.io/travis/com/Level/iterator-stream.svg?logo=travis&label=)](https://travis-ci.com/Level/iterator-stream)
[![Coverage Status](https://coveralls.io/repos/github/Level/iterator-stream/badge.svg)](https://coveralls.io/github/Level/iterator-stream)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dm/level-iterator-stream.svg?label=dl)](https://www.npmjs.com/package/level-iterator-stream)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## Usage

**If you are upgrading:** please see [UPGRADING.md](UPGRADING.md).

```js
var iteratorStream = require('level-iterator-stream')
var leveldown = require('leveldown')

var db = leveldown(__dirname + '/db')
db.open(function (err) {
  if (err) throw err

  var stream = iteratorStream(db.iterator())
  stream.on('data', function (kv) {
    console.log('%s -> %s', kv.key, kv.value)
  })
})
```

## Installation

```bash
$ npm install level-iterator-stream
```

## API

### `stream = iteratorStream(iterator[, options])`

Create a readable stream from `iterator`. `options` are passed down to the `require('readable-stream').Readable` constructor, with `objectMode` forced to `true`.

Set `options.keys` or `options.values` to `false` to only get values / keys. Otherwise receive `{ key, value }` objects.

When the stream ends, the `iterator` will be closed and afterwards a `"close"` event emitted.

`.destroy()` will force close the underlying iterator.

## Contributing

[`Level/iterator-stream`](https://github.com/Level/iterator-stream) is an **OPEN Open Source Project**. This means that:

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
