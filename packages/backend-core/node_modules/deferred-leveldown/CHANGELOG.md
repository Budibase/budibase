# Changelog

## [5.3.0] - 2019-10-04

### Added

- Add manifest ([Level/community#83](https://github.com/Level/community/issues/83)) ([#79](https://github.com/Level/deferred-leveldown/issues/79)) ([**@vweevers**](https://github.com/vweevers))
- Include abstract test suite ([#77](https://github.com/Level/deferred-leveldown/issues/77)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Pass db to `AbstractIterator` ([#77](https://github.com/Level/deferred-leveldown/issues/77)) ([**@vweevers**](https://github.com/vweevers))

## [5.2.1] - 2019-09-17

### Fixed

- Create iterators in order and add `type` property for `reachdown` ([#75](https://github.com/Level/deferred-leveldown/issues/75)) ([**@vweevers**](https://github.com/vweevers))

## [5.2.0] - 2019-09-06

### Changed

- Upgrade `abstract-leveldown` from `~6.0.0` to `~6.1.0` ([#72](https://github.com/Level/deferred-leveldown/issues/72)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `hallmark` devDependency from `^0.1.0` to `^2.0.0` ([#70](https://github.com/Level/deferred-leveldown/issues/70), [#74](https://github.com/Level/deferred-leveldown/issues/74)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^12.0.0` to `^14.0.0` ([#69](https://github.com/Level/deferred-leveldown/issues/69), [#73](https://github.com/Level/deferred-leveldown/issues/73)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Defer `db.clear()` and `db.compactRange()` ([#72](https://github.com/Level/deferred-leveldown/issues/72))

## [5.1.0] - 2019-06-22

### Changed

- Update `nyc` devDependency from `^13.2.0` to `^14.0.0` ([#66](https://github.com/Level/deferred-leveldown/issues/66)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Support seeking ([#68](https://github.com/Level/deferred-leveldown/issues/68)) ([**@MeirionHughes**](https://github.com/MeirionHughes))

## [5.0.1] - 2019-03-31

### Changed

- Upgrade `nyc` devDependency from `^12.0.2` to `^13.2.0` ([#63](https://github.com/Level/deferred-leveldown/issues/63)) ([**@vweevers**](https://github.com/vweevers))
- Apply common project tweaks ([#61](https://github.com/Level/deferred-leveldown/issues/61), [#62](https://github.com/Level/deferred-leveldown/issues/62), [`c4d169e`](https://github.com/Level/deferred-leveldown/commit/c4d169e)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Fix subtests by adding `t.plan()` ([#65](https://github.com/Level/deferred-leveldown/issues/65)) ([**@vweevers**](https://github.com/vweevers))

## [5.0.0] - 2018-12-21

### Changed

- Upgrade `abstract-leveldown` dependency from `~5.0.0` to `~6.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `standard` devDependency from `^11.0.0` to `^12.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Tweak copyright years for less maintenance ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add `nyc` and `coveralls` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove contributors from `package.json` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove node 9 ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [4.0.2] - 2018-05-30

### Changed

- Replace `util.inherits` with `inherits` module ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [4.0.1] - 2018-05-22

### Changed

- Upgrade `abstract-leveldown` to `5.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [4.0.0] - 2018-05-13

### Added

- Add node 10 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade to `standard@11.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 4 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.0.0] - 2018-02-08

### Added

- Add `9` to travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade to `abstract-leveldown@4.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove  `DeferredLevelDOWN.prototype._isBuffer`, no longer needed since we use `Buffer.isBuffer()` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Defer `approximateSize()` separately ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Fix broken link in `README` and clean up old `.jshintrc` ([**@ralphtheninja**](https://github.com/ralphtheninja))

**Historical Note** `abstract-leveldown@4.0.0` dropped `approximateSize()` so we needed to defer this method separately for stores that support it.

## [2.0.3] - 2017-11-04

### Added

- Add `4` to travis ([**@vweevers**](https://github.com/vweevers))
- Add node badge ([**@vweevers**](https://github.com/vweevers))

### Changed

- Upgrade to `abstract-leveldown@3.0.0` ([**@vweevers**](https://github.com/vweevers))

**Historical Note** `abstract-leveldown@3.0.0` dropped support for node `0.12` and didn't have any breaking changes to api or behavior, hence a new patch version.

## [2.0.2] - 2017-10-06

### Added

- Add `standard` for linting ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Use svg instead of png for travis badge ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update to new badge setup ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- `_serializeKey()` and `_serializeValue()` should not modify keys or values ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.1] - 2017-09-12

### Added

- Add Greenkeeper badge ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `6` and `8` to travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade to `abstract-leveldown@2.7.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `0.8`, `0.10` and `0.11` from travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.0] - 2017-07-30

### Changed

- Update dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update copyright years ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.0-2] - 2015-05-28

### Fixed

- Fix `.iterator()` after db is opened ([**@juliangruber**](https://github.com/juliangruber))

## [2.0.0-1] - 2015-05-28

No changes.

## [2.0.0-0] - 2015-05-27

### Changed

- Upgrade to `abstract-leveldown@2.4.0` for `.status` ([**@juliangruber**](https://github.com/juliangruber))
- Change api to `leveldown` api ([**@juliangruber**](https://github.com/juliangruber))

## [1.2.2] - 2017-07-30

### Added

- Add `4`, `6` and `7` to travis ([**@juliangruber**](https://github.com/juliangruber))
- Add `8` to travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Update `tape` and `abstract-leveldown` dependencies ([**@juliangruber**](https://github.com/juliangruber))

### Removed

- Remove `0.10` from travis ([**@juliangruber**](https://github.com/juliangruber))

## [1.2.1] - 2015-08-14

### Added

- Add `0.12`, `2.5` and `3.0` to travis ([**@juliangruber**](https://github.com/juliangruber))

### Removed

- Remove `0.8` and `0.11` from travis ([**@juliangruber**](https://github.com/juliangruber))

### Fixed

- Fix iterator after `setDb` case ([**@substack**](https://github.com/substack))
- Fix broken travis link ([**@juliangruber**](https://github.com/juliangruber))

## [1.2.0] - 2015-05-28

### Changed

- Upgrade to `abstract-leveldown@2.4.0` for `.status` ([**@juliangruber**](https://github.com/juliangruber))

## [1.1.0] - 2015-05-22

### Changed

- Export `DeferredIterator` ([**@juliangruber**](https://github.com/juliangruber))

## [1.0.0] - 2015-04-28

### Changed

- Upgrade to `abstract-leveldown@2.1.2` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [0.3.0] - 2015-04-16

### Added

- Add support for deferred iterators ([**@juliangruber**](https://github.com/juliangruber))

### Changed

- Change to plain `MIT` license ([**@andrewrk**](https://github.com/andrewrk))
- Update logo and copyright ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [0.2.0] - 2014-04-26

### Removed

- Remove `bops` and replace with `Buffer` ([**@rvagg**](https://github.com/rvagg))

## [0.1.0] - 2013-10-14

### Changed

- `location` passed to `AbstractLevelDOWN` constructor is optional ([**@rvagg**](https://github.com/rvagg))

### Removed

- Remove `npm-dl` badge ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix broken travis badge ([**@rvagg**](https://github.com/rvagg))
- Fix links from `rvagg/` to `Level/` ([**@rvagg**](https://github.com/rvagg))

## [0.0.1] - 2013-09-30

### Added

- Add tests ([**@rvagg**](https://github.com/rvagg))
- Add node `0.10` and `0.11` to travis ([**@rvagg**](https://github.com/rvagg))

### Changed

- Update documentation ([**@rvagg**](https://github.com/rvagg))

## 0.0.0 - 2013-09-17

:seedling: First release. ([**@rvagg**](https://github.com/rvagg))

[5.3.0]: https://github.com/Level/deferred-leveldown/compare/v5.2.1...v5.3.0

[5.2.1]: https://github.com/Level/deferred-leveldown/compare/v5.2.0...v5.2.1

[5.2.0]: https://github.com/Level/deferred-leveldown/compare/v5.1.0...v5.2.0

[5.1.0]: https://github.com/Level/deferred-leveldown/compare/v5.0.1...v5.1.0

[5.0.1]: https://github.com/Level/deferred-leveldown/compare/v5.0.0...v5.0.1

[5.0.0]: https://github.com/Level/deferred-leveldown/compare/v4.0.2...v5.0.0

[4.0.2]: https://github.com/Level/deferred-leveldown/compare/v4.0.1...v4.0.2

[4.0.1]: https://github.com/Level/deferred-leveldown/compare/v4.0.0...v4.0.1

[4.0.0]: https://github.com/Level/deferred-leveldown/compare/v3.0.0...v4.0.0

[3.0.0]: https://github.com/Level/deferred-leveldown/compare/v2.0.3...v3.0.0

[2.0.3]: https://github.com/Level/deferred-leveldown/compare/v2.0.2...v2.0.3

[2.0.2]: https://github.com/Level/deferred-leveldown/compare/v2.0.1...v2.0.2

[2.0.1]: https://github.com/Level/deferred-leveldown/compare/v2.0.0...v2.0.1

[2.0.0]: https://github.com/Level/deferred-leveldown/compare/v2.0.0-2...v2.0.0

[2.0.0-2]: https://github.com/Level/deferred-leveldown/compare/v2.0.0-1...v2.0.0-2

[2.0.0-1]: https://github.com/Level/deferred-leveldown/compare/v2.0.0-0...v2.0.0-1

[2.0.0-0]: https://github.com/Level/deferred-leveldown/compare/v1.2.2...v2.0.0-0

[1.2.2]: https://github.com/Level/deferred-leveldown/compare/v1.2.1...v1.2.2

[1.2.1]: https://github.com/Level/deferred-leveldown/compare/v1.2.0...v1.2.1

[1.2.0]: https://github.com/Level/deferred-leveldown/compare/v1.1.0...v1.2.0

[1.1.0]: https://github.com/Level/deferred-leveldown/compare/v1.0.0...v1.1.0

[1.0.0]: https://github.com/Level/deferred-leveldown/compare/v0.3.0...v1.0.0

[0.3.0]: https://github.com/Level/deferred-leveldown/compare/v0.2.0...v0.3.0

[0.2.0]: https://github.com/Level/deferred-leveldown/compare/0.1.0...v0.2.0

[0.1.0]: https://github.com/Level/deferred-leveldown/compare/0.0.1...0.1.0

[0.0.1]: https://github.com/Level/deferred-leveldown/compare/0.0.0...0.0.1
