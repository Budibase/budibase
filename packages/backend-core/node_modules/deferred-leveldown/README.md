# deferred-leveldown

> A mock `abstract-leveldown` implementation that queues operations while a real `abstract-leveldown` instance is being opened.

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/deferred-leveldown.svg?label=&logo=npm)](https://www.npmjs.com/package/deferred-leveldown)
[![Node version](https://img.shields.io/node/v/deferred-leveldown.svg)](https://www.npmjs.com/package/deferred-leveldown)
[![Travis](https://img.shields.io/travis/Level/deferred-leveldown.svg?logo=travis&label=)](https://travis-ci.org/Level/deferred-leveldown)
[![Coverage Status](https://coveralls.io/repos/github/Level/deferred-leveldown/badge.svg)](https://coveralls.io/github/Level/deferred-leveldown)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dm/deferred-leveldown.svg?label=dl)](https://www.npmjs.com/package/deferred-leveldown)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

`deferred-leveldown` implements the basic [abstract-leveldown](https://github.com/Level/abstract-leveldown) API so it can be used as a drop-in replacement where `leveldown` is needed.

`put()`, `get()`, `del()`, `batch()` and `clear()` operations are all queued and kept in memory until the `abstract-leveldown`-compatible object has been opened through `deferred-leveldown`'s `open()` method.

`batch()` operations will all be replayed as the array form. Chained-batch operations are converted before being stored.

```js
const deferred  = require('deferred-leveldown')
const leveldown = require('leveldown')

const db = deferred(leveldown('location'))

db.put('foo', 'bar', function (err) {

})

db.open(function (err) {
  // ...
})
```

**If you are upgrading:** please see [UPGRADING.md](UPGRADING.md).

## Contributing

[`Level/deferred-leveldown`](https://github.com/Level/deferred-leveldown) is an **OPEN Open Source Project**. This means that:

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
