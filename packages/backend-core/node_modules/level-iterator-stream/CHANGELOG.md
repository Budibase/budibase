# Changelog

_**If you are upgrading:** please see [`UPGRADING.md`](UPGRADING.md)._

## [4.0.2] - 2019-10-05

### Changed

- Upgrade `hallmark` devDependency from `^0.1.0` to `^2.0.0` ([#58](https://github.com/Level/iterator-stream/issues/58), [#61](https://github.com/Level/iterator-stream/issues/61)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^12.0.0` to `^14.0.0` ([#57](https://github.com/Level/iterator-stream/issues/57), [#60](https://github.com/Level/iterator-stream/issues/60)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `nyc` devDependency from `^13.2.0` to `^14.0.0` ([#55](https://github.com/Level/iterator-stream/issues/55)) ([**@vweevers**](https://github.com/vweevers))
- Tweak tests ([#62](https://github.com/Level/iterator-stream/issues/62)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Test that stream keeps a reference to the iterator ([`16a4dd5`](https://github.com/Level/iterator-stream/commit/16a4dd5)) ([**@vweevers**](https://github.com/vweevers))

## [4.0.1] - 2019-03-30

### Changed

- Upgrade `leveldown` devDependency from `^4.0.0` to `^5.0.0` ([#52](https://github.com/Level/iterator-stream/issues/52)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `nyc` devDependency from `^12.0.2` to `^13.2.0` ([#51](https://github.com/Level/iterator-stream/issues/51)) ([**@vweevers**](https://github.com/vweevers))
- Apply common project tweaks ([#49](https://github.com/Level/iterator-stream/issues/49), [#50](https://github.com/Level/iterator-stream/issues/50), [`fece33a`](https://github.com/Level/iterator-stream/commit/fece33a), [`b3b3b6c`](https://github.com/Level/iterator-stream/commit/b3b3b6c)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Fix reference to undefined definition in `CHANGELOG.md` ([`aa88961`](https://github.com/Level/iterator-stream/commit/aa88961)) ([**@vweevers**](https://github.com/vweevers))

## [4.0.0] - 2018-12-17

### Changed

- Upgrade `through2` devDependency from `^2.0.0` to `^3.0.0` ([**@vweevers**](https://github.com/vweevers))
- Upgrade `readable-stream` dependency from `^2.0.5` to `^3.0.2` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `standard` devDependency from `^11.0.0` to `^12.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add `nyc` and `coveralls` ([#39](https://github.com/Level/iterator-stream/issues/39)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 9 ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.0.1] - 2018-10-18

### Fixed

- Bump `readable-stream` from `^2.0` to `^2.3` to prevent npm dedupe and ensure it has `#destroy()` ([**@vweevers**](https://github.com/vweevers))

## [3.0.0] - 2018-06-28

### Changed

- Proper destroy ([#34](https://github.com/Level/iterator-stream/issues/34)) ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove node 4 ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.3] - 2018-06-28

### Fixed

- Revert proper destroy ([#34](https://github.com/Level/iterator-stream/issues/34)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

**Historical Note** The previous release was meant to restore node 4 and included an additional change by mistake.

## [2.0.2] - 2018-06-28

### Changed

- Restore node 4 ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Proper destroy ([#34](https://github.com/Level/iterator-stream/issues/34)) ([**@vweevers**](https://github.com/vweevers))

**Historical Note** We made a mistake releasing `v2.0.1` with the `engines` field in `package.json` set to node 6 as minimal version. This caused problems for users of yarn. We therefore released `v2.0.2` which restored node 4 and a new major directly after this.

## [2.0.1] - 2018-06-10

### Changed

- Upgrade `leveldown` devDependency from `^1.4.1` to `^4.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `standard` devDependency from `^10.0.3` to `^11.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add node 9 and 10 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `UPGRADING.md` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 7 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.0] - 2017-08-28

### Changed

- Upgrade `readable-stream` from `^1.0.33` to `^2.0.5` ([**@greenkeeper**](https://github.com/greenkeeper), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `tape` devDependency from `^3.5.0` to `^4.4.0` ([**@greenkeeper**](https://github.com/greenkeeper), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `through2` devDependency from `^0.6.3` to `^2.0.0` ([**@greenkeeper**](https://github.com/greenkeeper), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `leveldown` devDependency from `^0.10.4` to `^1.4.1` ([**@juliangruber**](https://github.com/juliangruber))
- Update copyright year to 2017 ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update README example using `standard` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add node 6 to Travis ([**@greenkeeper**](https://github.com/greenkeeper), [**@juliangruber**](https://github.com/juliangruber))
- Add node 7 and 8 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add Greenkeeper ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `standard` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Test `.destroy()` during and after `iterator.next()` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 0.10, 0.12 and iojs from Travis ([**@greenkeeper**](https://github.com/greenkeeper), [**@juliangruber**](https://github.com/juliangruber))
- Remove encodings ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove Makefile ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.3.1] - 2015-08-17

### Changed

- Update `.repository` path in `package.json` ([**@timoxley**](https://github.com/timoxley))

### Fixed

- Use `level-codec` from npm ([**@juliangruber**](https://github.com/juliangruber))

## [1.3.0] - 2015-05-05

### Fixed

- Emit `'close'` after `'error'` ([**@juliangruber**](https://github.com/juliangruber))

## [1.2.0] - 2015-05-04

### Added

- Add `.decoder` option to constructor for decoding keys and values ([**@juliangruber**](https://github.com/juliangruber))

## [1.1.1] - 2015-03-29

### Added

- Enable Travis and add node 0.10, 0.12 and iojs ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add MIT license ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix race condition in `.destroy()` ([**@juliangruber**](https://github.com/juliangruber))

## [1.1.0] - 2015-03-29

### Added

- Add `.destroy()` ([**@juliangruber**](https://github.com/juliangruber))

## 1.0.0 - 2015-03-29

:seedling: Initial release.

[4.0.2]: https://github.com/Level/iterator-stream/compare/v4.0.1...v4.0.2

[4.0.1]: https://github.com/Level/iterator-stream/compare/v4.0.0...v4.0.1

[4.0.0]: https://github.com/Level/iterator-stream/compare/v3.0.1...v4.0.0

[3.0.1]: https://github.com/Level/iterator-stream/compare/v3.0.0...v3.0.1

[3.0.0]: https://github.com/Level/iterator-stream/compare/v2.0.3...v3.0.0

[2.0.3]: https://github.com/Level/iterator-stream/compare/v2.0.2...v2.0.3

[2.0.2]: https://github.com/Level/iterator-stream/compare/v2.0.1...v2.0.2

[2.0.1]: https://github.com/Level/iterator-stream/compare/v2.0.0...v2.0.1

[2.0.0]: https://github.com/Level/iterator-stream/compare/v1.3.1...v2.0.0

[1.3.1]: https://github.com/Level/iterator-stream/compare/v1.3.0...v1.3.1

[1.3.0]: https://github.com/Level/iterator-stream/compare/v1.2.0...v1.3.0

[1.2.0]: https://github.com/Level/iterator-stream/compare/v1.1.1...v1.2.0

[1.1.1]: https://github.com/Level/iterator-stream/compare/v1.1.0...v1.1.1

[1.1.0]: https://github.com/Level/iterator-stream/compare/v1.0.0...v1.1.0
