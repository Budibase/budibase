# Changelog

_**If you are upgrading:** please see [`UPGRADING.md`](UPGRADING.md)._

## [6.3.0] - 2020-04-11

### Changed

- Upgrade devDependency `dependency-check` from `^3.3.0` to `^4.1.0` ([`9193656`](https://github.com/Level/abstract-leveldown/commit/9193656)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Support running test suite on a `levelup` db, as well as skipping `start` and `end` tests (for `multileveldown`) ([#364](https://github.com/Level/abstract-leveldown/issues/364)) ([**@vweevers**](https://github.com/vweevers))

## [6.2.3] - 2020-04-03

### Changed

- Upgrade `airtap` devDependency from `^2.0.0` to `^3.0.0` ([#360](https://github.com/Level/abstract-leveldown/issues/360)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Add `buffer` and `immediate` for browsers ([#355](https://github.com/Level/abstract-leveldown/issues/355), [#362](https://github.com/Level/abstract-leveldown/issues/362), [#363](https://github.com/Level/abstract-leveldown/issues/363)) ([**@Raynos**](https://github.com/Raynos), [**@hugomrdias**](https://github.com/hugomrdias), [**@vweevers**](https://github.com/vweevers))

## [6.2.2] - 2019-10-21

### Added

- Add more range tests ([#353](https://github.com/Level/abstract-leveldown/issues/353)) ([**@vweevers**](https://github.com/vweevers))

## [6.2.1] - 2019-10-01

### Fixed

- Fix `manifest-test` to open & close its db ([#352](https://github.com/Level/abstract-leveldown/issues/352)) ([**@vweevers**](https://github.com/vweevers))

## [6.2.0] - 2019-09-30

### Changed

- Upgrade `hallmark` devDependency from `^1.0.0` to `^2.0.0` ([#349](https://github.com/Level/abstract-leveldown/issues/349)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^13.0.1` to `^14.0.0` ([#348](https://github.com/Level/abstract-leveldown/issues/348)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add manifest ([Level/community#83](https://github.com/Level/community/issues/83)) ([#351](https://github.com/Level/abstract-leveldown/issues/351)) ([**@vweevers**](https://github.com/vweevers))
- Document mandatory methods ([#350](https://github.com/Level/abstract-leveldown/issues/350)) ([**@vweevers**](https://github.com/vweevers))

## [6.1.1] - 2019-08-18

### Fixed

- Remove `process.emitWarning` because it breaks AppVeyor builds ([`8e963c3`](https://github.com/Level/abstract-leveldown/commit/8e963c3)) ([**@vweevers**](https://github.com/vweevers))

## [6.1.0] - 2019-08-18

### Changed

- Upgrade `hallmark` devDependency from `^0.1.0` to `^1.0.0` ([#343](https://github.com/Level/abstract-leveldown/issues/343)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^12.0.0` to `^13.0.1` ([#341](https://github.com/Level/abstract-leveldown/issues/341)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add `clear()` method to delete all entries or a range ([#310](https://github.com/Level/abstract-leveldown/issues/310)) ([**@vweevers**](https://github.com/vweevers)).

**Historical Note** The `clear()` method is experimental and optional for the time being. Please see the [README](https://github.com/Level/abstract-leveldown) for details.

## [6.0.3] - 2019-04-26

### Changed

- Upgrade `nyc` devDependency from `^13.2.0` to `^14.0.0` ([#334](https://github.com/Level/abstract-leveldown/issues/334)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Fix and test asynchronicity of empty batch ([#337](https://github.com/Level/abstract-leveldown/issues/337)) ([**@vweevers**](https://github.com/vweevers))
- Fix Level badge ([`8993257`](https://github.com/Level/abstract-leveldown/commit/8993257)) ([**@vweevers**](https://github.com/vweevers))
- Remove link to dead website ([`c0abe28`](https://github.com/Level/abstract-leveldown/commit/c0abe28)) ([**@vweevers**](https://github.com/vweevers))

## [6.0.2] - 2019-03-30

### Changed

- Upgrade `sinon` devDependency from `^6.0.0` to `^7.2.4` ([#330](https://github.com/Level/abstract-leveldown/issues/330)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `nyc` devDependency from `^12.0.2` to `^13.2.0` ([#327](https://github.com/Level/abstract-leveldown/issues/327)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `airtap` devDependency from `0.1.0` to `^2.0.0` ([#323](https://github.com/Level/abstract-leveldown/issues/323)) ([**@vweevers**](https://github.com/vweevers))
- Apply common project tweaks ([#324](https://github.com/Level/abstract-leveldown/issues/324), [#325](https://github.com/Level/abstract-leveldown/issues/325)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Fix subtests by adding `t.plan()` ([#329](https://github.com/Level/abstract-leveldown/issues/329)) ([**@vweevers**](https://github.com/vweevers))

## [6.0.1] - 2018-12-27

### Changed

- Upgrade `hallmark` devDependency from `0.0.2` to `0.1.0` ([#316](https://github.com/level/abstract-leveldown/issues/316)) ([**@vweevers**](https://github.com/vweevers))
- Split v6 upgrade guide into sections for consumers and implementors ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Remove range tests that assumed zero-length strings or Buffers meant "not defined" ([#319](https://github.com/level/abstract-leveldown/issues/319)) ([**@vweevers**](https://github.com/vweevers))

## [6.0.0] - 2018-10-20

_If you are upgrading, please consult the [Upgrade Guide](UPGRADING.md#v6)._

### Changed

- Upgrade `airtap` devDependency from `0.0.5` to `0.1.0` ([#229](https://github.com/level/abstract-leveldown/issues/229), [#231](https://github.com/level/abstract-leveldown/issues/231), [#245](https://github.com/level/abstract-leveldown/issues/245), [`029f56a`](https://github.com/level/abstract-leveldown/commit/029f56a), [#252](https://github.com/level/abstract-leveldown/issues/252)) ([**@vweevers**](https://github.com/vweevers), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `sinon` devDependency from `^5.0.0` to `^6.0.0` ([#232](https://github.com/level/abstract-leveldown/issues/232)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `standard` devDependency from `^11.0.0` to `^12.0.0` ([#303](https://github.com/level/abstract-leveldown/issues/303)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Reject nullish values ([#277](https://github.com/level/abstract-leveldown/issues/277)) ([**@vweevers**](https://github.com/vweevers))
- Make default `_serializeKey` and `_serializeValue` identity functions ([#277](https://github.com/level/abstract-leveldown/issues/277)) ([**@vweevers**](https://github.com/vweevers))
- Don't coerce keys to strings to check if they're empty, instead check arrays explicitly ([#277](https://github.com/level/abstract-leveldown/issues/277)) ([**@vweevers**](https://github.com/vweevers))
- Make `db` property mandatory and public on iterator and chained batch ([#257](https://github.com/level/abstract-leveldown/issues/257), [#309](https://github.com/level/abstract-leveldown/issues/309)) ([**@vweevers**](https://github.com/vweevers))
- Align `AbstractChainedBatch#_clear` with `_put` and `_del` ([#257](https://github.com/level/abstract-leveldown/issues/257)) ([**@vweevers**](https://github.com/vweevers))
- Add `AbstractChainedBatch#_write` with options ([#257](https://github.com/level/abstract-leveldown/issues/257)) ([**@vweevers**](https://github.com/vweevers))
- Use `level-concat-iterator` instead of `collectEntries` ([#246](https://github.com/level/abstract-leveldown/issues/246)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Document API and test suite ([#251](https://github.com/level/abstract-leveldown/issues/251), [#290](https://github.com/level/abstract-leveldown/issues/290), [#295](https://github.com/level/abstract-leveldown/issues/295), [#296](https://github.com/level/abstract-leveldown/issues/296), [#305](https://github.com/level/abstract-leveldown/issues/305)) ([**@vweevers**](https://github.com/vweevers))
- Export test suite as a single function ([#271](https://github.com/level/abstract-leveldown/issues/271), [#293](https://github.com/level/abstract-leveldown/issues/293), [#297](https://github.com/level/abstract-leveldown/issues/297)) ([**@vweevers**](https://github.com/vweevers), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Use factory function to create `db` instances in test suite ([#258](https://github.com/level/abstract-leveldown/issues/258), [#268](https://github.com/level/abstract-leveldown/issues/268), [#282](https://github.com/level/abstract-leveldown/issues/282)) ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers))
- Isolate snapshot tests so that they can be skipped ([#239](https://github.com/level/abstract-leveldown/issues/239), [#274](https://github.com/level/abstract-leveldown/issues/274)) ([**@vweevers**](https://github.com/vweevers), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Isolate openAdvanced tests so that they can be skipped ([#271](https://github.com/level/abstract-leveldown/issues/271)) ([**@vweevers**](https://github.com/vweevers))
- Rename `abstract/` to `test/` ([#253](https://github.com/level/abstract-leveldown/issues/253)) ([**@vweevers**](https://github.com/vweevers))
- Refactor internal test methods to have the same signature `(test, testCommon)` ([#268](https://github.com/level/abstract-leveldown/issues/268), [#275](https://github.com/level/abstract-leveldown/issues/275)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Prefer `exports.*` over `module.exports.*` ([#276](https://github.com/level/abstract-leveldown/issues/276)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Tweak copyright years for less maintenance ([`0b2949a`](https://github.com/level/abstract-leveldown/commit/0b2949a)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add `iterator#seek()` ([#237](https://github.com/level/abstract-leveldown/issues/237), [#302](https://github.com/level/abstract-leveldown/issues/302), [#307](https://github.com/level/abstract-leveldown/issues/307)) ([**@vweevers**](https://github.com/vweevers), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `nyc` and `coveralls` devDependencies for code coverage ([#253](https://github.com/level/abstract-leveldown/issues/253)) ([**@vweevers**](https://github.com/vweevers))
- Add `setUp` and `tearDown` to all sub tests ([#279](https://github.com/level/abstract-leveldown/issues/279), [#289](https://github.com/level/abstract-leveldown/issues/289)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add test for implementations that cannot support snapshots ([#239](https://github.com/level/abstract-leveldown/issues/239)) ([**@vweevers**](https://github.com/vweevers))
- Add `hallmark` devDependency for Markdown style and contributors ([#312](https://github.com/level/abstract-leveldown/issues/312)) ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove `location` ([#258](https://github.com/level/abstract-leveldown/issues/258)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `lastLocation`, `cleanup`, `rimraf` ([#249](https://github.com/level/abstract-leveldown/issues/249)) ([**@vweevers**](https://github.com/vweevers))
- Remove IE10 from Sauce Labs test matrix ([#312](https://github.com/level/abstract-leveldown/issues/312)) ([**@vweevers**](https://github.com/vweevers))
- Remove node 9 from Travis ([`0b52395`](https://github.com/level/abstract-leveldown/commit/0b52395)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove tests that assumed support of boolean and NaN keys ([#277](https://github.com/level/abstract-leveldown/issues/277)) ([**@vweevers**](https://github.com/vweevers))
- Remove range tests that assumed `null` meant "not defined" ([#277](https://github.com/level/abstract-leveldown/issues/277)) ([**@vweevers**](https://github.com/vweevers))
- Remove sync test from `test/put-test.js` ([#300](https://github.com/level/abstract-leveldown/issues/300)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove empty `errorValues()` test ([#273](https://github.com/level/abstract-leveldown/issues/273)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove default `testCommon` parameter ([#264](https://github.com/level/abstract-leveldown/issues/264), [#271](https://github.com/level/abstract-leveldown/issues/271)) ([**@vweevers**](https://github.com/vweevers))
- Remove `contributors` from `package.json` ([`542f350`](https://github.com/level/abstract-leveldown/commit/542f350)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove copyright headers from code ([`a36c04f`](https://github.com/level/abstract-leveldown/commit/a36c04f)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Make sure all `t.throw` tests check error messages correctly ([#286](https://github.com/level/abstract-leveldown/issues/286)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Check options objects properly for `null` ([#257](https://github.com/level/abstract-leveldown/issues/257), [#288](https://github.com/level/abstract-leveldown/issues/288)) ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers))
- Serialize range options same as keys ([#277](https://github.com/level/abstract-leveldown/issues/277)) ([**@vweevers**](https://github.com/vweevers))
- Allow nullish and empty range options ([#277](https://github.com/level/abstract-leveldown/issues/277)) ([**@vweevers**](https://github.com/vweevers))

## [5.0.0] - 2018-05-22

### Changed

- Upgrade `sinon` to `^5.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Tweak README ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Replace `const` with `var` to support IE10 ([**@vweevers**](https://github.com/vweevers))

### Added

- Add node 10 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `airtap` for browser tests ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove node 4, 5 and 7 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove TypeScript tests ([**@vweevers**](https://github.com/vweevers))
- Remove TypeScript typings ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [4.0.3] - 2018-02-21

### Changed

- Upgrade `ts-node` to `^5.0.0` ([**@zixia**](https://github.com/zixia))
- Upgrade `standard` to `^11.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Remove invalid TypeScript from `Batch` ([**@Tapppi**](https://github.com/Tapppi))
- Add JSDoc to incorrectly inferred TypeScript types ([**@Tapppi**](https://github.com/Tapppi))

## [4.0.2] - 2018-02-09

### Fixed

- Fix `iterator#next` to return `this` ([**@vweevers**](https://github.com/vweevers))

## [4.0.1] - 2018-02-09

### Added

- Run test suite in TypeScript in addition to Node.js ([**@vweevers**](https://github.com/vweevers))
- Add TypeScript smoke test ([**@vweevers**](https://github.com/vweevers))
- Add TypeScript readme section with stability badge ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove obsolete parameters from tests ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Update TypeScript typings for v4 ([**@vweevers**](https://github.com/vweevers))
- Use ES6 classes in tests to please TypeScript ([**@vweevers**](https://github.com/vweevers))
- Define default methods on prototype to please TypeScript ([**@vweevers**](https://github.com/vweevers))

**Historical Note** This was released as a patch because it only changed tests
and TypeScript typings (which are marked experimental and don't follow semver).

## [4.0.0] - 2018-01-20

### Changed

- Ignore empty range options in `AbstractLevelDOWN#_setupIteratorOptions` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Make `testCommon.js` the default value for `testCommon` parameter ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use `Buffer.isBuffer()` instead of `AbstractLevelDOWN#isBuffer` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Cleanup iterator tests ([#161](https://github.com/level/abstract-leveldown/issues/161)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Pass test function as a parameter instead of setting local global ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Assert batch type is `'put'` or `'del'` ([**@vweevers**](https://github.com/vweevers))
- Assert batch array elements are objects ([**@vweevers**](https://github.com/vweevers))

### Added

- Add `standard` for linting ([#150](https://github.com/level/abstract-leveldown/issues/150)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Test that callbacks are called asynchronously ([**@vweevers**](https://github.com/vweevers))
- Test serialization extensibility ([**@vweevers**](https://github.com/vweevers))
- Add [**@vweevers**](https://github.com/vweevers) to contributors ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add upgrade guide in `UPGRADING.md` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add node 9 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `isLevelDOWN` function and corresponding tests ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `AbstractLevelDOWN#approximateSize` method and corresponding tests ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `testBuffer` in `abstract/put-get-del-test.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove object value test in `abstract/put-test.js` ([**@vweevers**](https://github.com/vweevers))
- Remove serialize buffer tests ([**@vweevers**](https://github.com/vweevers))
- Remove serialize object tests ([**@vweevers**](https://github.com/vweevers))
- Remove `BufferType` parameter in `abstract/put-get-del-test.js`, use `Buffer` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Ensure stores are closed properly (fixes problems on Windows) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Call back errors on next tick to avoid `zalgo` ([**@vweevers**](https://github.com/vweevers))

## [3.0.0] - 2017-11-04

### Added

- Add node version badge ([**@vweevers**](https://github.com/vweevers))

### Removed

- Drop support for `0.12`. Cause for new major version! ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Fix errors in `index.d.ts` ([**@sandersn**](https://github.com/sandersn))

## [2.7.2] - 2017-10-11

### Changed

- Update `README` with new style ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.7.1] - 2017-09-30

### Changed

- Refactor typings as ES2015 module ([**@MeirionHughes**](https://github.com/MeirionHughes))

## [2.7.0] - 2017-09-12

### Added

- Add `TypeScript` definitions in `index.d.ts` ([**@MeirionHughes**](https://github.com/MeirionHughes))

## [2.6.3] - 2017-09-05

### Changed

- Upgrade dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Convert nullish values to empty strings ([**@bigeasy**](https://github.com/bigeasy))
- Use `t.equal(a, b)` instead of `t.ok(a === b)` ([**@bigeasy**](https://github.com/bigeasy))
- Relax tests for serializing object in `abstract/chained-batch-test.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add `GreenKeeper` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Test key/value serialization ([**@bigeasy**](https://github.com/bigeasy))
- Test `undefined` value serializing to empty string ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Document `.status` property ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.6.2] - 2017-07-30

### Changed

- Upgrade dependencies and float `devDependencies` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update copyright years ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update node versions on Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Test serialization extensibility ([**@juliangruber**](https://github.com/juliangruber))

### Fixed

- Fix put test on object serialization ([**@juliangruber**](https://github.com/juliangruber))

## [2.6.1] - 2016-09-12

### Fixed

- Fix `null` case in default value serializer (fixes problems in `2.6.0`) ([**@juliangruber**](https://github.com/juliangruber))

## [2.6.0] - 2016-03-10

### Changed

- Use proto delegation to patch methods on db ([**@deanlandolt**](https://github.com/deanlandolt))
- Allow serialization functions to return buffers ([**@deanlandolt**](https://github.com/deanlandolt))

### Added

- Add `collectBatchOps` function to buffer `_put` and `_del` inputs in `abstract/chained-batch-test.js` ([**@deanlandolt**](https://github.com/deanlandolt))

### Removed

- Remove unnecessary initialization hackery in `abstract/chained-batch-test.js` ([**@deanlandolt**](https://github.com/deanlandolt))

**Historical Note** This release was a breaking change. See [**@juliangruber**](https://github.com/juliangruber)'s [comment](https://github.com/Level/abstract-leveldown/pull/85#issuecomment-246980978) for more information.

## [2.5.0] - 2016-05-01

### Changed

- Upgrade dependencies and add more node versions to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add dependency badge to `README` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `AbstractLevelDOWN#_serializeKey` ([**@juliangruber**](https://github.com/juliangruber))
- Add `AbstractLevelDOWN#_serializeValue` ([**@juliangruber**](https://github.com/juliangruber))
- Add `AbstractChainedBatch#_serializeKey` ([**@juliangruber**](https://github.com/juliangruber))
- Add `AbstractChainedBatch#_serializeValue` ([**@juliangruber**](https://github.com/juliangruber))
- Test `_serialize` with object and buffer ([**@juliangruber**](https://github.com/juliangruber))

### Removed

- Remove stringification of keys and values ([**@juliangruber**](https://github.com/juliangruber))
- Remove `.toBuffer` ([**@juliangruber**](https://github.com/juliangruber))

### Fixed

- Update `memdown` url ([**@ralphtheninja**](https://github.com/ralphtheninja))
- `AbstractLevelDOWN#._checkKey` does not take three parameters ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Only show build status for the master branch ([**@watson**](https://github.com/watson))
- Fix minor typos in `README` ([**@timkuijsten**](https://github.com/timkuijsten))

## [2.4.1] - 2015-08-29

### Fixed

- Remove use of `const` ([**@nolanlawson**](https://github.com/nolanlawson))

## [2.4.0] - 2015-05-19

### Added

- Add `.status` property to `AbstractLevelDOWN` ([**@juliangruber**](https://github.com/juliangruber))

## [2.3.1] - 2015-05-18

### Added

- Link to `level/community` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Extract `Contributors` section from `README` into `level/community` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Document `isLevelDown` function ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.3.0] - 2015-05-18

### Changed

- Use `t.equal(a, b)` instead of `t.ok(a === b)` ([**@juliangruber**](https://github.com/juliangruber))
- Export API from `index.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Import `isLevelDOWN` function to `is-leveldown.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.2.2] - 2015-05-13

### Fixed

- Revert changes to `location` in `2.2.1` ([**@juliangruber**](https://github.com/juliangruber))

## [2.2.1] - 2015-05-12

### Fixed

- Copy paste error gave wrong test description ([**@ralphtheninja**](https://github.com/ralphtheninja))
- `t.throws()` is different for `tape` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Assert `location` is not an empty string ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.2.0] - 2015-05-10

### Added

- Test `{ sync: true }` option in `abstract/put-test.js` ([**@juliangruber**](https://github.com/juliangruber))

## [2.1.4] - 2015-04-28

### Fixed

- Use `t.equal()` with `tape` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.1.3] - 2015-04-28

### Changed

- Change from `tap` to `tape` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.1.2] - 2015-04-27

### Changed

- Convert buffer to string so we can compare ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.1.1] - 2015-04-27

### Changed

- Update logo and copyright ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add [**@ralphtheninja**](https://github.com/ralphtheninja) to contributors ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `0.12` and `iojs` to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Include `.nonErrorValues()` test in `abstract/put-get-del-test.js` ([**@hden**](https://github.com/hden))
- `rvagg/node-abstract-leveldown` moved to `level/abstract-leveldown` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Fix Travis for `0.8` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.1.0] - 2014-11-09

### Changed

- Use `setTimeout` instead of `process.nextTick` ([**@bigeasy**](https://github.com/bigeasy))

### Added

- Add [**@watson**](https://github.com/watson) to contributors ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Don't fail if no value is returned by `._get` ([**@watson**](https://github.com/watson))
- Use `error` test function when testing for errors ([**@watson**](https://github.com/watson))

## [2.0.3] - 2014-10-02

No change.

## [2.0.2] - 2014-10-02

### Added

- Test atomic batch operations ([**@calvinmetcalf**](https://github.com/calvinmetcalf))

## [2.0.1] - 2014-09-01

### Changed

- Set default values for options to `.open`, `.get`, `.put`, `.del` and `.batch` ([**@watson**](https://github.com/watson))
- Update pattern for setting default options for the iterator ([**@watson**](https://github.com/watson))
- Allow boolean options to be falsy/truthy ([**@watson**](https://github.com/watson))

### Removed

- Remove default options that are too `LevelDOWN` specific ([**@watson**](https://github.com/watson))

## [2.0.0] - 2014-08-26

### Changed

- Switch to allowing writes of empty values, `null`, `undefined`, `''`, `[]` and empty buffer ([**@juliangruber**](https://github.com/juliangruber))
- Rename `AbstractLevelDOWN#_checkKeyValue` to `AbstractLevelDOWN#_checkKey` ([**@rvagg**](https://github.com/rvagg))

## [1.0.0] - 2014-08-24

### Changed

- Ensure `Boolean` iterator options are `Boolean` ([**@watson**](https://github.com/watson))

### Added

- Test that an error is thrown when location isn't a string ([**@calvinmetcalf**](https://github.com/calvinmetcalf))
- Test opening and closing the store ([**@calvinmetcalf**](https://github.com/calvinmetcalf))
- Test iterator with `limit` set to `0` ([**@watson**](https://github.com/watson))
- Add more tests to `abstract/batch-test.js` ([**@calvinmetcalf**](https://github.com/calvinmetcalf))
- Set default values of iterator options ([**@watson**](https://github.com/watson))
- Account for batch options that are `null` ([**@calvinmetcalf**](https://github.com/calvinmetcalf))

### Removed

- Remove options.start hackery ([**@rvagg**](https://github.com/rvagg))

## [0.12.4] - 2014-08-20

### Changed

- Change license to plain MIT ([**@andrewrk**](https://github.com/andrewrk))

### Added

- Test that `simple-iterator` returns buffers ([**@kesla**](https://github.com/kesla))
- Test implicit snapshots ([**@kesla**](https://github.com/kesla))

## [0.12.3] - 2014-06-27

### Changed

- Upgrade `xtend` dependency ([**@andrewrk**](https://github.com/andrewrk))

## [0.12.2] - 2014-04-26

### Changed

- Have `isTypedArray` check for existence of `ArrayBuffer` and `Uint8Array` constructors before usage ([**@rvagg**](https://github.com/rvagg))

## [0.12.1] - 2014-04-26

### Changed

- Set default `BufferType` in `abstract/put-get-del-test.js` to `Buffer` instead of `ArrayBuffer` ([**@maxogden**](https://github.com/maxogden))

## [0.12.0] - 2014-03-12

### Changed

- Revert to pure `Buffer` and remove usage of `Uint16Array` ([**@rvagg**](https://github.com/rvagg))

## [0.11.4] - 2014-03-11

### Removed

- Remove duplicate call to `t.end()` ([**@maxogden**](https://github.com/maxogden))

## [0.11.3] - 2014-01-26

### Changed

- Loosen the buffer type check ([**@rvagg**](https://github.com/rvagg))

## [0.11.2] - 2013-12-05

### Added

- Add npm badges ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix iterator tests in `test.js` ([**@rvagg**](https://github.com/rvagg))

## [0.11.1] - 2013-11-15

### Changed

- Adjust `abstract/approximate-size-test.js` to account for snappy compression ([**@rvagg**](https://github.com/rvagg))

## [0.11.0] - 2013-10-14

### Added

- Normalize `iterator()` options with `AbstractLevelDOWN#_setupIteratorOptions` ([**@rvagg**](https://github.com/rvagg))

## [0.10.2] - 2013-09-06

### Changed

- Refactor duplicated versions of `isTypedArray` into `abstract/util.js` ([**@rvagg**](https://github.com/rvagg))
- Refactor duplicated versions of `'NotFound'` checks into `abstract/util.js`, fixed too-strict version in `get-test.js` ([**@rvagg**](https://github.com/rvagg))

## [0.10.1] - 2013-08-29

### Changed

- Relax check for `Not Found` error message to be case insensitive in `get-test.js` ([**@rvagg**](https://github.com/rvagg))

### Added

- Add [**@substack**](https://github.com/substack) to contributors ([**@rvagg**](https://github.com/rvagg))

## [0.10.0] - 2013-08-19

### Added

- Test `gt`, `gte`, `lt` and `lte` ranges ([**@dominictarr**](https://github.com/dominictarr))

## [0.9.0] - 2013-08-11

### Changed

- Make `AbstractChainedBatch` extensible ([**@kesla**](https://github.com/kesla))
- Export `AbstractChainedBatch` from `abstract-leveldown.js` ([**@kesla**](https://github.com/kesla))

### Added

- Test simultaneous get's ([**@kesla**](https://github.com/kesla))
- Test `AbstractChainedBatch` extensibility ([**@kesla**](https://github.com/kesla))

### Fixed

- Fix broken test assertion in `abstract/get-test.js` ([**@rvagg**](https://github.com/rvagg))
- Fix tests that weren't running properly ([**@kesla**](https://github.com/kesla))

## [0.8.2] - 2013-08-02

No changes. Merely published changes made in `0.8.1`.

## [0.8.1] - 2013-08-02

### Changed

- Remove use of `const` in `testCommon.js` ([**@rvagg**](https://github.com/rvagg))

**Historical Note** The version in `package.json` was changed from `0.7.4` to `0.8.1`. The `0.8.1` tag exists but this version was never published to npm.

## [0.8.0] - 2013-08-02

### Changed

- Use `process.browser` check instead of `process.title == 'browser'` ([**@rvagg**](https://github.com/rvagg))

### Added

- Add `BufferType` parameter to `abstract/put-get-del-test.js` for `bops` support ([**@rvagg**](https://github.com/rvagg))
- Add `isTypedArray` function which checks `ArrayBuffer` or `Uint8Array` for `bops` support ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix `cleanup` function not calling back when browserified ([**@rvagg**](https://github.com/rvagg))

**Historical Note** It seems the version in `package.json` was never changed to `0.8.0` in the git history, even though the `0.8.0` tag exists. Most likely `package.json` was modified locally during `npm publish` but was never committed.

## [0.7.4] - 2013-08-02

### Fixed

- Fix problems related to `browserify` and `rimraf` ([**@rvagg**](https://github.com/rvagg))

## [0.7.3] - 2013-07-26

### Added

- Add [**@pgte**](https://github.com/pgte) to contributors ([**@rvagg**](https://github.com/rvagg))
- Test iterator with `limit` set to `-1` ([**@kesla**](https://github.com/kesla))

## [0.7.2] - 2013-07-08

### Changed

- Freeze chained batch state after `.write()` has been called ([**@rvagg**](https://github.com/rvagg))
- Make `NotFound` error case insensitive ([**@rvagg**](https://github.com/rvagg))
- Use `self` rather than binding functions to `this` ([**@juliangruber**](https://github.com/juliangruber))

### Added

- Add `AbstractChainedBatch#_checkWritten` ([**@rvagg**](https://github.com/rvagg))
- Test delete on non-existent key ([**@rvagg**](https://github.com/rvagg))
- Test iterator with `start` after database `end` ([**@juliangruber**](https://github.com/juliangruber))

### Fixed

- Don't coerce values to strings in browser ([**@maxogden**](https://github.com/maxogden))
- Make tests work in node and browser ([**@maxogden**](https://github.com/maxogden))

## [0.7.1] - 2013-05-15

### Changed

- Adjust tests to be browserable ([**@rvagg**](https://github.com/rvagg))

## [0.7.0] - 2013-05-14

### Added

- Add `AbstractChainedBatch#clear` ([**@rvagg**](https://github.com/rvagg))

## [0.6.1] - 2013-05-14

### Changed

- Make `AbstractIterator` call back with an error instead of throwing on nexting and ending ([**@mcollina**](https://github.com/mcollina))

## [0.6.0] - 2013-05-14

### Changed

- Split `t.deepEqual()` into multiple `t.equal()` in `abstract/iterator-test.js` ([**@rvagg**](https://github.com/rvagg))
- Make `AbstractIterator` call back with an error instead of throwing on nexting and ending ([**@mcollina**](https://github.com/mcollina))

## [0.5.0] - 2013-05-14

### Changed

- Make `iterator.end(cb)` and `iterator.next(cb)` call back with an error instead of throwing ([**@mcollina**](https://github.com/mcollina))

## [0.4.0] - 2013-05-14

### Changed

- Move `AbstractIterator` from `abstract-leveldown.js` to `abstract-iterator.js` ([**@rvagg**](https://github.com/rvagg))

### Added

- Add `AbstractChainedBatch` ([**@rvagg**](https://github.com/rvagg))
- Add `AbstractLevelDOWN#_chainedBatch` ([**@rvagg**](https://github.com/rvagg))
- Add `abstract/batch-test.js` and `abstract/chained-batch-test.js` ([**@rvagg**](https://github.com/rvagg))

## [0.4.0-1] - 2013-05-14

### Added

- Add [**@No9**](https://github.com/No9) and [**@mcollina**](https://github.com/mcollina) to contributors ([**@rvagg**](https://github.com/rvagg))

## [0.3.0] - 2013-05-04

### Changed

- Use `this._checkKeyValue()` instead of local function ([**@rvagg**](https://github.com/rvagg))
- Use `this._isBuffer()` instead of `Buffer.isBuffer()` ([**@rvagg**](https://github.com/rvagg))

### Added

- Restore test for opening the database without options ([**@rvagg**](https://github.com/rvagg))
- Add `AbstractLevelDOWN#_isBuffer` so it can be overridden ([**@rvagg**](https://github.com/rvagg))
- Add `AbstractLevelDOWN#_checkKeyValue` so it can be overridden ([**@rvagg**](https://github.com/rvagg))

## [0.2.3] - 2013-05-04

### Removed

- Remove test for opening the database without options ([**@rvagg**](https://github.com/rvagg))

## [0.2.2] - 2013-05-04

### Changed

- Split `.open()` tests into `.open()` and `.openAdvanced()` ([**@rvagg**](https://github.com/rvagg))

## [0.2.1] - 2013-05-04

### Changed

- Convert values to `string` in `abstract/put-get-del-test.js` if `Buffer` is `undefined` ([**@rvagg**](https://github.com/rvagg))

## [0.2.0] - 2013-05-04

### Changed

- Convert values to `string` in `abstract/get-test.js` if `Buffer` is `undefined` ([**@rvagg**](https://github.com/rvagg))
- Don't stringify keys and values in `abstract/iterator-test.js` ([**@maxogden**](https://github.com/maxogden))

### Added

- Add `process.browser` check for `start` and `end` keys in browser ([**@maxogden**](https://github.com/maxogden))
- Add `levelup` contributors ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix `tape` compatibility issues ([**@maxogden**](https://github.com/maxogden))

## [0.1.0] - 2013-04-23

### Added

- Import abstract tests from `leveldown` ([**@maxogden**](https://github.com/maxogden))

### Fixed

- Clarify `README` ([**@rvagg**](https://github.com/rvagg))

## [0.0.2] - 2013-03-18

### Changed

- Export `checkKeyValue` ([**@rvagg**](https://github.com/rvagg))

### Added

- Add node 0.10 to Travis ([**@rvagg**](https://github.com/rvagg))
- Add `Buffer.isBuffer()` checks to keys and values ([**@rvagg**](https://github.com/rvagg))

## [0.0.1] - 2013-03-18

### Added

- Add `checkKeyValue` function for more complete error checking ([**@rvagg**](https://github.com/rvagg))

## 0.0.0 - 2013-03-15

First release. :seedling:

[6.3.0]: https://github.com/Level/abstract-leveldown/compare/v6.2.3...v6.3.0

[6.2.3]: https://github.com/Level/abstract-leveldown/compare/v6.2.2...v6.2.3

[6.2.2]: https://github.com/Level/abstract-leveldown/compare/v6.2.1...v6.2.2

[6.2.1]: https://github.com/Level/abstract-leveldown/compare/v6.2.0...v6.2.1

[6.2.0]: https://github.com/Level/abstract-leveldown/compare/v6.1.1...v6.2.0

[6.1.1]: https://github.com/Level/abstract-leveldown/compare/v6.1.0...v6.1.1

[6.1.0]: https://github.com/Level/abstract-leveldown/compare/v6.0.3...v6.1.0

[6.0.3]: https://github.com/Level/abstract-leveldown/compare/v6.0.2...v6.0.3

[6.0.2]: https://github.com/Level/abstract-leveldown/compare/v6.0.1...v6.0.2

[6.0.1]: https://github.com/Level/abstract-leveldown/compare/v6.0.0...v6.0.1

[6.0.0]: https://github.com/Level/abstract-leveldown/compare/v5.0.0...v6.0.0

[5.0.0]: https://github.com/Level/abstract-leveldown/compare/v4.0.3...v5.0.0

[4.0.3]: https://github.com/Level/abstract-leveldown/compare/v4.0.2...v4.0.3

[4.0.2]: https://github.com/Level/abstract-leveldown/compare/v4.0.1...v4.0.2

[4.0.1]: https://github.com/Level/abstract-leveldown/compare/v4.0.0...v4.0.1

[4.0.0]: https://github.com/Level/abstract-leveldown/compare/v3.0.0...v4.0.0

[3.0.0]: https://github.com/Level/abstract-leveldown/compare/v2.7.2...v3.0.0

[2.7.2]: https://github.com/Level/abstract-leveldown/compare/v2.7.1...v2.7.2

[2.7.1]: https://github.com/Level/abstract-leveldown/compare/v2.7.0...v2.7.1

[2.7.0]: https://github.com/Level/abstract-leveldown/compare/v2.6.3...v2.7.0

[2.6.3]: https://github.com/Level/abstract-leveldown/compare/v2.6.2...v2.6.3

[2.6.2]: https://github.com/Level/abstract-leveldown/compare/v2.6.1...v2.6.2

[2.6.1]: https://github.com/Level/abstract-leveldown/compare/v2.6.0...v2.6.1

[2.6.0]: https://github.com/Level/abstract-leveldown/compare/v2.5.0...v2.6.0

[2.5.0]: https://github.com/Level/abstract-leveldown/compare/v2.4.1...v2.5.0

[2.4.1]: https://github.com/Level/abstract-leveldown/compare/v2.4.0...v2.4.1

[2.4.0]: https://github.com/Level/abstract-leveldown/compare/v2.3.1...v2.4.0

[2.3.1]: https://github.com/Level/abstract-leveldown/compare/v2.3.0...v2.3.1

[2.3.0]: https://github.com/Level/abstract-leveldown/compare/v2.2.2...v2.3.0

[2.2.2]: https://github.com/Level/abstract-leveldown/compare/v2.2.1...v2.2.2

[2.2.1]: https://github.com/Level/abstract-leveldown/compare/v2.2.0...v2.2.1

[2.2.0]: https://github.com/Level/abstract-leveldown/compare/v2.1.4...v2.2.0

[2.1.4]: https://github.com/Level/abstract-leveldown/compare/v2.1.3...v2.1.4

[2.1.3]: https://github.com/Level/abstract-leveldown/compare/v2.1.2...v2.1.3

[2.1.2]: https://github.com/Level/abstract-leveldown/compare/v2.1.1...v2.1.2

[2.1.1]: https://github.com/Level/abstract-leveldown/compare/v2.1.0...v2.1.1

[2.1.0]: https://github.com/Level/abstract-leveldown/compare/v2.0.3...v2.1.0

[2.0.3]: https://github.com/Level/abstract-leveldown/compare/v2.0.2...v2.0.3

[2.0.2]: https://github.com/Level/abstract-leveldown/compare/v2.0.1...v2.0.2

[2.0.1]: https://github.com/Level/abstract-leveldown/compare/v2.0.0...v2.0.1

[2.0.0]: https://github.com/Level/abstract-leveldown/compare/v1.0.0...v2.0.0

[1.0.0]: https://github.com/Level/abstract-leveldown/compare/v0.12.4...v1.0.0

[0.12.4]: https://github.com/Level/abstract-leveldown/compare/v0.12.3...v0.12.4

[0.12.3]: https://github.com/Level/abstract-leveldown/compare/v0.12.2...v0.12.3

[0.12.2]: https://github.com/Level/abstract-leveldown/compare/v0.12.1...v0.12.2

[0.12.1]: https://github.com/Level/abstract-leveldown/compare/v0.12.0...v0.12.1

[0.12.0]: https://github.com/Level/abstract-leveldown/compare/v0.11.4...v0.12.0

[0.11.4]: https://github.com/Level/abstract-leveldown/compare/v0.11.3...v0.11.4

[0.11.3]: https://github.com/Level/abstract-leveldown/compare/v0.11.2...v0.11.3

[0.11.2]: https://github.com/Level/abstract-leveldown/compare/0.11.1...v0.11.2

[0.11.1]: https://github.com/Level/abstract-leveldown/compare/0.11.0...0.11.1

[0.11.0]: https://github.com/Level/abstract-leveldown/compare/0.10.2...0.11.0

[0.10.2]: https://github.com/Level/abstract-leveldown/compare/0.10.1...0.10.2

[0.10.1]: https://github.com/Level/abstract-leveldown/compare/0.10.0...0.10.1

[0.10.0]: https://github.com/Level/abstract-leveldown/compare/0.9.0...0.10.0

[0.9.0]: https://github.com/Level/abstract-leveldown/compare/0.8.2...0.9.0

[0.8.2]: https://github.com/Level/abstract-leveldown/compare/0.8.1...0.8.2

[0.8.1]: https://github.com/Level/abstract-leveldown/compare/0.8.0...0.8.1

[0.8.0]: https://github.com/Level/abstract-leveldown/compare/0.7.4...0.8.0

[0.7.4]: https://github.com/Level/abstract-leveldown/compare/0.7.3...0.7.4

[0.7.3]: https://github.com/Level/abstract-leveldown/compare/0.7.2...0.7.3

[0.7.2]: https://github.com/Level/abstract-leveldown/compare/0.7.1...0.7.2

[0.7.1]: https://github.com/Level/abstract-leveldown/compare/0.7.0...0.7.1

[0.7.0]: https://github.com/Level/abstract-leveldown/compare/0.6.1...0.7.0

[0.6.1]: https://github.com/Level/abstract-leveldown/compare/0.6.0...0.6.1

[0.6.0]: https://github.com/Level/abstract-leveldown/compare/0.5.0...0.6.0

[0.5.0]: https://github.com/Level/abstract-leveldown/compare/0.4.0...0.5.0

[0.4.0]: https://github.com/Level/abstract-leveldown/compare/0.4.0-1...0.4.0

[0.4.0-1]: https://github.com/Level/abstract-leveldown/compare/0.3.0...0.4.0-1

[0.3.0]: https://github.com/Level/abstract-leveldown/compare/0.2.3...0.3.0

[0.2.3]: https://github.com/Level/abstract-leveldown/compare/0.2.2...0.2.3

[0.2.2]: https://github.com/Level/abstract-leveldown/compare/0.2.1...0.2.2

[0.2.1]: https://github.com/Level/abstract-leveldown/compare/0.2.0...0.2.1

[0.2.0]: https://github.com/Level/abstract-leveldown/compare/0.1.0...0.2.0

[0.1.0]: https://github.com/Level/abstract-leveldown/compare/0.0.2...0.1.0

[0.0.2]: https://github.com/Level/abstract-leveldown/compare/0.0.1...0.0.2

[0.0.1]: https://github.com/Level/abstract-leveldown/compare/0.0.0...0.0.1
