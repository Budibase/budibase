# Changelog

## [5.1.1] - 2019-11-29

### Fixed

- Pass options to `abstract-leveldown` store ([#96](https://github.com/Level/packager/issues/96)) ([**@achingbrain**](https://github.com/achingbrain)). In addition to passing options to the `levelup` wrapper.

## [5.1.0] - 2019-10-13

### Added

- Support constructing without location ([#95](https://github.com/Level/packager/issues/95)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Bump `levelup` and `encoding-down` to prevent dedupe ([`cd22e66`](https://github.com/Level/packager/commit/cd22e66)) ([**@vweevers**](https://github.com/vweevers))

## [5.0.3] - 2019-09-08

### Changed

- Upgrade `hallmark` devDependency from `^0.1.0` to `^2.0.0` ([#90](https://github.com/Level/packager/issues/90), [#93](https://github.com/Level/packager/issues/93)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^12.0.0` to `^14.0.0` ([#89](https://github.com/Level/packager/issues/89), [#92](https://github.com/Level/packager/issues/92)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Bump `levelup` and `encoding-down` to prevent dedupe ([`a293d30`](https://github.com/Level/packager/commit/a293d30)) ([**@vweevers**](https://github.com/vweevers))

## [5.0.2] - 2019-06-08

### Changed

- Upgrade `nyc` devDependency from `^13.2.0` to `^14.0.0` ([#85](https://github.com/Level/packager/issues/85)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add `.npmignore` ([`85b9a84`](https://github.com/Level/packager/commit/85b9a84)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Support variadic arguments in `destroy()` and `repair()` ([#88](https://github.com/Level/packager/issues/88)) ([**@vweevers**](https://github.com/vweevers))
- Don't assume existence of a `LOG` file in abstract `destroy-test` ([#87](https://github.com/Level/packager/issues/87)) ([**@vweevers**](https://github.com/vweevers))
- Fix Level badge ([`2429718`](https://github.com/Level/packager/commit/2429718)) ([**@vweevers**](https://github.com/vweevers))
- Remove link to dead website ([`d671d63`](https://github.com/Level/packager/commit/d671d63)) ([**@vweevers**](https://github.com/vweevers))

## [5.0.1] - 2019-03-31

### Changed

- Update `nyc` devDependency from `^12.0.2` to `^13.2.0` ([#84](https://github.com/Level/packager/issues/84)) ([**@vweevers**](https://github.com/vweevers))
- Apply common project tweaks ([#82](https://github.com/Level/packager/issues/82), [#83](https://github.com/Level/packager/issues/83)) ([**@vweevers**](https://github.com/vweevers))

## [5.0.0] - 2018-12-27

### Changed

- Upgrade `encoding-down` from `~5.0.0` to `^6.0.0` ([#80](https://github.com/Level/packager/issues/80), [#81](https://github.com/Level/packager/issues/81)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `levelup` from `^3.0.0` to `^4.0.0` ([#79](https://github.com/Level/packager/issues/79)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `standard` devDependency from `^11.0.0` to `^12.0.0` ([#74](https://github.com/Level/packager/issues/74)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Replace `remark-cli` devDependency with `hallmark` ([#81](https://github.com/Level/packager/issues/81)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add nyc and coveralls ([#73](https://github.com/Level/packager/issues/73)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 9 ([`29fdaf4`](https://github.com/Level/packager/commit/29fdaf4)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [4.0.1] - 2018-06-23

### Changed

- Use `var` instead of `let` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add `remark` tooling ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `'use strict'` to all abstract tests ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `contributors` from `package.json` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [4.0.0] - 2018-06-13

### Changed

- Rewrite `test.js` to test `level-packager` api ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.1.0] - 2018-05-28

### Changed

- Split up tests into `abstract/*-test.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `.jshintrc` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.0.0] - 2018-05-23

### Added

- Add node 10 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `UPGRADING.md` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Update `standard` to `^11.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `encoding-down` to `~5.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `leveldown` to `^4.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `levelup` to `^3.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Change `License & Copyright` to `License` in README ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Replace `const` with `var` for IE10 support ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 4 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.1.1] - 2018-02-13

### Added

- Travis: add 9 ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Update `encoding-down` to `~4.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `leveldown` to `^3.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update copyright year to 2018 ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Test: clean up `level-test-*` dbs after tests are done ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.1.0] - 2017-12-13

### Added

- Add `standard` for linting ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Attach `.errors` from `levelup` to `Level` constructor ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.2] - 2017-11-11

### Changed

- Update `encoding-down` to `~3.0.0` ([**@vweevers**](https://github.com/vweevers))
- README: update node badge ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Travis: restore node 4 ([**@vweevers**](https://github.com/vweevers))

## [2.0.1] - 2017-10-12

### Added

- Test that encoding options default to utf8 ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Test that `.keyEncoding` and `.valueEncoding` are passed to `encoding-down` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix encoding options to `encoding-down` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.0] - 2017-10-11

### Added

- README: add `level` badge ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Update `levelup` to `^2.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `encoding-down` to `~2.3.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `leveldown` to `^2.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: update npm badges to similar badge style ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- README: Remove Greenkeeper badge ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.0-rc3] - 2017-09-16

### Changed

- Update `levelup` to `2.0.0-rc3` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `leveldown` to `^1.8.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.0-rc2] - 2017-09-12

### Changed

- Update `levelup` to `2.0.0-rc2` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `encoding-down` to `~2.2.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.0-rc1] - 2017-09-04

### Added

- Travis: add 8 ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: add Greenkeeper badge ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: add node badge ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- README: steer away from `LevelDOWN` to `abstract-leveldown` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update copyright year to 2017 ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Travis: remove 0.12, 4, 5 and 7 ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

## [1.2.1] - 2016-12-27

### Added

- Travis: add 6 and 7 ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Travis: use gcc 4.8 ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Travis: remove 0.10, 1.0, 1.8, 2 and 3 ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.2.0] - 2015-11-27

### Added

- Add dependency badge ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Travis: add 1.0, 2, 3, 4 and 5 ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Update `levelup` to `~1.3.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `leveldown` to `^1.4.2` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.1.0] - 2015-06-09

### Changed

- Update `levelup` to `~1.2.0` ([**@mcollina**](https://github.com/mcollina))
- Update `leveldown` to `~1.2.2` ([**@mcollina**](https://github.com/mcollina))

## [1.0.0] - 2015-05-19

### Changed

- README: add link to `level/community` repo ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.0.0-0] - 2015-05-16

### Added

- Add Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `leveldown` dev dependency ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Update `levelup` to `~1.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Run tests using `packager(leveldown)` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `level` dependency ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [0.19.7] - 2015-05-10

### Added

- Add `level-test-*` to `.gitignore` ([**@juliangruber**](https://github.com/juliangruber))

### Changed

- Run the tests if they are not required ([**@juliangruber**](https://github.com/juliangruber))
- Rename the repository to `packager` ([**@juliangruber**](https://github.com/juliangruber))

## [0.19.6] - 2015-05-10

### Fixed

- Fix incorrect options logic ([**@juliangruber**](https://github.com/juliangruber))

## [0.19.5] - 2015-05-10

### Fixed

- Fixed bug with missing opening curly brace ([**@juliangruber**](https://github.com/juliangruber))

## [0.19.4] - 2015-05-10

### Changed

- Use `typeof` instead of `util.isFunction()` ([**@juliangruber**](https://github.com/juliangruber))

## [0.19.3] - 2015-05-10

### Fixed

- Fix missing closing parenthesis ([**@juliangruber**](https://github.com/juliangruber))

## [0.19.2] - 2015-05-10

### Fixed

- Fix missing closing parenthesis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [0.19.1] - 2015-05-10

### Fixed

- `null` options should not be treated as object ([**@deian**](https://github.com/deian))

## [0.19.0] - 2015-05-04

### Changed

- Plain MIT license ([**@andrewrk**](https://github.com/andrewrk))
- README: update logo and copyright year ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `levelup` to `~0.19.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [0.18.0] - 2013-11-18

### Changed

- Bumped version ([**@rvagg**](https://github.com/rvagg))

## [0.17.0] - 2013-10-09

:seedling: Initial release.

**Historical Note** This changelog is ordered by semver-version, but the first few releases here did not use semver-valid tags.

## [0.17.0-5] - 2013-10-12

### Changed

- Clean up debugging noise ([**@rvagg**](https://github.com/rvagg))

## [0.17.0-4] - 2013-10-12

### Removed

- Remove `copy()` ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix `repair()` and `destroy()` ([**@rvagg**](https://github.com/rvagg))

## [0.17.0-3] - 2013-10-12

### Fixed

- Made tests compatible with node 0.8 ([**@rvagg**](https://github.com/rvagg))

## [0.17.0-2] - 2013-10-12

### Added

- Add options to exported tests to handle memdown ([**@rvagg**](https://github.com/rvagg))

### Changed

- README: `level` -> `level-packager` ([**@rvagg**](https://github.com/rvagg))

## 0.17.0-1 - 2013-10-09

### Removed

- Remove `tape` from devDependencies, allow callers to pass in custom test function ([**@rvagg**](https://github.com/rvagg))

[5.1.1]: https://github.com/Level/packager/compare/v5.1.0...v5.1.1

[5.1.0]: https://github.com/Level/packager/compare/v5.0.3...v5.1.0

[5.0.3]: https://github.com/Level/packager/compare/v5.0.2...v5.0.3

[5.0.2]: https://github.com/Level/packager/compare/v5.0.1...v5.0.2

[5.0.1]: https://github.com/Level/packager/compare/v5.0.0...v5.0.1

[5.0.0]: https://github.com/Level/packager/compare/v4.0.1...v5.0.0

[4.0.1]: https://github.com/Level/packager/compare/v4.0.0...v4.0.1

[4.0.0]: https://github.com/Level/packager/compare/v3.1.0...v4.0.0

[3.1.0]: https://github.com/Level/packager/compare/v3.0.0...v3.1.0

[3.0.0]: https://github.com/Level/packager/compare/v2.1.1...v3.0.0

[2.1.1]: https://github.com/Level/packager/compare/v2.1.0...v2.1.1

[2.1.0]: https://github.com/Level/packager/compare/v2.0.2...v2.1.0

[2.0.2]: https://github.com/Level/packager/compare/v2.0.1...v2.0.2

[2.0.1]: https://github.com/Level/packager/compare/v2.0.0...v2.0.1

[2.0.0]: https://github.com/Level/packager/compare/v2.0.0-rc3...v2.0.0

[2.0.0-rc3]: https://github.com/Level/packager/compare/v2.0.0-rc2...v2.0.0-rc3

[2.0.0-rc2]: https://github.com/Level/packager/compare/v2.0.0-rc1...v2.0.0-rc2

[2.0.0-rc1]: https://github.com/Level/packager/compare/v1.2.1...v2.0.0-rc1

[1.2.1]: https://github.com/Level/packager/compare/v1.2.0...v1.2.1

[1.2.0]: https://github.com/Level/packager/compare/v1.1.0...v1.2.0

[1.1.0]: https://github.com/Level/packager/compare/v1.0.0...v1.1.0

[1.0.0]: https://github.com/Level/packager/compare/v1.0.0-0...v1.0.0

[1.0.0-0]: https://github.com/Level/packager/compare/v0.19.7...v1.0.0-0

[0.19.7]: https://github.com/Level/packager/compare/v0.19.6...v0.19.7

[0.19.6]: https://github.com/Level/packager/compare/v0.19.5...v0.19.6

[0.19.5]: https://github.com/Level/packager/compare/v0.19.4...v0.19.5

[0.19.4]: https://github.com/Level/packager/compare/v0.19.3...v0.19.4

[0.19.3]: https://github.com/Level/packager/compare/v0.19.2...v0.19.3

[0.19.2]: https://github.com/Level/packager/compare/v0.19.1...v0.19.2

[0.19.1]: https://github.com/Level/packager/compare/v0.19.0...v0.19.1

[0.19.0]: https://github.com/Level/packager/compare/0.18.0...v0.19.0

[0.18.0]: https://github.com/Level/packager/compare/0.17.0...0.18.0

[0.17.0]: https://github.com/Level/packager/compare/0.17.0-5...0.17.0

[0.17.0-5]: https://github.com/Level/packager/compare/0.17.0-4...0.17.0-5

[0.17.0-4]: https://github.com/Level/packager/compare/0.17.0-3...0.17.0-4

[0.17.0-3]: https://github.com/Level/packager/compare/0.17.0-2...0.17.0-3

[0.17.0-2]: https://github.com/Level/packager/compare/0.17.0-1...0.17.0-2
