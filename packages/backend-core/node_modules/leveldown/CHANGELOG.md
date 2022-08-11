# Changelog

_**If you are upgrading:** please see [`UPGRADING.md`](UPGRADING.md)._

## [5.6.0] - 2020-03-27

### Changed

- Upgrade `nyc` devDependency from `^14.0.0` to `^15.0.0` ([#696](https://github.com/Level/leveldown/issues/696)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `electron` devDependency from `^7.0.1` to `^8.0.0` ([#700](https://github.com/Level/leveldown/issues/700)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Restore Windows 32-bit prebuild ([#711](https://github.com/Level/leveldown/issues/711)) ([**@vweevers**](https://github.com/vweevers))

## [5.5.1] - 2020-02-24

### Fixed

- Fix android arm64 prebuild by disabling exceptions ([#706](https://github.com/Level/leveldown/issues/706)) ([**@vweevers**](https://github.com/vweevers))

## [5.5.0] - 2020-02-19

### Changed

- Refactor initial seek ([#689](https://github.com/Level/leveldown/issues/689)) ([**@vweevers**](https://github.com/vweevers))
- Refactor: move `CheckEndCallback` to `Iterator` ([#690](https://github.com/Level/leveldown/issues/690)) ([**@vweevers**](https://github.com/vweevers))
- Use `prebuildify-cross` ([#694](https://github.com/Level/leveldown/issues/694)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `electron` devDependency from `^6.0.12` to `^7.0.1` ([`d092e6b`](https://github.com/Level/leveldown/commit/d092e6b)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add ARMv6 prebuild ([#704](https://github.com/Level/leveldown/issues/704)) ([**@christianbundy**](https://github.com/christianbundy))

## [5.4.1] - 2019-10-26

### Fixed

- Hide symbols on mac with `-fvisibility=hidden` ([#688](https://github.com/Level/leveldown/issues/688)) ([**@vweevers**](https://github.com/vweevers))
- Fix `test-gc` npm script ([#691](https://github.com/Level/leveldown/issues/691)) ([**@vweevers**](https://github.com/vweevers))

## [5.4.0] - 2019-10-19

### Changed

- Refactor initialization of range options ([#681](https://github.com/Level/leveldown/issues/681)) ([**@vweevers**](https://github.com/vweevers))
- Make iterator seek target a local variable ([#683](https://github.com/Level/leveldown/issues/683)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `node-gyp` devDependency from `^5.0.0` to `^6.0.0` ([#677](https://github.com/Level/leveldown/issues/677)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `dependency-check` devDependency from `^3.3.0` to `^4.1.0` ([`8965e58`](https://github.com/Level/leveldown/commit/8965e58)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add manifest ([Level/community#83](https://github.com/Level/community/issues/83)) ([#685](https://github.com/Level/leveldown/issues/685)) ([**@vweevers**](https://github.com/vweevers))
- Add Cirrus CI for FreeBSD tests :sparkles: ([#678](https://github.com/Level/leveldown/issues/678), [`55f30a3`](https://github.com/Level/leveldown/commit/55f30a3)) ([**@vweevers**](https://github.com/vweevers))
- Test that empty range options are ignored ([#684](https://github.com/Level/leveldown/issues/684)) ([**@vweevers**](https://github.com/vweevers))

## [5.3.0] - 2019-10-04

### Changed

- Replace Ubuntu 16.04 with CentOS 7 for prebuilds ([#674](https://github.com/Level/leveldown/issues/674)) ([**@rvagg**](https://github.com/rvagg)). This makes the prebuilt binary for linux compatible with Debian 8, Ubuntu 14.04, RHEL 7, CentOS 7 and other flavors with an old glibc.

### Added

- Add platform-specific notes ([#672](https://github.com/Level/leveldown/issues/672), [`e359e7a`](https://github.com/Level/leveldown/commit/e359e7a)) ([**@vweevers**](https://github.com/vweevers))

## [5.3.0-0] - 2019-10-04

**Historical Note** This was a prerelease of 5.3.0 for testing purposes. Changes listed above.

## [5.2.1] - 2019-09-20

### Added

- Document minimum version for node 12 ([`9748454`](https://github.com/Level/leveldown/commit/9748454)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Close db in `stack-blower` test ([#668](https://github.com/Level/leveldown/issues/668)) ([**@vweevers**](https://github.com/vweevers))

## [5.2.0] - 2019-09-06

### Changed

- Upgrade `abstract-leveldown` from `~6.0.3` to `~6.1.1` ([#660](https://github.com/Level/leveldown/issues/660)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `napi-macros` from `~1.8.1` to `~2.0.0` ([#657](https://github.com/Level/leveldown/issues/657)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `hallmark` devDependency from `^0.1.0` to `^2.0.0` ([#654](https://github.com/Level/leveldown/issues/654), [#663](https://github.com/Level/leveldown/issues/663)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^12.0.0` to `^14.0.0` ([#653](https://github.com/Level/leveldown/issues/653), [#661](https://github.com/Level/leveldown/issues/661)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `rimraf` devDependency from `^2.6.1` to `^3.0.0` ([#658](https://github.com/Level/leveldown/issues/658)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `electron` devDependency from `^5.0.0` to `^6.0.0` ([#656](https://github.com/Level/leveldown/issues/656)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add [`db.clear()`](https://github.com/Level/abstract-leveldown#dbclearoptions-callback) method (courtesy of `abstract-leveldown`) ([#660](https://github.com/Level/leveldown/issues/660)) ([**@vweevers**](https://github.com/vweevers))

## [5.1.1] - 2019-06-28

### Changed

- Remove `fast-future` in favor of native cache limit ([#638](https://github.com/Level/leveldown/issues/638)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `delayed` devDependency from `^1.0.1` to `^2.0.0` ([#650](https://github.com/Level/leveldown/issues/650)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `readfiletree` devDependency from `~0.0.1` to `^1.0.0` ([#648](https://github.com/Level/leveldown/issues/648)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `du` devDependency from `~0.1.0` to `^1.0.0` ([#649](https://github.com/Level/leveldown/issues/649)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `mkfiletree` devDependency from `^1.0.1` to `^2.0.0` ([#647](https://github.com/Level/leveldown/issues/647)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `node-gyp` devDependency from `^4.0.0` to `^5.0.0` ([#642](https://github.com/Level/leveldown/issues/642)) ([**@vweevers**](https://github.com/vweevers))
- Replace `async` devDependency with `async-each` ([#637](https://github.com/Level/leveldown/issues/637)) ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove benchmarks (moved to `level-bench`) ([#635](https://github.com/Level/leveldown/issues/635)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Fix batch compression test to actually compress ([#651](https://github.com/Level/leveldown/issues/651)) ([**@vweevers**](https://github.com/vweevers))

## [5.1.0] - 2019-05-18

### Changed

- Upgrade `node-gyp-build` from `~3.8.0` to `~4.1.0` ([#625](https://github.com/Level/leveldown/issues/625)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `prebuildify` devDependency from `prebuild/prebuildify#override-platform` to `^3.0.0` ([#625](https://github.com/Level/leveldown/issues/625)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `electron` devDependency from `^4.1.2` to `^5.0.0` ([#616](https://github.com/Level/leveldown/issues/616)) ([**@vweevers**](https://github.com/vweevers))
- CI optimization: skip initial compilation in Travis `arm` job ([#625](https://github.com/Level/leveldown/issues/625)) ([**@vweevers**](https://github.com/vweevers))
- CI optimization: skip redundant `npm install` in `arm` containers ([#625](https://github.com/Level/leveldown/issues/625)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add Alpine (musl) prebuild ([#625](https://github.com/Level/leveldown/issues/625)) ([**@vweevers**](https://github.com/vweevers))
- Add `test-prebuild` npm script ([#625](https://github.com/Level/leveldown/issues/625)) ([**@vweevers**](https://github.com/vweevers))
- Document behavior of pending operations on close ([`687a6a1`](https://github.com/Level/leveldown/commit/687a6a1)) ([**@vweevers**](https://github.com/vweevers))
- Update `Supported Platforms` in `README.md` ([`4f5c9cc`](https://github.com/Level/leveldown/commit/4f5c9cc)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Add `armv` tag to ARM prebuilds (to ensure ARM version matches) ([#625](https://github.com/Level/leveldown/issues/625)) ([**@vweevers**](https://github.com/vweevers))

## [5.0.3] - 2019-04-26

### Changed

- Upgrade `node-gyp` from `^3.8.0` to `^4.0.0` ([#614](https://github.com/Level/leveldown/issues/614)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Refactor worker cleanup into `BaseWorker::DoFinally()` ([#617](https://github.com/Level/leveldown/issues/617)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Clarify expected behavior in `iterator-test` ([`31b66cf`](https://github.com/Level/leveldown/commit/31b66cf)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Prevent segfault: create reference to chained batch object ([#621](https://github.com/Level/leveldown/issues/621)) ([**@vweevers**](https://github.com/vweevers))
- Skip writing empty (chained) batch and make callbacks asynchronous ([#619](https://github.com/Level/leveldown/issues/619)) ([**@vweevers**](https://github.com/vweevers))
- Throw error in `iterator_seek` if iterator has ended ([#618](https://github.com/Level/leveldown/issues/618)) ([**@vweevers**](https://github.com/vweevers))

## [5.0.2] - 2019-04-23

### Changed

- Upgrade `nyc` devDependency from `^13.2.0`  to `^14.0.0` ([#610](https://github.com/Level/leveldown/issues/610)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `tempy` devDependency from `^0.2.1` to `^0.3.0` ([#611](https://github.com/Level/leveldown/issues/611)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Prevent segfaults: defer closing until all operations are done ([#612](https://github.com/Level/leveldown/issues/612)) ([**@vweevers**](https://github.com/vweevers))
- Fix level badge ([`0ce45db`](https://github.com/Level/leveldown/commit/0ce45db)) ([**@vweevers**](https://github.com/vweevers))
- Remove link to dead website ([`091f784`](https://github.com/Level/leveldown/commit/091f784)) ([**@vweevers**](https://github.com/vweevers))

## [5.0.1] - 2019-04-07

### Added

- Test Electron in Travis and AppVeyor ([#607](https://github.com/Level/leveldown/issues/607)) ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove `slump` devDependency ([`38ff274`](https://github.com/Level/leveldown/commit/38ff274)) ([**@vweevers**](https://github.com/vweevers))
- Remove Electron prebuilds in favor of runtime-agnostic prebuilds ([#608](https://github.com/Level/leveldown/issues/608)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Temporarily skip `hallmark` test because it breaks CITGM ([#606](https://github.com/Level/leveldown/issues/606)) ([**@vweevers**](https://github.com/vweevers))

**Historical Note** Although CITGM landed support for git repositories in response to v5.0.0 which fixes our use of git submodules and `hallmark`, we're keeping `hallmark` disabled because it is still experimental and technically out of scope for CITGM.

## [5.0.0] - 2019-03-29

### Changed

- Rewrite as N-API addon ([#540](https://github.com/Level/leveldown/issues/540), [#559](https://github.com/Level/leveldown/issues/559)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use `prebuildify` instead of `prebuild` ([#549](https://github.com/Level/leveldown/issues/549), [#562](https://github.com/Level/leveldown/issues/562), [#571](https://github.com/Level/leveldown/issues/571)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update minimum node version required ([#552](https://github.com/Level/leveldown/issues/552)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade Snappy from `1.1.4` to `1.1.7` as a git submodule ([#522](https://github.com/Level/leveldown/issues/522), [#535](https://github.com/Level/leveldown/issues/535)) ([**@filoozom**](https://github.com/filoozom))
- Upgrade `abstract-leveldown` from `~5.0.0` to `~6.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers)) ([#511](https://github.com/Level/leveldown/issues/511))
- Implement abstract `_serializeKey()` and `_serializeValue()` ([#506](https://github.com/Level/leveldown/issues/506)) ([**@vweevers**](https://github.com/vweevers))
- Implement abstract `_seek()` instead of `seek()` ([#506](https://github.com/Level/leveldown/issues/506)) ([**@vweevers**](https://github.com/vweevers))
- Invoke abstract tests from single function ([#495](https://github.com/Level/leveldown/issues/495)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use `suite.common()` in `test/common.js` ([`7b0f6d9`](https://github.com/Level/leveldown/commit/7b0f6d9)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Handle `location` in `LevelDOWN` constructor, as `location` was removed from `abstract-leveldown` ([#494](https://github.com/Level/leveldown/issues/494)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Pass a factory function to abstract tests ([#494](https://github.com/Level/leveldown/issues/494)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use `tempy` in tests, removing need for cleanup ([#494](https://github.com/Level/leveldown/issues/494)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use `level-concat-iterator` in tests ([#494](https://github.com/Level/leveldown/issues/494)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Make callback of `makeTest` an error-first callback ([#518](https://github.com/Level/leveldown/issues/518)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^11.0.1` to `^12.0.0` ([#503](https://github.com/Level/leveldown/issues/503)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `slump` devDependency from `~2.0.0` to `~3.0.0` ([#504](https://github.com/Level/leveldown/issues/504)) ([**@vweevers**](https://github.com/vweevers))
- Normalize gyp files (indentation and double quotes) ([#539](https://github.com/Level/leveldown/issues/539)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Tweak benchmarks ([#545](https://github.com/Level/leveldown/issues/545), [#546](https://github.com/Level/leveldown/issues/546)) ([**@vweevers**](https://github.com/vweevers), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Tweak changelog ([#483](https://github.com/Level/leveldown/issues/483)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Tweak copyright years for less maintenance ([`98cbb4f`](https://github.com/Level/leveldown/commit/98cbb4f)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Document new platform support and prebuilt binaries ([#558](https://github.com/Level/leveldown/issues/558), [#563](https://github.com/Level/leveldown/issues/563)) ([**@vweevers**](https://github.com/vweevers))
- Replace `remark-cli` with `hallmark` ([#548](https://github.com/Level/leveldown/issues/548)) ([**@vweevers**](https://github.com/vweevers))
- Update `.npmignore` ([**@vweevers**](https://github.com/vweevers))
- Apply common project tweaks ([#580](https://github.com/Level/leveldown/issues/580), [#582](https://github.com/Level/leveldown/issues/582), [`1c90e8f`](https://github.com/Level/leveldown/commit/1c90e8f)) ([**@vweevers**](https://github.com/vweevers), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Introduce `override` and `final` keywords following C++ Core Guidelines ([#600](https://github.com/Level/leveldown/issues/600)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add `linux-armv7`, `linux-arm64`, `android-armv7` and `android-arm64` prebuilds ([#584](https://github.com/Level/leveldown/issues/584), [#585](https://github.com/Level/leveldown/issues/585), [#587](https://github.com/Level/leveldown/issues/587)) ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers))
- Add segfault tests ([#514](https://github.com/Level/leveldown/issues/514)) ([**@vweevers**](https://github.com/vweevers))
- Add `nyc` and `coveralls` for code coverage ([#497](https://github.com/Level/leveldown/issues/497), [#591](https://github.com/Level/leveldown/issues/591)) ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers))
- Copy type checks of `approximateSize()` to `compactRange()` ([#517](https://github.com/Level/leveldown/issues/517)) ([**@vweevers**](https://github.com/vweevers))
- Document that value may not be `null` or `undefined` ([#511](https://github.com/Level/leveldown/issues/511)) ([**@vweevers**](https://github.com/vweevers))
- Document `batch()` (array and chained form), `sync` option and `db` references ([#556](https://github.com/Level/leveldown/issues/556)) ([**@vweevers**](https://github.com/vweevers))
- Add publish instructions and `download-prebuilds` npm script ([#564](https://github.com/Level/leveldown/issues/564)) ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove node 6 and 9 from Travis ([`0f5f554`](https://github.com/Level/leveldown/commit/0f5f554), [#562](https://github.com/Level/leveldown/issues/562)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove 32 bits from AppVeyor ([#560](https://github.com/Level/leveldown/issues/560)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove unused `.jshintrc` ([`1d122b0`](https://github.com/Level/leveldown/commit/1d122b0)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove copyright headers from code ([`508027d`](https://github.com/Level/leveldown/commit/508027d)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove contributors from `package.json` ([`8a29ecc`](https://github.com/Level/leveldown/commit/8a29ecc)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `g++-4.8` apt package from Travis ([#489](https://github.com/Level/leveldown/issues/489)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove unused `key` argument from `ChainedBatch#_clear` ([#519](https://github.com/Level/leveldown/issues/519)) ([**@vweevers**](https://github.com/vweevers))
- Remove redundant `db.close()` from `test/approximate-size-test.js` ([`d04f233`](https://github.com/Level/leveldown/commit/d04f233)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Moved seek tests to `abstract-leveldown` ([#508](https://github.com/Level/leveldown/issues/508)) ([**@vweevers**](https://github.com/vweevers))
- Remove unused `iota-array` and `lexicographic-integer` devDependencies ([#508](https://github.com/Level/leveldown/issues/508)) ([**@vweevers**](https://github.com/vweevers))
- Remove `xcacheSize` and `xmaxOpenFiles` from leak tests ([#569](https://github.com/Level/leveldown/issues/569)) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove legacy `bindings` dependency ([#583](https://github.com/Level/leveldown/issues/583)) ([**@peakji**](https://github.com/peakji))

### Fixed

- Serialize `compactRange()` arguments ([#517](https://github.com/Level/leveldown/issues/517)) ([**@vweevers**](https://github.com/vweevers))
- Prevent segfault: when calling `iterator()` on non-open db ([#514](https://github.com/Level/leveldown/issues/514)) ([**@vweevers**](https://github.com/vweevers))
- Prevent segfault: add `PriorityWorker` to defer closing until `put` is done ([#597](https://github.com/Level/leveldown/issues/597)) ([**@vweevers**](https://github.com/vweevers))
- Prevent segfault: keep persistent references to iterators until they are ended ([#597](https://github.com/Level/leveldown/issues/597)) ([**@vweevers**](https://github.com/vweevers))
- Gitignore Debug builds of LevelDB and Snappy ([#597](https://github.com/Level/leveldown/issues/597)) ([**@vweevers**](https://github.com/vweevers))
- Fix subtests by adding `t.plan()` ([#594](https://github.com/Level/leveldown/issues/594)) ([**@vweevers**](https://github.com/vweevers))

## [4.0.2] - 2019-03-02

### Changed

- Upgrade `nan` from `~2.10.0` to `~2.12.1` ([#596](https://github.com/Level/leveldown/pull/596)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `prebuild-install` from `^4.0.0` to `~5.2.4` ([#596](https://github.com/Level/leveldown/pull/596)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `prebuild` devDependency from `^7.0.0` to `^8.1.2` ([#596](https://github.com/Level/leveldown/pull/596)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add Node.js 11 to Travis and AppVeyor ([#596](https://github.com/Level/leveldown/pull/596)) ([**@vweevers**](https://github.com/vweevers))

## [4.0.1] - 2018-05-22

### Changed

- Upgrade to `abstract-leveldown@~5.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove old AppVeyor hack ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [4.0.0] - 2018-05-16

### Added

- Import and fix gc test from `levelup` ([**@vweevers**](https://github.com/vweevers))
- Add `standard` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add a note on upgrading to 2.0.1/3.0.1 ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade to `verify-travis-appveyor@^3.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Change deprecated `node-uuid` to `uuid` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `README` format ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix docs for `approximateSize()` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 4 from Travis and AppVeyor ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove TypeScript typings ([**@meirionhughes**](https://github.com/meirionhughes))

## [3.0.2] - 2018-05-05

### Changed

- Support compilation on iOS ([**@agentilela**](https://github.com/agentilela))
- Support compilation on Android x86 ([**@luandro**](https://github.com/luandro))
- Upgrade to `prebuild-install@^4.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.0.1] - 2018-04-26

### Added

- Run `verify-travis-appveyor` as part of tests to ensure they are in sync ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Test that `destroy()` doesn't inadvertently create the directory ([**@vweevers**](https://github.com/vweevers))
- Add node 10 to Travis and AppVeyor ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Configure Greenkeeper to ignore updates to `@types/node` to reduce spam ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade to `nan@2.10` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use resource names in all `AsyncWorker` classes ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Handle all errors in destroy tests ([**@vweevers**](https://github.com/vweevers))
- Fix deprecation warnings related to `Buffer()` ([**@peakji**](https://github.com/peakji))
- Fix deprecation warnings related to `nan` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 5 and 7 from AppVeyor ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `console.log()` from `approximate-size-test.js` ([**@vweevers**](https://github.com/vweevers))

## [3.0.0] - 2018-01-30

### Changed

- Upgrade to `abstract-leveldown@4` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade to `prebuild@7` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Rewrite changelog ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 5 and 7 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Make sure `destroy()` deletes `LevelDB`-only dir ([**@joyeecheung**](https://github.com/joyeecheung))

## [2.1.1] - 2017-12-02

### Fixed

- Omit docs from `LevelDB` and test files from `Snappy` ([**@peakji**](https://github.com/peakji))

## [2.1.0] - 2017-11-24

### Fixed

- Fix `Android` compilation ([**@staltz**](https://github.com/staltz))

## [2.0.2] - 2017-11-23

### Added

- Add node 9 to Travis and AppVeyor ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade to `nan@2.8` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.1] - 2017-11-11

### Changed

- Major `README` overhaul ([**@ralphtheninja**](https://github.com/ralphtheninja), [**@vweevers**](https://github.com/vweevers))
- Upgrade to `abstract-leveldown@3.0.0` ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Tweak typings ([**@sandersn**](https://github.com/sandersn))

## [2.0.0] - 2017-10-02

### Changed

- Update `TypeScript` typings ([**@meirionhughes**](https://github.com/meirionhughes))

### Removed

- Remove support for node 0.12 ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.9.0] - 2017-09-28

### Added

- Add default export of `LevelDOWN` ([**@zixia**](https://github.com/zixia))

## [1.8.0] - 2017-09-14

### Added

- Add node version badge ([**@vweevers**](https://github.com/vweevers))
- Add Greenkeeper badge ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `-mfloat-abi=hard` compiler flag for `arm` ([**@maihde**](https://github.com/maihde))
- Add initial `TypeScript` typings ([**@meirionhughes**](https://github.com/meirionhughes))
- Add [**@meirionhughes**](https://github.com/meirionhughes) to contributors ([**@meirionhughes**](https://github.com/meirionhughes))

### Changed

- Bump dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Simplify AppVeyor ([**@vweevers**](https://github.com/vweevers))
- Install latest `npm` on AppVeyor for `node@5` ([**@vweevers**](https://github.com/vweevers))

## [1.7.2] - 2017-06-08

### Changed

- `iterator.next()` calls back with error if called after `iterator.end()` ([**@peakji**](https://github.com/peakji))

### Fixed

- Closing db with open iterator should not crash ([**@peakji**](https://github.com/peakji))

## [1.7.1] - 2017-06-01

### Added

- Add node 8 to Travis and AppVeyor ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Skip installing latest `npm` on AppVeyor ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.7.0] - 2017-05-17

### Changed

- Bump version ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.7.0-0] - 2017-04-12

### Added

- Add support for `OpenBSD` ([**@qbit**](https://github.com/qbit))

### Changed

- Upgrade to `LevelDB@1.20` ([**@peakji**](https://github.com/peakji))
- Upgrade to `Snappy@1.1.4` ([**@peakji**](https://github.com/peakji))
- Bump dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.6.0] - 2017-02-02

### Added

- Add `db.compactRange(start, end, cb)` ([**@bookchin**](https://github.com/bookchin))
- Add [**@bookchin**](https://github.com/bookchin) to contributors ([**@bookchin**](https://github.com/bookchin))

### Changed

- Update `prebuild`, `prebuild-install` and `prebuild-ci` ([**@juliangruber**](https://github.com/juliangruber))
- Update `nan` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.5.3] - 2016-12-30

### Added

- Restore node 5 to AppVeyor ([**@vweevers**](https://github.com/vweevers))

## [1.5.2] - 2016-12-29

### Added

- Restore node 5 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.5.1] - 2016-12-27

### Added

- Add node 7 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add AppVeyor so we can build on Windows ([**@vweevers**](https://github.com/vweevers))
- Add OSX to Travis ([**@juliangruber**](https://github.com/juliangruber))
- Add `prebuild-ci` so we can automatically make prebuilt binaries ([**@juliangruber**](https://github.com/juliangruber))

### Changed

- Enable `iterator.seek()` with buffers ([**@peakji**](https://github.com/peakji))

### Removed

- Remove node 0.10 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove node 5 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.5.0] - 2016-09-27

### Changed

- Upgrade to `LevelDB@1.19` ([**@juliangruber**](https://github.com/juliangruber))
- Bump dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade to `nan@2.4.0`, remove `Function::NewInstance()` deprecation warnings ([**@rvagg**](https://github.com/rvagg))

### Removed

- Remove deleted file from `leveldb.gyp` ([**@juliangruber**](https://github.com/juliangruber))

## [1.4.6] - 2016-04-29

### Added

- Add node 6 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade to `nan@2.3.0` to remove deprecated calls ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.4.5] - 2016-04-18

### Added

- Add [**@chjj**](https://github.com/chjj)'s script for checking memory consumption ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Bump dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Ignore Release folder for Windows ([**@vweevers**](https://github.com/vweevers))
- Update copyright year 2015 -> 2016 ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Optimize iterators by avoiding handles ([**@chjj**](https://github.com/chjj))

### Removed

- Remove unsupported versions from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix delete calls not using `[]` ([**@chjj**](https://github.com/chjj))
- Free start slices on conflicting options ([**@chjj**](https://github.com/chjj))
- Dispose of unused slices ([**@chjj**](https://github.com/chjj))
- Release iterator snapshots ([**@chjj**](https://github.com/chjj))
- Fix iterator leak ([**@chjj**](https://github.com/chjj))
- Add handlescopes to fix potential memory leaks ([**@chjj**](https://github.com/chjj))
- Fix repair-test for multilang windows ([**@vweevers**](https://github.com/vweevers))
- Repair error is different on windows ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.4.4] - 2016-01-25

### Changed

- Update dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use `prebuild --install` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- `README` fixes ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix build problems on windows ([#247](https://github.com/Level/leveldown/issues/247)) ([**@obastemur**](https://github.com/obastemur))

## [1.4.3] - 2015-12-14

### Added

- Add node 5 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add dependency badge ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Bump dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Bump `prebuild` for `--all` functionality ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add node 5 to prebuild config (abi 47) ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix build problems on windows ([#196](https://github.com/Level/leveldown/issues/196)) ([**@obastemur**](https://github.com/obastemur))

## [1.4.2] - 2015-10-21

### Added

- Add node 4 to prebuild config (abi 46) ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add node 4 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Test on latest node versions ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Document `prebuild` and explain different compile steps ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update prebuild for --debug and --strip support ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Require `fast-future` at start, not later ([**@timkuijsten**](https://github.com/timkuijsten))
- Add [**@kkoopa**](https://github.com/kkoopa)'s Travis fix ([**@mafintosh**](https://github.com/mafintosh))

## [1.4.1] - 2015-08-15

### Added

- Add abi 45 to `prebuild` ([**@mafintosh**](https://github.com/mafintosh))
- Add io.js 3.0 to Travis ([**@mafintosh**](https://github.com/mafintosh))

### Changed

- Update `prebuild` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Replace missing `Handle<>` with `Local<>` ([**@mafintosh**](https://github.com/mafintosh))
- Upgrade to `nan@2` ([**@rvagg**](https://github.com/rvagg))

## [1.4.0] - 2015-07-28

### Added

- Add `.prebuildrc` update Travis and prebuild, add prebuild npm script ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add rebuild npm script ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Switch from `node-pre-gyp` to `prebuild` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- No longer need `node-gyp` directly ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.3.1-0] - 2015-07-20

### Changed

- `node-pre-gyp` should build binaries on Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `hash_test.cc` source ([**@michaelnisi**](https://github.com/michaelnisi))

## [1.3.0] - 2015-06-16

### Added

- Add io.js 1.0 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade to `LevelDB@1.18.0` (Braydon Fuller)

### Removed

- Remove io.js 2.0 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove io.js 2.1 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Add `LEVELDB_PLATFORM_UV` to `LevelDB` `port.h` to fix test (Braydon Fuller)

## [1.2.2] - 2015-06-02

### Fixed

- Ignore `build-pre-gyp/` folder when publishing to npm ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.2.1] - 2015-06-01

### Changed

- Use `remote_path` with `node-pre-gyp` to dodge preparing `package.json` every time ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add more io.js versions ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use `node-gyp-install` to make sure correct `node-gyp` headers are downloaded ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.2.0] - 2015-06-01

### Added

- Add `iterator.seek()` ([**@mafintosh**](https://github.com/mafintosh))

## [1.1.0] - 2015-05-28

### Changed

- Upgrade `abstract-leveldown`, mainly for `.status` ([**@juliangruber**](https://github.com/juliangruber))

## [1.0.7] - 2015-05-27

### Added

- Add compression test suite ([**@juliangruber**](https://github.com/juliangruber))
- Add link to `level/community` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Use const reference instead of by value in `Database` constructor ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Refactor `NanNew()` on strings into option value functions ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Refactor `BooleanOptionValue` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- `NanUInt32OptionValue` -> `UInt32OptionValue` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- `NanBooleanOptionValue` -> `BooleanOptionValue` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Simplify location logic, let `Database` take care of allocation ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `abstract-leveldown` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `.travis.yml`, nvm works on Travis now ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.0.6] - 2015-05-05

### Changed

- Bump version ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.0.5] - 2015-05-05

### Fixed

- Pass db to `AbstractIterator` so gc keeps it ([**@juliangruber**](https://github.com/juliangruber))

## [1.0.4] - 2015-05-05

### Changed

- Update `nan` for iojs 2.0.0 ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.0.3] - 2015-05-02

### Changed

- `tap` -> `tape` + `faucet` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix `write-random.js`, use `leveldown` instead of `lmdb` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Fix `bench/db-bench.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.0.2] - 2015-04-26

### Added

- Add documentation about snapshots ([**@maxogden**](https://github.com/maxogden))

### Changed

- Update logo and copyright ([**@ralphtheninja**](https://github.com/ralphtheninja))
- s/rvagg\\/node-/level\\// ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use `n` instead of `nvm` for working `io.js` support ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update to `abstract-leveldown@2.1.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.0.1] - 2015-01-16

### Changed

- Upgrade to `nan@1.5` for `io.js` support ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix `LevelDB` builds for modern gcc versions ([**@sharvil**](https://github.com/sharvil))

## [1.0.0] - 2014-08-26

### Changed

- Upgrade to `nan@1.3` for Node 0.11.13+ support ([**@rvagg**](https://github.com/rvagg))
- Upgrade to `LevelDB@1.17.0` ([**@kesla**](https://github.com/kesla))
- Allow writing empty values: null, undefined, '', \[] and Buffer(0). Entries come out as '' or Buffer(0) ([**@ggreer**](https://github.com/ggreer), [**@juliangruber**](https://github.com/juliangruber), [**@rvagg**](https://github.com/rvagg))
- Massive speed up of iterators by chunking reads ([**@kesla**](https://github.com/kesla))
- Wrap in abstract-leveldown for consistent type-checking across \*DOWNs ([**@kesla**](https://github.com/kesla))
- Switch to plain MIT license ([**@andrewrk**](https://github.com/andrewrk))

### Removed

- Remove compile option that borked EL5 compiles ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix clang build ([**@thlorenz**](https://github.com/thlorenz))
- Fix minor memory leaks in options attributes ([**@ggreer**](https://github.com/ggreer))

## [0.10.6] - 2016-01-07

### Added

- Add iojs, node 4 and 5 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade to `nan@2.1.x` for `node@4` and `node@5` support ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `node@0.8` from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [0.10.5] - 2015-05-05

### Changed

- Upgrade to `nan@1.8.x` for `iojs` support ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [0.10.4] - 2015-02-07

### Changed

- Bump version ([**@rvagg**](https://github.com/rvagg))

## [0.10.3] - 2015-02-07

### Changed

- Upgrade to `nan@1.5` ([**@mcollina**](https://github.com/mcollina))

## [0.10.2] - 2013-11-30

### Fixed

- Apply fix by [**@rescrv**](https://github.com/rescrv) for long-standing [OSX corruption bug](https://groups.google.com/forum/#!topic/leveldb/GXhx8YvFiig) ([**@rvagg**](https://github.com/rvagg) / [**@rescrv**](https://github.com/rescrv))

## [0.10.1] - 2013-11-21

### Changed

- Upgrade to `nan@0.6` for Node@0.11.6 support, `v8::Local<T>::New(val)` rewritten to `NanNewLocal<T>(val)` ([**@rvagg**](https://github.com/rvagg))

**Historical Note** From this release and onward, tags in git start with the prefix `v`, i.e. this release corresponds to the tag `v0.10.1`.

## [0.10.0] - 2013-11-18

### Added

- Add new simple batch() leak tester ([**@rvagg**](https://github.com/rvagg))

### Changed

- Upgrade to `Snappy@1.1.1` ([**@rvagg**](https://github.com/rvagg) and [**@No9**](https://github.com/No9))
- Upgrade to `nan@0.5.x` ([**@rvagg**](https://github.com/rvagg))
- Upgrade to `abstract-leveldown@0.11.x` for testing ([**@rvagg**](https://github.com/rvagg))
- Switch all `callback->Call()`s to `node::MakeCallback()` to properly support Node.js domains ([**@rvagg**](https://github.com/rvagg))
- Enable LevelDB's BloomFilter ([**@Kyotoweb**](https://github.com/Kyotoweb))
- Properly enable compression by default ([**@Kyotoweb**](https://github.com/Kyotoweb))

### Removed

- Remove `Persistent` references for all `batch()` operations as `WriteBatch` takes an explicit copy of the data ([**@mcollina**](https://github.com/mcollina) and [**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix array-batch memory leak ([level/levelup#171](https://github.com/Level/levelup/issues/171)) ([**@rvagg**](https://github.com/rvagg))
- Fix chained-batch `write()` segfaults (details in [#73](https://github.com/Level/leveldown/issues/73)), ([**@rvagg**](https://github.com/rvagg) and [**@mcollina**](https://github.com/mcollina))

## [0.9.2] - 2013-11-02

### Fixed

- Minor fixes to support `Node@0.11.8` and new Linux gcc (warnings) ([**@rvagg**](https://github.com/rvagg))

## [0.9.1] - 2013-10-03

### Fixed

- Include `port_uv.h` for Windows compile, added test to suite to make sure this happens every time `LevelDB` is upgraded ([**@rvagg**](https://github.com/rvagg))

## [0.9.0] - 2013-10-01

### Changed

- Upgrade to `LevelDB@0.14.0`, includes change from .sst to .ldb file extension for SST files ([**@rvagg**](https://github.com/rvagg))

## [0.8.3] - 2013-09-18

### Changed

- Upgrade to `nan@0.4.0`, better support for latest Node master & support for installing within directory structures containing spaces in directory names ([**@rvagg**](https://github.com/rvagg))

**Historical Note** The diff between this version and the previous shows `0.8.4` in the commit message. This is incorrect, since that version was never released.

## [0.8.2] - 2013-09-01

### Added

- Add support for `FreeBSD` ([**@rvagg**](https://github.com/rvagg), [**@kelexel**](https://github.com/kelexel))

## [0.8.1] - 2013-09-01

### Added

- Add [**@substack**](https://github.com/substack) to contributors ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix minor V8-level leaks ([**@rvagg**](https://github.com/rvagg))

## [0.8.0] - 2013-08-26

### Added

- Add `gt`, `lt`, `gte`, `lte` for iterators ([**@dominictarr**](https://github.com/dominictarr))

### Changed

- Switch to `nan` as an npm dependency ([**@rvagg**](https://github.com/rvagg))

## [0.7.0] - 2013-08-11

### Added

- Add [**@pgte**](https://github.com/pgte) to contributors ([**@rvagg**](https://github.com/rvagg))

### Changed

- Use [nan](https://github.com/rvagg/nan) for Node 0.8->0.11 compatibility ([**@rvagg**](https://github.com/rvagg))
- Minor perf improvements in C++ ([**@mscdex**](https://github.com/mscdex))

**Historical Note** We started using `nan` in the form of a local `src/nan.h` header file.

## [0.6.2] - 2013-07-07

### Changed

- Compatibility for `Node@0.11.3`, breaks compatibility with 0.11.2

## [0.6.1] - 2013-06-15

### Fixed

- Fix broken Windows compile, apply port-uv patch to `LevelDB`'s port.h ([**@rvagg**](https://github.com/rvagg))

## [0.6.0] - 2013-06-14

### Changed

- Upgrade to `LevelDB@1.11.0`, some [important bugfixes](https://groups.google.com/forum/#!topic/leveldb/vS1JvmGlp4E) ([**@rvagg**](https://github.com/rvagg))

## [0.5.0] - 2013-05-21

### Changed

- Bump major version for `db.getProperty()` addition (should have been done in 0.4.4) ([**@rvagg**](https://github.com/rvagg))
- Disallow `batch()` operations after a `write()` ([**@rvagg**](https://github.com/rvagg))

## [0.4.4] - 2013-05-18

### Added

- Add `db.getProperty()`, see README for details ([**@rvagg**](https://github.com/rvagg))

### Fixed

- More work on memory management, including late-creation of Persistent handles ([**@rvagg**](https://github.com/rvagg))

## [0.4.3] - 2013-05-18

### Fixed

- Better memory leak fix ([**@rvagg**](https://github.com/rvagg))

## [0.4.2] - 2013-05-17

### Fixed

- Same memory leak fixes as 0.4.1, properly applied to batch() operations too ([**@rvagg**](https://github.com/rvagg))

## [0.4.1] - 2013-05-17

### Fixed

- Fix memory leak caused when passing String objects in as keys and values, conversion to Slice created `new char[]` but wasn't being disposed. Buffers are automatically disposed (reported by [**@kylegetson**](https://github.com/kylegetson) levelup/[#140](https://github.com/Level/leveldown/issues/140)) ([**@rvagg**](https://github.com/rvagg))

## [0.4.0] - 2013-05-15

### Changed

- Upgrade to `LevelDB@1.10.0`, fairly minor changes, mostly bugfixes see <https://groups.google.com/forum/#!topic/leveldb/O2Zdbi9Lrao> for more info ([**@rvagg**](https://github.com/rvagg))

## [0.3.1] - 2013-05-14

### Fixed

- Don't allow empty batch() operations through to LevelDB, on chained of array forms ([**@rvagg**](https://github.com/rvagg))

## [0.3.0] - 2013-05-14

### Added

- Add [**@No9**](https://github.com/No9) to contributors ([**@rvagg**](https://github.com/rvagg))

### Changed

- Pull API tests up into `AbstractLevelDOWN`, require it to run the tests. `AbstractLevelDOWN` can now be used to test `LevelDOWN`-compliant API's ([**@maxogden**](https://github.com/maxogden))
- Change iterator methods to return errors on the callbacks rather than throw ([**@mcollina**](https://github.com/mcollina) & [**@rvagg**](https://github.com/rvagg))
- Update documentation for `.get()` ([**@deanlandolt**](https://github.com/deanlandolt))

### Removed

- Remove browserify shim ([**@rvagg**](https://github.com/rvagg))

**Historical Note** In the early days minor versions were looked upon as major versions. Semver practices we use today was not adopted fully at this time. This is why the history might look a bit confusing.

<!-- ## 0.2.4 - 2013-05-21

**Historical Note** Did not publish as a tag and `package.json` was never committed with this version number. Most likely due to a locally modified `package.json`. -->

## [0.2.3] - 2013-05-17

### Fixed

- Backport memory leak fixes ([**@rvagg**](https://github.com/rvagg))

## [0.2.2] - 2013-05-14

### Added

- Add node 0.10 to Travis ([**@rvagg**](https://github.com/rvagg))
- Add [**@mcollina**](https://github.com/mcollina) to contributors ([**@rvagg**](https://github.com/rvagg))
- Add browserify shim so `levelup` can run in the browser ([**@No9**](https://github.com/No9))

### Changed

- Extract basic test code to `abstract-leveldown` ([**@maxogden**](https://github.com/maxogden))

## [0.2.1] - 2013-04-08

### Changed

- Ignore empty string/buffer start/end options on iterators ([**@kesla**](https://github.com/kesla))
- Macro cleanup, replace some with static inline functions ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix iterator to start on correct value when `reverse=true`, also handle end-of-store case ([#27](https://github.com/Level/leveldown/issues/27)) ([**@kesla**](https://github.com/kesla))

## [0.2.0] - 2013-03-30

### Added

- Add windows support, using a combination of libuv and Windows-specific code. See README for details about what's required ([**@rvagg**](https://github.com/rvagg))
- Add `leveldown.destroy(location, cb)` to delete an existing `LevelDB` store, exposes `LevelDB.DestroyDB()` ([**@rvagg**](https://github.com/rvagg))
- Add `leveldown.repair(location, cb)` to repair an existing `LevelDB` store, exposes `LevelDB.RepairDB()` ([**@rvagg**](https://github.com/rvagg))
- Add advanced options: `writeBufferSize`, `blockSize`, `maxOpenFiles`, `blockRestartInterval`, exposes `LevelDB` options ([**@rvagg**](https://github.com/rvagg))
- Add chained batch operations. Argument-less `db.batch()` will return a new `Batch` object that can `.put()` and `.del()` and then `.write()`. API in flux so not documented yet. ([**@juliangruber**](https://github.com/juliangruber) / [**@rvagg**](https://github.com/rvagg))

### Changed

- Auto-cleanup iterators that are left open when you close a database; any iterators left open when you close a database instance will kill your process so we now keep track of iterators and auto-close them before a db.close completes ([**@rvagg**](https://github.com/rvagg))

## [0.1.4] - 2013-03-11

### Changed

- Return error when batch ops contain `null` or `undefined` ([**@rvagg**](https://github.com/rvagg) / [**@ralphtheninja**](https://github.com/ralphtheninja) / [**@dominictarr**](https://github.com/dominictarr))

## [0.1.3] - 2013-03-09

### Fixed

- `SmartOS` build problems ([**@wolfeidau**](https://github.com/wolfeidau))

## [0.1.2] - 2013-02-24

### Changed

- Upgrade to `LevelDB@1.9.0`, fairly minor changes since 1.7.0 ([**@rvagg**](https://github.com/rvagg))
- Upgrade to `Snappy@1.1.0`, changes block size to improve compression ~3%, slight decrease in speed ([**@rvagg**](https://github.com/rvagg))

## [0.1.1] - 2013-02-24

### Fixed

- Compile error on Mac OS ([**@kesla**](https://github.com/kesla) / [**@rvagg**](https://github.com/rvagg))

## [0.1.0] - 2013-02-24

### Added

- Add complete, independent test suite ([**@rvagg**](https://github.com/rvagg))

### Changed

- Change API to export single function `levelup()` ([**@rvagg**](https://github.com/rvagg))
- Move `createIterator()` to `levelup#iterator()` ([**@rvagg**](https://github.com/rvagg))
- Make all `options` arguments optional ([**@rvagg**](https://github.com/rvagg))
- Argument number & type checking on all methods ([**@rvagg**](https://github.com/rvagg))
- Stricter checking on key & value types, `String`/`Object.toString()`/`Buffer`, non-zero-length ([**@rvagg**](https://github.com/rvagg))

### Removed

- Remove `use namespace` and add `namespace leveldown` everywhere ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix race condition in Iterator `end()`/`next()`, merged from `LevelUP` ([**@ralphtheninja**](https://github.com/ralphtheninja) / [**@rvagg**](https://github.com/rvagg))

## [0.0.2] - 2013-01-20

### Changed

- Finalize rename of internal components to `LevelDOWN`, removing `LevelUP` references ([**@rvagg**](https://github.com/rvagg))

## [0.0.1] - 2013-01-20

### Added

- Complete documentation of current API ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Callback is not optional for `.close()` ([**@rvagg**](https://github.com/rvagg))

## 0.0.0 - 2013-01-06

:seedling: First release. Extracted from `levelup` as a stand-alone package ([**@rvagg**](https://github.com/rvagg))

[5.6.0]: https://github.com/Level/leveldown/compare/v5.5.1...v5.6.0

[5.5.1]: https://github.com/Level/leveldown/compare/v5.5.0...v5.5.1

[5.5.0]: https://github.com/Level/leveldown/compare/v5.4.1...v5.5.0

[5.4.1]: https://github.com/Level/leveldown/compare/v5.4.0...v5.4.1

[5.4.0]: https://github.com/Level/leveldown/compare/v5.3.0...v5.4.0

[5.3.0]: https://github.com/Level/leveldown/compare/v5.3.0-0...v5.3.0

[5.3.0-0]: https://github.com/Level/leveldown/compare/v5.2.1...v5.3.0-0

[5.2.1]: https://github.com/Level/leveldown/compare/v5.2.0...v5.2.1

[5.2.0]: https://github.com/Level/leveldown/compare/v5.1.1...v5.2.0

[5.1.1]: https://github.com/Level/leveldown/compare/v5.1.0...v5.1.1

[5.1.0]: https://github.com/Level/leveldown/compare/v5.0.3...v5.1.0

[5.0.3]: https://github.com/Level/leveldown/compare/v5.0.2...v5.0.3

[5.0.2]: https://github.com/Level/leveldown/compare/v5.0.1...v5.0.2

[5.0.1]: https://github.com/Level/leveldown/compare/v5.0.0...v5.0.1

[5.0.0]: https://github.com/Level/leveldown/compare/v4.0.2...v5.0.0

[4.0.2]: https://github.com/Level/leveldown/compare/v4.0.1...v4.0.2

[4.0.1]: https://github.com/Level/leveldown/compare/v4.0.0...v4.0.1

[4.0.0]: https://github.com/Level/leveldown/compare/v3.0.2...v4.0.0

[3.0.2]: https://github.com/Level/leveldown/compare/v3.0.1...v3.0.2

[3.0.1]: https://github.com/Level/leveldown/compare/v3.0.0...v3.0.1

[3.0.0]: https://github.com/Level/leveldown/compare/v2.1.1...v3.0.0

[2.1.1]: https://github.com/Level/leveldown/compare/v2.1.0...v2.1.1

[2.1.0]: https://github.com/Level/leveldown/compare/v2.0.2...v2.1.0

[2.0.2]: https://github.com/Level/leveldown/compare/v2.0.1...v2.0.2

[2.0.1]: https://github.com/Level/leveldown/compare/v2.0.0...v2.0.1

[2.0.0]: https://github.com/Level/leveldown/compare/v1.9.0...v2.0.0

[1.9.0]: https://github.com/Level/leveldown/compare/v1.8.0...v1.9.0

[1.8.0]: https://github.com/Level/leveldown/compare/v1.7.2...v1.8.0

[1.7.2]: https://github.com/Level/leveldown/compare/v1.7.1...v1.7.2

[1.7.1]: https://github.com/Level/leveldown/compare/v1.7.0...v1.7.1

[1.7.0]: https://github.com/Level/leveldown/compare/v1.7.0-0...v1.7.0

[1.7.0-0]: https://github.com/Level/leveldown/compare/v1.6.0...v1.7.0-0

[1.6.0]: https://github.com/Level/leveldown/compare/v1.5.3...v1.6.0

[1.5.3]: https://github.com/Level/leveldown/compare/v1.5.2...v1.5.3

[1.5.2]: https://github.com/Level/leveldown/compare/v1.5.1...v1.5.2

[1.5.1]: https://github.com/Level/leveldown/compare/v1.5.0...v1.5.1

[1.5.0]: https://github.com/Level/leveldown/compare/v1.4.6...v1.5.0

[1.4.6]: https://github.com/Level/leveldown/compare/v1.4.5...v1.4.6

[1.4.5]: https://github.com/Level/leveldown/compare/v1.4.4...v1.4.5

[1.4.4]: https://github.com/Level/leveldown/compare/v1.4.3...v1.4.4

[1.4.3]: https://github.com/Level/leveldown/compare/v1.4.2...v1.4.3

[1.4.2]: https://github.com/Level/leveldown/compare/v1.4.1...v1.4.2

[1.4.1]: https://github.com/Level/leveldown/compare/v1.4.0...v1.4.1

[1.4.0]: https://github.com/Level/leveldown/compare/v1.3.1-0...v1.4.0

[1.3.1-0]: https://github.com/Level/leveldown/compare/v1.3.0...v1.3.1-0

[1.3.0]: https://github.com/Level/leveldown/compare/v1.2.2...v1.3.0

[1.2.2]: https://github.com/Level/leveldown/compare/v1.2.1...v1.2.2

[1.2.1]: https://github.com/Level/leveldown/compare/v1.2.0...v1.2.1

[1.2.0]: https://github.com/Level/leveldown/compare/v1.1.0...v1.2.0

[1.1.0]: https://github.com/Level/leveldown/compare/v1.0.7...v1.1.0

[1.0.7]: https://github.com/Level/leveldown/compare/v1.0.6...v1.0.7

[1.0.6]: https://github.com/Level/leveldown/compare/v1.0.5...v1.0.6

[1.0.5]: https://github.com/Level/leveldown/compare/v1.0.4...v1.0.5

[1.0.4]: https://github.com/Level/leveldown/compare/v1.0.3...v1.0.4

[1.0.3]: https://github.com/Level/leveldown/compare/v1.0.2...v1.0.3

[1.0.2]: https://github.com/Level/leveldown/compare/v1.0.1...v1.0.2

[1.0.1]: https://github.com/Level/leveldown/compare/v1.0.0...v1.0.1

[1.0.0]: https://github.com/Level/leveldown/compare/v0.10.6...v1.0.0

[0.10.6]: https://github.com/Level/leveldown/compare/v0.10.5...v0.10.6

[0.10.5]: https://github.com/Level/leveldown/compare/v0.10.4...v0.10.5

[0.10.4]: https://github.com/Level/leveldown/compare/v0.10.3...v0.10.4

[0.10.3]: https://github.com/Level/leveldown/compare/v0.10.2...v0.10.3

[0.10.2]: https://github.com/Level/leveldown/compare/v0.10.1...v0.10.2

[0.10.1]: https://github.com/Level/leveldown/compare/0.10.0...v0.10.1

[0.10.0]: https://github.com/Level/leveldown/compare/0.9.2...0.10.0

[0.9.2]: https://github.com/Level/leveldown/compare/0.9.1...0.9.2

[0.9.1]: https://github.com/Level/leveldown/compare/0.9.0...0.9.1

[0.9.0]: https://github.com/Level/leveldown/compare/0.8.3...0.9.0

[0.8.3]: https://github.com/Level/leveldown/compare/0.8.2...0.8.3

[0.8.2]: https://github.com/Level/leveldown/compare/0.8.1...0.8.2

[0.8.1]: https://github.com/Level/leveldown/compare/0.8.0...0.8.1

[0.8.0]: https://github.com/Level/leveldown/compare/0.7.0...0.8.0

[0.7.0]: https://github.com/Level/leveldown/compare/0.6.2...0.7.0

[0.6.2]: https://github.com/Level/leveldown/compare/0.6.1...0.6.2

[0.6.1]: https://github.com/Level/leveldown/compare/0.6.0...0.6.1

[0.6.0]: https://github.com/Level/leveldown/compare/0.5.0...0.6.0

[0.5.0]: https://github.com/Level/leveldown/compare/0.4.4...0.5.0

[0.4.4]: https://github.com/Level/leveldown/compare/0.4.3...0.4.4

[0.4.3]: https://github.com/Level/leveldown/compare/0.4.2...0.4.3

[0.4.2]: https://github.com/Level/leveldown/compare/0.4.1...0.4.2

[0.4.1]: https://github.com/Level/leveldown/compare/0.4.0...0.4.1

[0.4.0]: https://github.com/Level/leveldown/compare/0.3.1...0.4.0

[0.3.1]: https://github.com/Level/leveldown/compare/0.3.0...0.3.1

[0.3.0]: https://github.com/Level/leveldown/compare/0.2.3...0.3.0

[0.2.3]: https://github.com/Level/leveldown/compare/0.2.2...0.2.3

[0.2.2]: https://github.com/Level/leveldown/compare/0.2.1...0.2.2

[0.2.1]: https://github.com/Level/leveldown/compare/0.2.0...0.2.1

[0.2.0]: https://github.com/Level/leveldown/compare/0.1.4...0.2.0

[0.1.4]: https://github.com/Level/leveldown/compare/0.1.3...0.1.4

[0.1.3]: https://github.com/Level/leveldown/compare/0.1.2...0.1.3

[0.1.2]: https://github.com/Level/leveldown/compare/0.1.1...0.1.2

[0.1.1]: https://github.com/Level/leveldown/compare/0.1.0...0.1.1

[0.1.0]: https://github.com/Level/leveldown/compare/0.0.2...0.1.0

[0.0.2]: https://github.com/Level/leveldown/compare/0.0.1...0.0.2

[0.0.1]: https://github.com/Level/leveldown/compare/0.0.0...0.0.1
