# level-packager

> `levelup` package helper for distributing with an `abstract-leveldown` compatible back-end

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/level-packager.svg?label=&logo=npm)](https://www.npmjs.com/package/level-packager)
[![Node version](https://img.shields.io/node/v/level-packager.svg)](https://www.npmjs.com/package/level-packager)
[![Travis](https://img.shields.io/travis/com/Level/packager.svg?logo=travis&label=)](https://travis-ci.com/Level/packager)
[![Coverage Status](https://coveralls.io/repos/github/Level/packager/badge.svg)](https://coveralls.io/github/Level/packager)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dm/level-packager.svg?label=dl)](https://www.npmjs.com/package/level-packager)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## API

Exports a single function which takes a single argument, an `abstract-leveldown` compatible storage back-end for [`levelup`](https://github.com/Level/levelup). The function returns a constructor function that will bundle `levelup` with the given `abstract-leveldown` replacement. The full API is supported, including optional functions, `destroy()`, and `repair()`. Encoding functionality is provided by [`encoding-down`](https://github.com/Level/encoding-down).

The constructor function has a `.errors` property which provides access to the different error types from [`level-errors`](https://github.com/Level/errors#api).

For example use-cases, see:

- [`level`](https://github.com/Level/level)
- [`level-mem`](https://github.com/Level/level-mem)
- [`level-hyper`](https://github.com/Level/level-hyper)
- [`level-lmdb`](https://github.com/Level/level-lmdb)

Also available is a _test.js_ file that can be used to verify that the user-package works as expected.

**If you are upgrading:** please see [`UPGRADING.md`](UPGRADING.md).

## Contributing

[`Level/packager`](https://github.com/Level/packager) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level) and [npm](https://www.npmjs.com/) packages. 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2013-present [Contributors](CONTRIBUTORS.md).

[level-badge]: https://leveljs.org/img/badge.svg
