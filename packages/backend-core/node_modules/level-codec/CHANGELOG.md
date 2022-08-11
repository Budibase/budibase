# Changelog

_**If you are upgrading:** please see [`UPGRADING.md`](UPGRADING.md)._

## [9.0.2] - 2020-06-26

### Changed

- Upgrade `hallmark` devDependency from `^0.1.0` to `^2.0.0` ([#53](https://github.com/Level/codec/issues/53), [#56](https://github.com/Level/codec/issues/56)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^12.0.0` to `^14.0.0` ([#52](https://github.com/Level/codec/issues/52), [#55](https://github.com/Level/codec/issues/55)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `nyc` devDependency from `^13.2.0` to `^14.0.0` ([#50](https://github.com/Level/codec/issues/50))  ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Add `buffer` dependency for browsers ([#58](https://github.com/Level/codec/issues/58)) ([**@hugomrdias**](https://github.com/hugomrdias))

## [9.0.1] - 2019-04-01

### Changed

- Upgrade `standard` devDependency from `^11.0.1` to `^12.0.0` ([#38](https://github.com/Level/codec/issues/38)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update description in README and `package.json` ([#47](https://github.com/Level/codec/issues/47)) ([**@vweevers**](https://github.com/vweevers))
- Apply common project tweaks ([#39](https://github.com/Level/codec/issues/39), [#40](https://github.com/Level/codec/issues/40), [#41](https://github.com/Level/codec/issues/41)) ([**@vweevers**](https://github.com/vweevers))
- Tweak copyright year for less maintenance ([`79d2d02`](https://github.com/Level/codec/commit/79d2d02)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add `nyc` and `coveralls` ([#36](https://github.com/Level/codec/issues/36), [#44](https://github.com/Level/codec/issues/44)) ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers))
- Add `CHANGELOG.md` and `UPGRADING.md` ([#47](https://github.com/Level/codec/issues/47)) ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove node 9 from travis ([`ffe3f92`](https://github.com/Level/codec/commit/ffe3f92)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove experimental typings ([`1cfd23f`](https://github.com/Level/codec/commit/1cfd23f)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix subtests by adding `t.plan()` ([#46](https://github.com/Level/codec/issues/46)) ([**@vweevers**](https://github.com/vweevers))

## [9.0.0] - 2018-05-12

### Changed

- Update README ([#31](https://github.com/Level/codec/issues/31)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add `standard` ([#29](https://github.com/Level/codec/issues/29)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add node 9 and 10 ([`9476e58`](https://github.com/Level/codec/commit/9476e58)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Drop node 0.12, 4, 5 and 7 ([`9476e58`](https://github.com/Level/codec/commit/9476e58), [#32](https://github.com/Level/codec/issues/32)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix constructor to work without `new` ([#30](https://github.com/Level/codec/issues/30)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [8.0.0] - 2017-10-21

### Changed

- Revert "fix utf-8 encoding returning buffers" ([#23](https://github.com/Level/codec/issues/23)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add badges to `README` and stylize "levelup" ([#22](https://github.com/Level/codec/issues/22)) ([**@vweevers**](https://github.com/vweevers))
- Document encodings and their format in greater detail ([#22](https://github.com/Level/codec/issues/22)) ([**@vweevers**](https://github.com/vweevers))

## [7.1.0] - 2017-09-12

### Changed

- Update copyright year from 2015 to 2017 ([`aceb6ff`](https://github.com/Level/codec/commit/aceb6ff)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add basic typings ([#18](https://github.com/Level/codec/issues/18)) ([**@MeirionHughes**](https://github.com/MeirionHughes))
- Add node 4, 5, 6, 7 and 8 ([`5c00a1c`](https://github.com/Level/codec/commit/5c00a1c)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Drop node 0.10 and iojs ([`5c00a1c`](https://github.com/Level/codec/commit/5c00a1c)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [7.0.1] - 2017-08-14

### Added

- Add Greenkeeper ([#17](https://github.com/Level/codec/issues/17)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Use `identity` function consistently ([#14](https://github.com/Level/codec/issues/14)) ([**@dcousens**](https://github.com/dcousens))

## [7.0.0] - 2017-01-26

### Fixed

- Fix utf-8 encoding returning buffers ([#12](https://github.com/Level/codec/issues/12)) ([**@juliangruber**](https://github.com/juliangruber))

## [6.2.0] - 2016-02-24

### Changed

- Rename "id" encoding to "none", add "id" alias ([#10](https://github.com/Level/codec/issues/10)) ([**@juliangruber**](https://github.com/juliangruber))
- Upgrade `tape` devDependency ([#9](https://github.com/Level/codec/issues/9)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Document available encodings ([#10](https://github.com/Level/codec/issues/10)) ([**@juliangruber**](https://github.com/juliangruber))

## [6.1.0] - 2015-10-21

### Added

- Fallback to legacy `encoding` option if `valueEncoding` is not provided ([#8](https://github.com/Level/codec/issues/8)) ([**@dominictarr**](https://github.com/dominictarr))

## [6.0.0] - 2015-05-04

### Changed

- Replace `createDecodeStream()` with `createStreamDecoder()` ([#6](https://github.com/Level/codec/issues/6)) ([**@juliangruber**](https://github.com/juliangruber))

## [5.5.0] - 2015-04-17

### Added

- Add `createDecodeStream()` ([#5](https://github.com/Level/codec/issues/5)) ([**@juliangruber**](https://github.com/juliangruber))

## [5.4.0] - 2015-04-17

### Changed

- Simplify `encodeLtgt()` ([`24f3817`](https://github.com/Level/codec/commit/24f3817)) ([**@juliangruber**](https://github.com/juliangruber))

## [5.3.0] - 2015-04-17

### Added

- Add `encodeLtgt()` ([#4](https://github.com/Level/codec/issues/4)) ([**@juliangruber**](https://github.com/juliangruber))

## [5.2.0] - 2015-03-24

### Changed

- Make all options optional ([`4f942eb`](https://github.com/Level/codec/commit/4f942eb)) ([**@juliangruber**](https://github.com/juliangruber))

## [5.1.0] - 2015-03-24

### Changed

- Make member options optional ([`0c98ccb`](https://github.com/Level/codec/commit/0c98ccb)) ([**@juliangruber**](https://github.com/juliangruber))

## [5.0.0] - 2015-03-24

**Historical Note** 4.3.0 was meant to be a major release.

## [4.3.0] - 2015-03-24

### Changed

- Rewrite ([`37f103e`](https://github.com/Level/codec/commit/37f103e), [`054fb3f`](https://github.com/Level/codec/commit/054fb3f), [`f510a90`](https://github.com/Level/codec/commit/f510a90)) ([**@juliangruber**](https://github.com/juliangruber))

### Added

- Add [**@ralphtheninja**](https://github.com/ralphtheninja) to contributors ([`dd2b9a0`](https://github.com/Level/codec/commit/dd2b9a0)) ([**@juliangruber**](https://github.com/juliangruber))
- Add travis and licensing ([#1](https://github.com/Level/codec/issues/1)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [4.2.0] - 2015-03-19

### Fixed

- Keep batch `.prefix` for `level-sublevel` ([`f706482`](https://github.com/Level/codec/commit/f706482)) ([**@juliangruber**](https://github.com/juliangruber))

## [4.1.0] - 2015-03-19

### Fixed

- Set `batch` encodings to binary if `{key,value}AsBuffer` is true ([`bcf6feb`](https://github.com/Level/codec/commit/bcf6feb)) ([**@juliangruber**](https://github.com/juliangruber))

## [4.0.1] - 2015-03-19

### Fixed

- Skip falsy objects in `walk` ([`270ea17`](https://github.com/Level/codec/commit/270ea17)) ([**@juliangruber**](https://github.com/juliangruber))

## [4.0.0] - 2015-03-19

### Removed

- Remove default encoding ([`28a63b2`](https://github.com/Level/codec/commit/28a63b2)) ([**@juliangruber**](https://github.com/juliangruber))

## [3.1.0] - 2015-03-19

### Added

- Add experimental `Codec` class ([`8a189f4`](https://github.com/Level/codec/commit/8a189f4)) ([**@juliangruber**](https://github.com/juliangruber))

## [3.0.0] - 2015-03-18

### Removed

- Remove `encoding` option in favor of `keyEncoding` and `valueEncoding` ([`9fed84d`](https://github.com/Level/codec/commit/9fed84d)) ([**@juliangruber**](https://github.com/juliangruber))

## [2.0.1] - 2015-03-18

### Fixed

- Fix `encoding` option to only be an alias for `valueEncoding` ([`b4de4d1`](https://github.com/Level/codec/commit/b4de4d1)) ([**@juliangruber**](https://github.com/juliangruber))

## [2.0.0] - 2015-03-18

### Changed

- Remove side effects from `batch()` ([`bedaa26`](https://github.com/Level/codec/commit/bedaa26), [`6f5b373`](https://github.com/Level/codec/commit/6f5b373), [`abef01b`](https://github.com/Level/codec/commit/abef01b)) ([**@juliangruber**](https://github.com/juliangruber))

## [1.2.1] - 2015-03-18

### Fixed

- Fix `require` statements for `{key,value}AsBuffer()` ([`71bf7a5`](https://github.com/Level/codec/commit/71bf7a5)) ([**@juliangruber**](https://github.com/juliangruber))

## [1.2.0] - 2015-03-18

### Added

- Add `{key,value}AsBuffer()` ([`796a540`](https://github.com/Level/codec/commit/796a540)) ([**@juliangruber**](https://github.com/juliangruber))

## [1.1.0] - 2015-03-18

### Added

- Add `decode{Key,Value}` ([`029fbd7`](https://github.com/Level/codec/commit/029fbd7)) ([**@juliangruber**](https://github.com/juliangruber))

## 1.0.1 - 2015-03-18

:seedling: Initial release.

[9.0.2]: https://github.com/Level/codec/compare/v9.0.1...v9.0.2

[9.0.1]: https://github.com/Level/codec/compare/v9.0.0...v9.0.1

[9.0.0]: https://github.com/Level/codec/compare/v8.0.0...v9.0.0

[8.0.0]: https://github.com/Level/codec/compare/v7.1.0...v8.0.0

[7.1.0]: https://github.com/Level/codec/compare/v7.0.1...v7.1.0

[7.0.1]: https://github.com/Level/codec/compare/v7.0.0...v7.0.1

[7.0.0]: https://github.com/Level/codec/compare/v6.2.0...v7.0.0

[6.2.0]: https://github.com/Level/codec/compare/v6.1.0...v6.2.0

[6.1.0]: https://github.com/Level/codec/compare/v6.0.0...v6.1.0

[6.0.0]: https://github.com/Level/codec/compare/v5.5.0...v6.0.0

[5.5.0]: https://github.com/Level/codec/compare/v5.4.0...v5.5.0

[5.4.0]: https://github.com/Level/codec/compare/v5.3.0...v5.4.0

[5.3.0]: https://github.com/Level/codec/compare/v5.2.0...v5.3.0

[5.2.0]: https://github.com/Level/codec/compare/v5.1.0...v5.2.0

[5.1.0]: https://github.com/Level/codec/compare/v5.0.0...v5.1.0

[5.0.0]: https://github.com/Level/codec/compare/v4.3.0...v5.0.0

[4.3.0]: https://github.com/Level/codec/compare/v4.2.0...v4.3.0

[4.2.0]: https://github.com/Level/codec/compare/v4.1.0...v4.2.0

[4.1.0]: https://github.com/Level/codec/compare/v4.0.1...v4.1.0

[4.0.1]: https://github.com/Level/codec/compare/v4.0.0...v4.0.1

[4.0.0]: https://github.com/Level/codec/compare/v3.1.0...v4.0.0

[3.1.0]: https://github.com/Level/codec/compare/v3.0.0...v3.1.0

[3.0.0]: https://github.com/Level/codec/compare/v2.0.1...v3.0.0

[2.0.1]: https://github.com/Level/codec/compare/v2.0.0...v2.0.1

[2.0.0]: https://github.com/Level/codec/compare/v1.2.1...v2.0.0

[1.2.1]: https://github.com/Level/codec/compare/v1.2.0...v1.2.1

[1.2.0]: https://github.com/Level/codec/compare/v1.1.0...v1.2.0

[1.1.0]: https://github.com/Level/codec/compare/v1.0.1...v1.1.0
