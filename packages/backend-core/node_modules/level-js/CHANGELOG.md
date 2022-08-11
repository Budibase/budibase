# Changelog

_**If you are upgrading:** please see [`UPGRADING.md`](UPGRADING.md)._

## [5.0.2] - 2020-04-03

### Changed

- Use `nextTick` of `abstract-leveldown` ([#195](https://github.com/Level/level-js/issues/195)) ([**@vweevers**](https://github.com/vweevers)) (same underlying code)
- Upgrade `nyc` devDependency from `^14.0.0` to `^15.0.0` ([#187](https://github.com/Level/level-js/issues/187)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `airtap` devDependency from `^2.0.0` to `^3.0.0` ([#189](https://github.com/Level/level-js/issues/189)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Add `buffer` for browsers ([#191](https://github.com/Level/level-js/issues/191)) ([**@hugomrdias**](https://github.com/hugomrdias))

## [5.0.1] - 2019-11-29

### Fixed

- Restore support of empty prefix option ([#184](https://github.com/Level/level-js/issues/184)) ([**@achingbrain**](https://github.com/achingbrain)). This restores a previous behavior (of `level-js` &lt; 3) that unknown to us, was provided by the since-removed `IDBWrapper`.

## [5.0.0] - 2019-10-04

### Changed

- **Breaking**: Drop support of key & value types other than string and Buffer ([#179](https://github.com/Level/level-js/issues/179)) ([**@vweevers**](https://github.com/vweevers))
- Replace mentions of `level-browserify` with `level` ([`58b3e07`](https://github.com/Level/level-js/commit/58b3e07)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `hallmark` devDependency from `^0.1.0` to `^2.0.0` ([#172](https://github.com/Level/level-js/issues/172), [#177](https://github.com/Level/level-js/issues/177)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `nyc` devDependency from `^13.1.0` to `^14.0.0` ([#169](https://github.com/Level/level-js/issues/169)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^12.0.1` to `^14.0.2` ([#171](https://github.com/Level/level-js/issues/171), [`aacb0ea`](https://github.com/Level/level-js/commit/aacb0ea)) ([**@vweevers**](https://github.com/vweevers), [**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add manifest ([Level/community#83](https://github.com/Level/community/issues/83)) ([#183](https://github.com/Level/level-js/issues/183)) ([**@vweevers**](https://github.com/vweevers))
- Support `clear()` ([Level/community#79](https://github.com/Level/community/issues/79)) ([#182](https://github.com/Level/level-js/issues/182)) ([**@vweevers**](https://github.com/vweevers))

## [4.0.1] - 2019-03-31

### Changed

- Apply common project tweaks ([#164](https://github.com/Level/level-js/issues/164), [#165](https://github.com/Level/level-js/issues/165)) ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove outdated sentence about nullish values from README ([#166](https://github.com/Level/level-js/issues/166)) ([**@vweevers**](https://github.com/vweevers))

## [4.0.0] - 2018-12-30

### Changed

- Upgrade `abstract-leveldown` from `~5.0.0` to `~6.0.1` ([#155](https://github.com/Level/level-js/issues/155), [#157](https://github.com/Level/level-js/issues/157)) ([**@vweevers**](https://github.com/vweevers))
- Don't serialize boolean or `NaN` keys, have IDB reject them ([#155](https://github.com/Level/level-js/issues/155)) ([**@vweevers**](https://github.com/vweevers))
- Update test of `key cannot be an empty Array` error ([#155](https://github.com/Level/level-js/issues/155)) ([**@vweevers**](https://github.com/vweevers))
- Change `iterator.db` to reference `level-js` instance, not IDB ([#155](https://github.com/Level/level-js/issues/155)) ([**@vweevers**](https://github.com/vweevers))
- Handle `location` in constructor, as it was removed from `abstract-leveldown` ([#155](https://github.com/Level/level-js/issues/155)) ([**@vweevers**](https://github.com/vweevers))
- Use `level-concat-iterator` and `testCommon.factory()` in custom tests ([#155](https://github.com/Level/level-js/issues/155)) ([**@vweevers**](https://github.com/vweevers))
- Invoke abstract tests from single function ([#155](https://github.com/Level/level-js/issues/155)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `airtap` devDependency from `0.0.7` to `^2.0.0` ([`2b71337`](https://github.com/Level/level-js/commit/2b71337), [#161](https://github.com/Level/level-js/issues/161)) ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^11.0.1` to `^12.0.1` ([#153](https://github.com/Level/level-js/issues/153)) ([**@vweevers**](https://github.com/vweevers), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Replace `remark-cli` devDependency with `hallmark` ([#151](https://github.com/Level/level-js/issues/151), [#153](https://github.com/Level/level-js/issues/153)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Test and document native sort order ([#157](https://github.com/Level/level-js/issues/157)) ([**@vweevers**](https://github.com/vweevers))
- Add iPhone and Android `latest` to test matrix ([#162](https://github.com/Level/level-js/issues/162)) ([**@vweevers**](https://github.com/vweevers))
- Add `nyc` and `coveralls` devDependencies ([#150](https://github.com/Level/level-js/issues/150), [#153](https://github.com/Level/level-js/issues/153)) ([`eb1aead`](https://github.com/Level/level-js/commit/eb1aead)) ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers))
- Add Contributing section to README ([`c94a9a4`](https://github.com/Level/level-js/commit/c94a9a4)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove now irrelevant serialization of nullish values ([#155](https://github.com/Level/level-js/issues/155)) ([**@vweevers**](https://github.com/vweevers))
- Remove unused `IndexedDBShim` from tests ([#162](https://github.com/Level/level-js/issues/162)) ([**@vweevers**](https://github.com/vweevers))

## [3.0.0] - 2018-06-17

### Changed

- Destroy with `location` and `prefix` only ([#116](https://github.com/Level/level-js/issues/116)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Replace `util.inherits` with `inherits` module ([`8db16c1`](https://github.com/Level/level-js/commit/8db16c1)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Change copyright years to "2012-present" ([`7017edd`](https://github.com/Level/level-js/commit/7017edd)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Simplify license description ([#141](https://github.com/Level/level-js/issues/141)) ([**@vweevers**](https://github.com/vweevers))
- Update `package.json` description and keywords ([#141](https://github.com/Level/level-js/issues/141)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add `CHANGELOG.md` ([#107](https://github.com/Level/level-js/issues/107), [#115](https://github.com/Level/level-js/issues/115)) ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers))
- Add `UPGRADING.md` ([#143](https://github.com/Level/level-js/issues/143)) ([**@vweevers**](https://github.com/vweevers))
- Add `CONTRIBUTORS.md` (replaces `COLLABORATORS.md`) ([#141](https://github.com/Level/level-js/issues/141)) ([**@vweevers**](https://github.com/vweevers))
- Add `standard` ([#112](https://github.com/Level/level-js/issues/112)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Document constructor ([#119](https://github.com/Level/level-js/issues/119)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Document type support ([#125](https://github.com/Level/level-js/issues/125), [#143](https://github.com/Level/level-js/issues/143)) ([**@vweevers**](https://github.com/vweevers))
- Add `remark` tooling ([#141](https://github.com/Level/level-js/issues/141), [#143](https://github.com/Level/level-js/issues/143), [#147](https://github.com/Level/level-js/issues/147)) ([**@vweevers**](https://github.com/vweevers))
- Test default and custom prefix ([#124](https://github.com/Level/level-js/issues/124)) ([**@vweevers**](https://github.com/vweevers))
- Test all key types of IndexedDB Second Edition ([#130](https://github.com/Level/level-js/issues/130)) ([**@vweevers**](https://github.com/vweevers))
- Test illegal value types ([#118](https://github.com/Level/level-js/issues/118)) ([**@vweevers**](https://github.com/vweevers))
- Test illegal and stringified key types ([#139](https://github.com/Level/level-js/issues/139)) ([**@vweevers**](https://github.com/vweevers))
- Test `Buffer`, `ArrayBuffer` and `Uint8Array` values with `asBuffer` option ([#146](https://github.com/Level/level-js/issues/146)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Add original copyright owner (Max Ogden) ([#141](https://github.com/Level/level-js/issues/141)) ([**@vweevers**](https://github.com/vweevers))
- Replace `level.js` in documentation to match npm name `level-js` ([#121](https://github.com/Level/level-js/issues/121)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Force airtap's browserify to use latest `buffer@5` ([#122](https://github.com/Level/level-js/issues/122)) ([**@vweevers**](https://github.com/vweevers))
- Don't stringify keys (except fallbacks, booleans and `NaN`) ([#130](https://github.com/Level/level-js/issues/130)) ([**@vweevers**](https://github.com/vweevers))
- Fix conversion of `ArrayBuffer` cursor key to `Buffer` ([#130](https://github.com/Level/level-js/issues/130)) ([**@vweevers**](https://github.com/vweevers))
- Catch IndexedDB key and value errors ([#139](https://github.com/Level/level-js/issues/139)) ([**@vweevers**](https://github.com/vweevers))
- Use `setImmediate` with callback in `_close()` ([#111](https://github.com/Level/level-js/issues/111)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Whitelist npm package files ([#126](https://github.com/Level/level-js/issues/126)) ([**@vweevers**](https://github.com/vweevers))
- Avoid `instanceof Date` for cross-realm support ([#129](https://github.com/Level/level-js/issues/129)) ([**@vweevers**](https://github.com/vweevers))
- Fix wrong release date for `3.0.0-rc1` ([`43a702b`](https://github.com/Level/level-js/commit/43a702b)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `test/levelup-test.js` ([#134](https://github.com/Level/level-js/issues/134)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `levelup` from destroy tests ([#136](https://github.com/Level/level-js/issues/136)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.0.0-rc1] - 2018-05-26

### Changed

- Upgrade `abstract-leveldown` from `0.12.0` to `5.0.0` ([**@vweevers**](https://github.com/vweevers))
- Upgrade `typedarray-to-buffer` from `1.0.0` to `3.1.5` ([**@vweevers**](https://github.com/vweevers))
- Upgrade `levelup` devDependency from `0.18.2` to `3.0.0` ([**@vweevers**](https://github.com/vweevers))
- Upgrade `browserify` devDependency from `4.1.2` to `16.2.2` ([**@vweevers**](https://github.com/vweevers))
- Switch license from BSD to MIT ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Replace `IDBWrapper` with straight IndexedDB code ([**@vweevers**](https://github.com/vweevers))
- Change default database prefix from `IDBWrapper-` to `level-js-` ([**@vweevers**](https://github.com/vweevers))
- Implement abstract `#_serializeKey` with support of all IndexedDB Second Edition types including binary keys (as Buffers) ([**@vweevers**](https://github.com/vweevers))
- Implement abstract `#_serializeValue` with support of all types of the structured clone algorithm except for `null` and `undefined` ([**@vweevers**](https://github.com/vweevers))
- Use `immediate` module for consistent microtask behavior ([**@vweevers**](https://github.com/vweevers))
- Replace `Buffer()` with `Buffer.from()` ([**@vweevers**](https://github.com/vweevers))
- Rename `Iterator#iterator` to `#transaction` ([**@vweevers**](https://github.com/vweevers))
- Replace `beefy` with `airtap --local` for local testing ([**@vweevers**](https://github.com/vweevers))
- Homogenize README title, description and headers ([**@vweevers**](https://github.com/vweevers))
- Make real `tape` tests out of `test-levelup.js` ([**@vweevers**](https://github.com/vweevers))
- Restructure custom tests to follow abstract test suite format ([**@vweevers**](https://github.com/vweevers))

### Added

- Add continuous browser tests with `airtap` and Sauce Labs ([**@vweevers**](https://github.com/vweevers))
- Add `prefix` and `version` options to constructor ([**@vweevers**](https://github.com/vweevers))
- Detect binary key support and fallback to `String(buffer)` ([**@vweevers**](https://github.com/vweevers))
- Detect array key support and fallback to `String(array)` ([**@vweevers**](https://github.com/vweevers))
- Test all value types of the structured clone algorithm ([**@vweevers**](https://github.com/vweevers))
- Catch `DataCloneError` if the environment does not support serializing the type of a key or value ([**@vweevers**](https://github.com/vweevers))
- Include Promise polyfill for `levelup` integration tests ([**@vweevers**](https://github.com/vweevers))
- Test that `Iterator` stringifies `Buffer.from()` argument ([**@vweevers**](https://github.com/vweevers))
- Add README badges, new goals and a code example with `levelup` ([**@vweevers**](https://github.com/vweevers))
- Add npm files to `.gitignore` ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Start `Iterator` cursor immediately and fill an in-memory cache to fulfill `abstract-leveldown` snapshot guarantees ([**@vweevers**](https://github.com/vweevers))
- Stop advancing `Iterator` cursor when `options.limit` is reached ([**@vweevers**](https://github.com/vweevers))
- Rename public `#iterator` to private `#_iterator` ([**@vweevers**](https://github.com/vweevers))
- Fix `#_iterator({ limit: 0 })` to yield 0 entries ([**@vweevers**](https://github.com/vweevers))
- Handle transaction errors in `Iterator` ([**@vweevers**](https://github.com/vweevers))
- Fix constructor to call super ([**@vweevers**](https://github.com/vweevers))
- Make one request at a time in a batch transaction, saving CPU time ([**@vweevers**](https://github.com/vweevers))
- Properly close and destroy db's in custom tests ([**@vweevers**](https://github.com/vweevers))
- Update README links ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove support of `ArrayBuffer` values in favor of `Buffer` ([**@vweevers**](https://github.com/vweevers))
- Remove now unneeded `raw` option from `#_get()` and `#_iterator()` ([**@vweevers**](https://github.com/vweevers))
- Run tests without `IndexedDBShim` ([**@vweevers**](https://github.com/vweevers))
- Remove `Buffer` to `Uint8Array` conversion in `#_put()` and `#_batch()` ([**@vweevers**](https://github.com/vweevers))
- Remove obsolete `#_approximateSize` ([**@vweevers**](https://github.com/vweevers))
- Remove obsolete `#_isBuffer` ([**@vweevers**](https://github.com/vweevers))
- Remove obsolete `testBuffer` from abstract tests ([**@vweevers**](https://github.com/vweevers))
- Remove obsolete writestream test from `test-levelup.js` ([**@vweevers**](https://github.com/vweevers))
- Rely on `abstract-leveldown` defaults in `Iterator` constructor ([**@vweevers**](https://github.com/vweevers))
- Rely on `abstract-leveldown` callback defaults ([**@vweevers**](https://github.com/vweevers))
- Remove testling from `package.json` ([**@vweevers**](https://github.com/vweevers))
- Remove `level.js` logo ([**@vweevers**](https://github.com/vweevers))

**Historical Note** Support of `ArrayBuffer` values was restored in `3.0.0`.

**Historical Note** This release introduced the boolean `binaryKeys` and `arrayKeys` properties on the constructor, indicating whether the environment supports binary and array keys respectively. These properties may become private.

**Historical Note** The vendored `IndexedDBShim` is still included, but likely to be removed.

**Historical Note** Though we upgraded `browserify` to `16.2.2`, the effective version used in tests is `13.3.0` because we switched from `beefy` to `airtap`, which ships with its own `browserify` dependency.

## [2.2.4] - 2016-05-09

### Changed

- Use `toArrayBuffer()` only when present ([**@substack**](https://github.com/substack))

## [2.2.3] - 2015-12-10

### Changed

- Update `ltgt` to `^2.1.2` ([**@ryanramage**](https://github.com/ryanramage))

## [2.2.2] - 2015-09-12

### Added

- Add [**@nolanlawson**](https://github.com/nolanlawson) to collaborators ([**@maxogden**](https://github.com/maxogden))

### Fixed

- Fix iterator when start > end ([**@nolanlawson**](https://github.com/nolanlawson))

**Historical Note** This release introduced `this._keyRangeError`.

## [2.2.1] - 2015-07-05

### Changed

- Update collaborators ([**@maxogden**](https://github.com/maxogden))
- Roll back `abstract-leveldown` to `~0.12.0` ([**@maxogden**](https://github.com/maxogden))

## [2.2.0] - 2015-07-03

### Added

- Add `Collaborators` section to README ([**@maxogden**](https://github.com/maxogden))

### Changed

- Update syntax highlighting in README ([**@yoshuawuyts**](https://github.com/yoshuawuyts))
- Update `idb-wrapper` to `^1.5.0` ([**@JamesKyburz**](https://github.com/JamesKyburz))
- Update `abstract-leveldown` to `^2.4.0` ([**@maxogden**](https://github.com/maxogden))
- Update `tape` to `^4.0.0` ([**@maxogden**](https://github.com/maxogden))
- Move `tape` to devDependencies ([**@maxogden**](https://github.com/maxogden))
- Change license from BSD to BSD-2-Clause ([**@maxogden**](https://github.com/maxogden))

### Removed

- Remove Testling badge ([**@maxogden**](https://github.com/maxogden))

## [2.1.6] - 2014-06-15

### Fixed

- Avoid using keyword in `cursor.continue()` ([**@nolanlawson**](https://github.com/nolanlawson))

## [2.1.5] - 2014-05-29

### Changed

- Use `ltgt` module to handle ranges ([**@dominictarr**](https://github.com/dominictarr))

## [2.1.4] - 2014-05-13

### Changed

- Update `browserify` to `^4.1.2` ([**@maxogden**](https://github.com/maxogden))
- Move `browserify` to devDependencies ([**@maxogden**](https://github.com/maxogden))

## [2.1.3] - 2014-04-09

### Added

- Use `typedarray-to-buffer` to avoid copying to Buffer ([**@mafintosh**](https://github.com/mafintosh))

## [2.1.2] - 2014-04-05

### Added

- Add link to [**@brycebaril**](https://github.com/brycebaril)'s presentation to README ([**@maxogden**](https://github.com/maxogden))

### Changed

- Update browser configuration for Testling ([**@maxogden**](https://github.com/maxogden))

## [2.1.1] - 2014-03-12

### Changed

- Update browser configuration for Testling ([**@maxogden**](https://github.com/maxogden))
- Update `abstract-leveldown` to `~0.12.0` ([**@maxogden**](https://github.com/maxogden))
- Update `levelup` to `~0.18.2` ([**@maxogden**](https://github.com/maxogden))
- Make sure to store `Uint8Array` ([**@maxogden**](https://github.com/maxogden))
- Test storing native JS types with raw = true ([**@maxogden**](https://github.com/maxogden))

**Historical Note** This was not published to npm. There's also a gap between `2.1.1` and `2.0.0` that is inconsistent. The `options.raw` property was introduced in this release.

## [2.0.0] - 2014-03-09

### Changed

- Update `browserify` to `~3.32.0` ([**@maxogden**](https://github.com/maxogden))
- Update `tape` to `~2.10.2` ([**@maxogden**](https://github.com/maxogden))
- Change default encoding of values to strings to more closely match `leveldown` ([**@maxogden**](https://github.com/maxogden))

### Fixed

- Add missing `xtend` dependency ([**@maxogden**](https://github.com/maxogden))

**Historical Note** For some reason both `tape` and `browserify` were moved from devDependencies to dependencies. This release only had one commit.

## [1.2.0] - 2014-03-09

### Added

- Add `IndexedDBShim` to tests ([**@maxogden**](https://github.com/maxogden))
- Add `Level.destroy()` ([**@qs44**](https://github.com/qs44))
- Add prefix to pass `PouchDB` tests ([**@qs44**](https://github.com/qs44))
- Test `Level.destroy()` ([**@calvinmetcalf**](https://github.com/calvinmetcalf))

### Changed

- Update browser configuration for Testling ([**@maxogden**](https://github.com/maxogden))
- Pass through open options to idbwrapper ([**@maxogden**](https://github.com/maxogden))

### Fixed

- Don't use `indexedDB.webkitGetDatabasesNames()` in tests ([**@maxogden**](https://github.com/maxogden))

## [1.1.2] - 2014-02-02

### Removed

- Remove global leaks ([**@mcollina**](https://github.com/mcollina))

## [1.1.1] - 2014-02-02

### Changed

- Modify a copy of the batch array, not the original ([**@nrw**](https://github.com/nrw))

### Fixed

- Fix broken `package.json` ([**@maxogden**](https://github.com/maxogden))
- Fix testling path ([**@maxogden**](https://github.com/maxogden))

## [1.1.0] - 2014-01-30

### Added

- Add Testling ([**@maxogden**](https://github.com/maxogden))
- Add npm badge ([**@maxogden**](https://github.com/maxogden))
- Test ranges ([**@rvagg**](https://github.com/rvagg), [**@maxogden**](https://github.com/maxogden))

### Changed

- Update README ([**@maxogden**](https://github.com/maxogden))
- Update `abstract-leveldown` to `~0.11.0` ([**@rvagg**](https://github.com/rvagg), [**@maxogden**](https://github.com/maxogden))
- Update to work with `abstract-leveldown@0.11.2` ([**@shama**](https://github.com/shama), [**@maxogden**](https://github.com/maxogden))
- Update iterator to pass all range tests ([**@shama**](https://github.com/shama), [**@maxogden**](https://github.com/maxogden))

### Fixed

- Fix incorrect version of `abstract-leveldown` ([**@maxogden**](https://github.com/maxogden))
- Pass error to callback in `approximateSize()` ([**@mcollina**](https://github.com/mcollina))

### Removed

- Remove unnecessary factor in tests ([**@rvagg**](https://github.com/rvagg), [**@maxogden**](https://github.com/maxogden))

**Historical Note** In this time period `bops` shows up and gets removed. Also, `._isBuffer()` uses `Buffer.isBuffer()` in favor of `is-buffer` module.

## [1.0.8] - 2013-08-12

### Changed

- Move `levelup` to devDependencies ([**@juliangruber**](https://github.com/juliangruber))

### Removed

- Remove fn#bind from iterator ([**@juliangruber**](https://github.com/juliangruber))

## [1.0.7] - 2013-07-02

### Changed

- Implement full batch support ([**@mcollina**](https://github.com/mcollina))

### Fixed

- Fix git url to `abstract-leveldown` ([**@maxogden**](https://github.com/maxogden))

## [1.0.6] - 2013-05-31

### Changed

- Update `idb-wrapper` to `1.2.0` ([**@maxogden**](https://github.com/maxogden))
- Switch `abstract-leveldown#master` ([**@maxogden**](https://github.com/maxogden))
- Disable batch and chainable batch tests ([**@maxogden**](https://github.com/maxogden))

## [1.0.5] - 2013-05-30

### Changed

- Use upstream `idb-wrapper` ([**@maxogden**](https://github.com/maxogden))

## [1.0.4] - 2013-05-30

### Added

- Test batch and chainable batch ([**@rvagg**](https://github.com/rvagg))

### Changed

- Update `abstract-leveldown` to `~0.7.1` ([**@rvagg**](https://github.com/rvagg))
- Update `levelup` to `~0.9.0` ([**@brycebaril**](https://github.com/brycebaril))

## [1.0.3] - 2013-05-14

### Changed

- Use `is-buffer` ([**@juliangruber**](https://github.com/juliangruber))

## [1.0.2] - 2013-05-04

### Fixed

- Don't convert `ArrayBuffer` and typed arrays to strings ([**@maxogden**](https://github.com/maxogden))

## [1.0.1] - 2013-05-03

### Added

- Add optional options argument to `.open()` ([**@rvagg**](https://github.com/rvagg))
- Add `test-levelup.js` ([**@maxogden**](https://github.com/maxogden))

### Changed

- Update README ([**@maxogden**](https://github.com/maxogden))
- Use `npm test` instead of `npm start` ([**@shama**](https://github.com/shama))
- Properly delete test dbs ([**@maxogden**](https://github.com/maxogden))
- Inherit from `abstract-leveldown` ([**@rvagg**](https://github.com/rvagg))

## 1.0.0 - 2013-05-03

:seedling: Initial release.

[5.0.2]: https://github.com/Level/level-js/compare/v5.0.1...v5.0.2

[5.0.1]: https://github.com/Level/level-js/compare/v5.0.0...v5.0.1

[5.0.0]: https://github.com/Level/level-js/compare/v4.0.1...v5.0.0

[4.0.1]: https://github.com/Level/level-js/compare/v4.0.0...v4.0.1

[4.0.0]: https://github.com/Level/level-js/compare/v3.0.0...v4.0.0

[3.0.0]: https://github.com/Level/level-js/compare/v3.0.0-rc1...v3.0.0

[3.0.0-rc1]: https://github.com/Level/level-js/compare/v2.2.4...v3.0.0-rc1

[2.2.4]: https://github.com/Level/level-js/compare/v2.2.3...v2.2.4

[2.2.3]: https://github.com/Level/level-js/compare/v2.2.2...v2.2.3

[2.2.2]: https://github.com/Level/level-js/compare/v2.2.1...v2.2.2

[2.2.1]: https://github.com/Level/level-js/compare/v2.2.0...v2.2.1

[2.2.0]: https://github.com/Level/level-js/compare/v2.1.6...v2.2.0

[2.1.6]: https://github.com/Level/level-js/compare/v2.1.5...v2.1.6

[2.1.5]: https://github.com/Level/level-js/compare/v2.1.4...v2.1.5

[2.1.4]: https://github.com/Level/level-js/compare/v2.1.3...v2.1.4

[2.1.3]: https://github.com/Level/level-js/compare/v2.1.2...v2.1.3

[2.1.2]: https://github.com/Level/level-js/compare/v2.1.1...v2.1.2

[2.1.1]: https://github.com/Level/level-js/compare/v2.0.0...v2.1.1

[2.0.0]: https://github.com/Level/level-js/compare/v1.2.0...v2.0.0

[1.2.0]: https://github.com/Level/level-js/compare/v1.1.2...v1.2.0

[1.1.2]: https://github.com/Level/level-js/compare/v1.1.1...v1.1.2

[1.1.1]: https://github.com/Level/level-js/compare/v1.1.0...v1.1.1

[1.1.0]: https://github.com/Level/level-js/compare/v1.0.8...v1.1.0

[1.0.8]: https://github.com/Level/level-js/compare/v1.0.7...v1.0.8

[1.0.7]: https://github.com/Level/level-js/compare/v1.0.6...v1.0.7

[1.0.6]: https://github.com/Level/level-js/compare/v1.0.5...v1.0.6

[1.0.5]: https://github.com/Level/level-js/compare/v1.0.4...v1.0.5

[1.0.4]: https://github.com/Level/level-js/compare/v1.0.3...v1.0.4

[1.0.3]: https://github.com/Level/level-js/compare/v1.0.2...v1.0.3

[1.0.2]: https://github.com/Level/level-js/compare/v1.0.1...v1.0.2

[1.0.1]: https://github.com/Level/level-js/compare/v1.0.0...v1.0.1
