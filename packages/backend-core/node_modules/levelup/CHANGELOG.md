# Changelog

_**If you are upgrading:** please see [`UPGRADING.md`](UPGRADING.md)._

## [4.4.0] - 2020-04-11

### Changed

- Increase `abstract-leveldown` parity ([#692](https://github.com/Level/levelup/issues/692)) ([**@vweevers**](https://github.com/vweevers)):
  - Add `db` property to chained batch
  - Remove type checks that are also performed by `abstract-leveldown`
- Upgrade `dependency-check` devDependency from `^3.3.0` to `^4.1.0` ([`71a6aa3`](https://github.com/Level/levelup/commit/71a6aa3)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `airtap` devDependency from `^2.0.0` to `^3.0.0` ([#687](https://github.com/Level/levelup/issues/687)) ([**@vweevers**](https://github.com/vweevers))

## [4.3.2] - 2019-10-04

### Changed

- Upgrade `deferred-leveldown` from `~5.2.1` to `~5.3.0` ([#682](https://github.com/Level/levelup/issues/682)) ([**@vweevers**](https://github.com/vweevers)). This fixes the manifest added in 4.3.0.

### Added

- Test manifest integration with `deferred-leveldown` ([#681](https://github.com/Level/levelup/issues/681)) ([**@vweevers**](https://github.com/vweevers))

## [4.3.1] - 2019-10-03

### Fixed

- Fix floating promise in constructor ([#680](https://github.com/Level/levelup/issues/680)) ([**@vweevers**](https://github.com/vweevers))

## [4.3.0] - 2019-09-30

### Changed

- Rewrite `buster` tests as `tape` tests ([#674](https://github.com/Level/levelup/issues/674)) ([**@vweevers**](https://github.com/vweevers))
- Create test suite ([#677](https://github.com/Level/levelup/issues/677)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add manifest ([Level/community#83](https://github.com/Level/community/issues/83)) ([#678](https://github.com/Level/levelup/issues/678)) ([**@vweevers**](https://github.com/vweevers))
- Add `type` property for `reachdown` ([Level/community#82](https://github.com/Level/community/issues/82)) ([#678](https://github.com/Level/levelup/issues/678)) ([**@vweevers**](https://github.com/vweevers))

## [4.2.0] - 2019-09-08

### Changed

- Upgrade `deferred-leveldown` from `~5.1.0` to `~5.2.0` ([#669](https://github.com/Level/levelup/issues/669)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `hallmark` devDependency from `^0.1.0` to `^2.0.0` ([#664](https://github.com/Level/levelup/issues/664), [#672](https://github.com/Level/levelup/issues/672)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^12.0.0` to `^14.1.0` ([#663](https://github.com/Level/levelup/issues/663), [`cd3af83`](https://github.com/Level/levelup/commit/cd3af83)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `memdown` devDependency from `^4.0.0` to `^5.0.0` ([#668](https://github.com/Level/levelup/issues/668)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add `clear()` method to delete all entries or a range ([#669](https://github.com/Level/levelup/issues/669)) ([**@vweevers**](https://github.com/vweevers))

## [4.1.0] - 2019-06-28

### Changed

- Upgrade `deferred-leveldown` from `~5.0.0` to `~5.1.0` ([#657](https://github.com/Level/levelup/issues/657)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `delayed` devDependency from `^1.0.1` to `^2.0.0` ([#659](https://github.com/Level/levelup/issues/659)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Test `seek()` integration ([#661](https://github.com/Level/levelup/issues/661)) ([**@vweevers**](https://github.com/vweevers)) \*
- Support options passed to `open()` ([#660](https://github.com/Level/levelup/issues/660), [#662](https://github.com/Level/levelup/issues/662)) ([**@achingbrain**](https://github.com/achingbrain), [**@vweevers**](https://github.com/vweevers))

**\* Historical Note** Many thanks to [**@MeirionHughes**](https://github.com/MeirionHughes) for adding `seek()` support to `memdown`, `encoding-down`, `deferred-leveldown` and `subleveldown`. At the time of writing, all but `subleveldown` have been released. Go forth and seek!

## [4.0.2] - 2019-06-08

### Changed

- Replace `async` devDependency with `async-each` and `run-*` ([#654](https://github.com/Level/levelup/issues/654)) ([`d9ff554`](https://github.com/Level/levelup/commit/d9ff554)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `nyc` devDependency from `^13.1.0` to `^14.0.0` ([#649](https://github.com/Level/levelup/issues/649)) ([`4f8b141`](https://github.com/Level/levelup/commit/4f8b141)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Document need of Promise polyfill for IE ([`a2e7a49`](https://github.com/Level/levelup/commit/a2e7a49)) ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove unused `test-10k-times.sh` ([#651](https://github.com/Level/levelup/issues/651)) ([`6a033f1`](https://github.com/Level/levelup/commit/6a033f1)) ([**@MadsAndreasenTechPeople**](https://github.com/MadsAndreasenTechPeople))
- Remove outdated `Support` section from `README.md` ([`956eb0b`](https://github.com/Level/levelup/commit/956eb0b)) ([**@vweevers**](https://github.com/vweevers))
- Remove references to old wiki in favor of [`Level/awesome`](https://github.com/Level/awesome) ([`f534fde`](https://github.com/Level/levelup/commit/f534fde)) ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Fix Level badge ([`1a2199f`](https://github.com/Level/levelup/commit/1a2199f)) ([**@vweevers**](https://github.com/vweevers))
- Remove link to dead website ([`c8ccb6c`](https://github.com/Level/levelup/commit/c8ccb6c)) ([**@vweevers**](https://github.com/vweevers))

## [4.0.1] - 2019-03-30

### Changed

- Upgrade dependencies of benchmarks ([#637](https://github.com/Level/levelup/issues/637)) ([**@morolt**](https://github.com/morolt))
- Upgrade `memdown` devDependency from `^3.0.0` to `^4.0.0` ([#646](https://github.com/Level/levelup/issues/646)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `bl` devDependency from `^2.0.0` to `^3.0.0` ([#643](https://github.com/Level/levelup/issues/643)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `airtap` devDependency from `0.1.0` to `^2.0.0` ([#631](https://github.com/Level/levelup/issues/631)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `encoding-down` devDependency from `^5.0.0` to `^6.0.0` ([#629](https://github.com/Level/levelup/issues/629)) ([**@vweevers**](https://github.com/vweevers))
- Apply common project tweaks ([#634](https://github.com/Level/levelup/issues/634), [#635](https://github.com/Level/levelup/issues/635), [`b83add5`](https://github.com/Level/levelup/commit/b83add5)) ([**@vweevers**](https://github.com/vweevers))

## [4.0.0] - 2018-12-22

### Changed

- Upgrade `nyc` devDependency from `~12.0.2` to `~13.1.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `deferred-leveldown` dependency from `~4.0.0` to `~5.0.0` ([**@vweevers**](https://github.com/vweevers))
- Upgrade `concat-stream` devDependency from `~1.6.0` to `~2.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `level-iterator-stream` dependency from `~3.0.0` to `~4.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Replace `remark-cli` with `hallmark` ([#621](https://github.com/level/levelup/issues/621)) ([**@vweevers**](https://github.com/vweevers))
- Upgrade `standard` devDependency from `^11.0.0` to `^12.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `.nyc_output/` to `.npmignore` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `IE10` from `airtap` ([#625](https://github.com/level/levelup/issues/625)) ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.1.1] - 2018-07-14

### Changed

- Upgrade `airtap` from `0.0.7` to `0.1.0` ([**@vweevers**](https://github.com/vweevers), [**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `level-iterator-stream` from `~2.0.0` to `~3.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Pass options to `batch.write()` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Add `nyc` and `coveralls` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove node 9 ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix issue with `airtap --local` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Call `rs.destroy()` without using `.bind()` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.1.0] - 2018-06-22

### Changed

- Upgrade `airtap` from `0.0.6` to `0.0.7` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `.npmignore` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Tweak copyright year for less maintenance ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Added

- Expose `db.iterator()` ([**@vweevers**](https://github.com/vweevers))
- Add `remark` tooling ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove `contributors` from `package.json` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove copyright headers from code ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove LevelDB and Snappy credits ([**@vweevers**](https://github.com/vweevers))

### Fixed

- Replace `remark` with `remark-cli` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.0.1] - 2018-05-24

### Changed

- Upgrade `airtap` to `0.0.6` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `.jshintrc` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `brfs` and use `Buffer.from()` in favor of `fs.readFileSync()` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [3.0.0] - 2018-05-23

### Added

- Add node 10 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add browser support to test suite ([**@vweevers**](https://github.com/vweevers))
- Add `airtap` for browser tests in Sauce Labs ([**@vweevers**](https://github.com/vweevers))

### Changed

- Upgrade `memdown` to `^3.0.0` ([**@vweevers**](https://github.com/vweevers))
- Upgrade `encoding-down` to `^5.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `deferred-leveldown` to `~4.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `standard` to `^11.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `level-errors` to `~2.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `bl` to `^2.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: tweak api sub sections ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix defunct `keyEncoding` in `inject-encoding-test.js` ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove irrelevant `leveldown-substitution-test.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove node 4 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove batch operations defaulting to `put` ([**@vweevers**](https://github.com/vweevers))
- Remove compiler toolchain from Travis ([**@vweevers**](https://github.com/vweevers))

## [2.0.2] - 2018-02-12

### Added

- Add 9 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade `browserify` to `16.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `leveldown` to `3.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `deferred-leveldown` to `3.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: normalize readme style ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: use markdown links instead of `<a href></a>` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Clarify 'must provide db' error message ([**@adityapurwa**](https://github.com/adityapurwa))
- Update copyright year to 2018 ([**@adityapurwa**](https://github.com/adityapurwa))

### Removed

- Remove `abstract-leveldown` devDependency ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.1] - 2017-11-11

### Changed

- README: clarify that options are specific to the underlying store ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `abstract-leveldown` to `3.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `encoding-down` to `3.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Restore support for node 4 ([**@farskipper**](https://github.com/farskipper))

## [2.0.0] - 2017-10-10

### Added

- Add default export ([**@zixia**](https://github.com/zixia))
- Test that key and value of queued operation is not serialized ([**@vweevers**](https://github.com/vweevers))
- Test JSON encoding with stream ([**@vweevers**](https://github.com/vweevers))
- Add smoke test for `levelup` and `leveldown` without `encoding-down` ([**@vweevers**](https://github.com/vweevers))

### Changed

- Upgrade `leveldown` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: prefer 'underlying store' over database, backend etc ([**@vweevers**](https://github.com/vweevers))
- README: update badges ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: unquote properties ([**@vweevers**](https://github.com/vweevers))
- README: clarify what excluding callback means ([**@vweevers**](https://github.com/vweevers))
- README: 'arbitrary data object' => 'of any type' ([**@vweevers**](https://github.com/vweevers))
- README: reduce 'supported platforms' section ([**@vweevers**](https://github.com/vweevers))
- README: rewrite intro and relationship with leveldown ([**@vweevers**](https://github.com/vweevers))
- README: cleanup ([**@vweevers**](https://github.com/vweevers))
- README: fix bad async code example ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `deferred-leveldown` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove unstable typings and Typescript tests ([**@MeirionHughes**](https://github.com/MeirionHughes))

## [2.0.0-rc3] - 2017-09-15

### Changed

- Refactor typings, use `abstract-leveldown` types ([**@MeirionHughes**](https://github.com/MeirionHughes))
- Upgrade `leveldown` ([**@MeirionHughes**](https://github.com/MeirionHughes))

### Fixed

- Correct bad encoding options in tests ([**@MeirionHughes**](https://github.com/MeirionHughes))

## [2.0.0-rc2] - 2017-09-11

### Added

- README: add node version badge ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add Typescript definitions and testing ([**@MeirionHughes**](https://github.com/MeirionHughes))

### Changed

- README: homogenize readme style ([**@vweevers**](https://github.com/vweevers))
- Upgrade `level-errors` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Optimize Typescript tests ([**@vweevers**](https://github.com/vweevers))

### Removed

- Remove 7 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [2.0.0-rc1] - 2017-09-01

### Added

- Add `Promise` to the API if callbacks are omitted ([**@juliangruber**](https://github.com/juliangruber))
- Add Greenkeeper badge ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add tests for `maybeError()` calling back synchronously if db is closed ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade `deferred-leveldown` to `2.0.0` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Change `levelup` constructor to take store as first parameter ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Switch to use `AbstractLevelDOWN#status` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade copyright year to 2017 ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Rename `lib/util.js` to `lib/promisify.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove `approximateSize()` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `destroy()` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `repair()` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `getProperty()` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `.errorIfExists` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `.createIfMissing` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `.compression` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `.cacheSize` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `.sync` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `.fillCache` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove optional `leveldown` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove unused `options` parameter from `maybeError` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `browser` field from `package.json` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove 0.12 and 4 from Travis ([**@juliangruber**](https://github.com/juliangruber))
- Remove unused `isDefined` from `lib/util.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove encodings ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `dispatchError()`, callback is always a function ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix problems with zalgo in `maybeError()` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.3.9] - 2017-07-26

### Added

- Add `standard` for linting ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add 8 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Ignore `package-lock.json` and `yarn.lock` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: make code examples adhere to `standard` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.3.8] - 2017-05-29

### Changed

- Revert previous `getLevelDOWN` fix ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Throw more descriptive error if db factory is not a function ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.3.7] - 2017-05-24

### Fixed

- Avoid calling `getLevelDOWN` if not present ([**@diasdavid**](https://github.com/diasdavid))

## [1.3.6] - 2017-05-10

### Changed

- Pull `LevelDOWN` loader out to non browserified module ([**@kemitchell**](https://github.com/kemitchell))

## [1.3.5] - 2017-03-02

### Changed

- Explicitly require `leveldown/package.json` ([**@PascalTemel**](https://github.com/PascalTemel))

## [1.3.4] - 2017-03-02

### Added

- Add 7 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove 0.10 and 5 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.3.3] - 2016-10-09

### Changed

- README: fix typo ([**@jamesgrayling**](https://github.com/jamesgrayling))
- README: fix typo ([**@danielravina**](https://github.com/danielravina))
- README: fix typo ([**@juliangruber**](https://github.com/juliangruber))

## [1.3.2] - 2016-05-17

### Added

- Add node 6 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Use `sudo: false` to run tests in containers on Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update `package.json` ([**@0x00A**](https://github.com/0x00A))
- README: fix typos ([**@pra85**](https://github.com/pra85))
- README: changed build status ticker from png to svg ([**@montyanderson**](https://github.com/montyanderson))
- README: link build badge to master branch ([**@a0viedo**](https://github.com/a0viedo))
- Update copyright year to 2016 ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Rename `appromixate-size-test.js` to `approximate-size-test.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove non supported versions from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Ensure Travis can compile in case no prebuilt binaries can be found ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Fix deprecation test ([**@juliangruber**](https://github.com/juliangruber))

## [1.3.1] - 2015-12-10

### Added

- Add node 5 to travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade outdated dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Test on latest node 2, node 3 ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.3.0] - 2015-11-12

### Changed

- README: fixed small typo (Stephen Sawchuck)
- README: update url to Snappy ([**@hansott**](https://github.com/hansott))
- README: add dependency badge ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Test on all major abi versions ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade outdated dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Track and expose chained batch ops queue length ([**@kemitchell**](https://github.com/kemitchell))

### Fixed

- Dev depend on `tap` to fix `npm@3` warning ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.2.1] - 2015-06-10

### Changed

- Improve error message when trying to require `leveldown` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.2.0] - 2015-06-04

### Changed

- Less restrictive version on `leveldown` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Handle errors in benchmarks ([**@juliangruber**](https://github.com/juliangruber))

## [1.1.1] - 2015-05-29

### Added

- Add link to `level/community` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade `leveldown` dependency ([**@juliangruber**](https://github.com/juliangruber))

### Removed

- Remove compression tests ([**@juliangruber**](https://github.com/juliangruber))

## [1.1.0] - 2015-05-17

### Changed

- Batch operation default to `'put'` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.0.0] - 2015-05-14

### Removed

- Remove return values from `dispatchError()` and `readError()`, they are used as voids ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [1.0.0-5] - 2015-05-07

### Changed

- Target multiple iojs versions, remove notifications ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Deprecate static functions `destroy()` and `repair()` ([**@juliangruber**](https://github.com/juliangruber))

## [1.0.0-4] - 2015-05-06

### Changed

- Deprecate `.approximateSize()` ([**@juliangruber**](https://github.com/juliangruber))

## [1.0.0-3] - 2015-05-05

### Changed

- Replace `tap` with `tape` + `faucet` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Refactor read streams using `level-iterator-stream` and `level-codec` ([**@juliangruber**](https://github.com/juliangruber))

## [1.0.0-2] - 2015-04-30

### Changed

- Refactor ltgt encoding ([**@juliangruber**](https://github.com/juliangruber))

### Fixed

- Fix readStream \*AsBuffer options ([**@juliangruber**](https://github.com/juliangruber))

## [1.0.0-1] - 2015-04-28

### Added

- Add test for `valueEncoding` `'hex'` for `createReadStream` ([**@braydonf**](https://github.com/braydonf))

### Changed

- Upgrade dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix `valueEncoding` bug by passing options without array ([**@braydonf**](https://github.com/braydonf))

## [1.0.0-0] - 2015-04-28

### Added

- Add [**@jcrugzz**](https://github.com/jcrugzz) as contributor
- Add 0.12 and iojs to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Support values to be `null` or `undefined` ([**@kesla**](https://github.com/kesla))
- README: explain callback arguments to `del` ([**@bewest**](https://github.com/bewest))
- README: update logo and copyright ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: remove docs on `createWriteStream()` and add note on what happened to it ([**@jcrugzz**](https://github.com/jcrugzz))
- README: tweak explanation on why `createWriteStream()` was removed ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: clean up old `level-ws` reference ([**@ralphtheninja**](https://github.com/ralphtheninja))
- README: changed options for get to same as put ([**@RichardLitt**](https://github.com/RichardLitt))
- README: remove reference to write-stream and iterators ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Explicit devdep versions ([**@rvagg**](https://github.com/rvagg))
- Update Travis and `package.json` scripts ([**@jcrugzz**](https://github.com/jcrugzz))
- Added errors to the available namespace when requiring `levelup` ([**@braydonf**](https://github.com/braydonf))
- Extract error codes into `level-errors` module ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Use `level-codec` ([**@juliangruber**](https://github.com/juliangruber))
- Refactor iterators using new `deferred-leveldown` ([**@juliangruber**](https://github.com/juliangruber))

### Removed

- Remove 0.8 from Travis ([**@rvagg**](https://github.com/rvagg))
- Remove references to write-stream in tests ([**@jcrugzz**](https://github.com/jcrugzz))
- Remove references to write-stream ([**@jcrugzz**](https://github.com/jcrugzz))
- Remove fstream based tests ([**@jcrugzz**](https://github.com/jcrugzz))
- Remove `copy` as it requires write-stream ([**@jcrugzz**](https://github.com/jcrugzz))
- Remove unused dependencies ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `encoding` option ([**@juliangruber**](https://github.com/juliangruber))
- Remove `leveled` benchmarks ([**@juliangruber**](https://github.com/juliangruber))

### Fixed

- README: fix the leveldb link ([**@seriousManual**](https://github.com/seriousManual))
- Use newer memdown store ([**@sorribas**](https://github.com/sorribas))
- Check `notFound` on err ([**@doowb**](https://github.com/doowb))
- Fix benchmarks by installing `leveldown@^0.10.4` ([**@juliangruber**](https://github.com/juliangruber))
- Fix `stream-bench.js` ([**@juliangruber**](https://github.com/juliangruber))
- Replace `rvagg/node-` with `level` ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [0.19.1] - 2016-01-23

### Added

- Add 0.12, 1.0, 1.8, 2, 3, 4, 5 to Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Add `tape@4.x.x` ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Changed

- Upgrade `semver` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Upgrade `tap` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Update compiler on Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Fix `bustermove` version ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Removed

- Remove 0.8 from Travis ([**@ralphtheninja**](https://github.com/ralphtheninja))

## [0.19.0] - 2014-08-26

### Added

- Add suport for `lt`, `lte`, `gt`, and `gte` ([**@dominictarr**](https://github.com/dominictarr))
- Add `isDefined` to util ([**@dominictarr**](https://github.com/dominictarr))

### Changed

- Refactor encodings and codec from util to separate file ([**@dominictarr**](https://github.com/dominictarr))
- Decouple codec from levelup parts for allowing arbitrary encoding strategies ([**@dominictarr**](https://github.com/dominictarr))
- Decouple read-stream from encoding and opening stuff ([**@dominictarr**](https://github.com/dominictarr))
- Keep codec on the db as `db._codec` ([**@dominictarr**](https://github.com/dominictarr))
- Refactor error checks ([**@dominictarr**](https://github.com/dominictarr))
- README: document `lt`, `lte`, `gt`, and `gte` ([**@dominictarr**](https://github.com/dominictarr))
- README: clarify ltgt ([**@dominictarr**](https://github.com/dominictarr))
- README: unmention bops ([**@dominictarr**](https://github.com/dominictarr))
- README: discourage the use of `start` and `end` a bit ([**@raboof**](https://github.com/raboof))
- README: document what `limit` does in reverse mode ([**@raboof**](https://github.com/raboof))
- README: use highest/lowest instead of largest/smallest ([**@raboof**](https://github.com/raboof))
- Binary encoding in the browser ([**@calvinmetcalf**](https://github.com/calvinmetcalf))
- Document code with comments ([**@dominictarr**](https://github.com/dominictarr))
- Minor style fixes ([**@rvagg**](https://github.com/rvagg))
- Minor whitespace changes ([**@rvagg**](https://github.com/rvagg))
- Update nodeico badge ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix license ([**@rvagg**](https://github.com/rvagg))

## [0.18.6] - 2014-07-26

### Changed

- Change from MIT +no-false-attribs License to plain MIT ([**@andrewrk**](https://github.com/andrewrk))
- Upgrade `bl` dependency ([**@raynos**](https://github.com/raynos))

## [0.18.5] - 2014-06-26

### Fixed

- Replace `concat-stream` with `bl`, fixes [#251](https://github.com/Level/levelup/issues/251) ([**@rvagg**](https://github.com/rvagg))

## [0.18.4] - 2014-06-24

### Changed

- Reorder dependencies ([**@juliangruber**](https://github.com/juliangruber))
- Upgrade dependencies ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix race condition on read stream's `self._iterator` ([**@nolanlawson**](https://github.com/nolanlawson))

## [0.18.3] - 2014-04-26

### Changed

- README: fix formatting ([**@rvagg**](https://github.com/rvagg))
- README: minor corrections ([**@guybrush**](https://github.com/guybrush))
- README: fix leveldown method wording ([**@juliangruber**](https://github.com/juliangruber))
- README: clarify `start`, `end` and `limit` options in `createReadStream` docs ([**@maxogden**](https://github.com/maxogden))

### Removed

- Remove `bops` and use `Buffer` instead ([**@nolanlawson**](https://github.com/nolanlawson))

## [0.18.2] - 2013-11-26

### Added

- Add `DNT` configuration ([**@rvagg**](https://github.com/rvagg))

### Changed

- Use `readable-stream` from user land across all node version ([**@rvagg**](https://github.com/rvagg))

## [0.18.1] - 2013-11-20

### Changed

- Make chained-batch obey global LevelUP object options ([**@mcavage**](https://github.com/mcavage))

## [0.18.0] - 2013-11-18

### Changed

- Upgrade to `LevelDOWN@0.10.0` (and bops@0.1.0 and readable-stream@1.1.9) ([**@rvagg**](https://github.com/rvagg))

## [0.17.0] - 2013-10-01

### Changed

- Undo factory pattern, use plain prototypal object and expose full prototype ([**@rvagg**](https://github.com/rvagg))
- Move Batch object to batch.js and expose ([**@rvagg**](https://github.com/rvagg))
- Use new package, DeferredLevelDOWN to handle all deferred open logic ([**@rvagg**](https://github.com/rvagg))
- Code cleanup, update deps (xtend) ([**@rvagg**](https://github.com/rvagg), [**@juliangruber**](https://github.com/juliangruber))

## [0.16.0] - 2013-09-10

### Added

- Add `notFound` boolean property and `status=404` property to NotFoundError ([**@rvagg**](https://github.com/rvagg))

### Changed

- Upgrade to `errno@0.1.0` which aliases `.type` and `.name` properties ([**@rvagg**](https://github.com/rvagg))
- ReadStream gracefully handles multiple `destroy()` calls ([**@mcollina**](https://github.com/mcollina))

## [0.15.0] - 2013-08-26

### Added

- Add [**@substack**](https://github.com/substack) as contributor

### Changed

- New ReadStream: upgrade to streams2, remove all state-management cruft, remove fstream support ([**@substack**](https://github.com/substack))
- Upgrade LevelDOWN dependency to ~0.8.0 with Iterator lt/lte/gt/gte support and NAN as a dependency ([**@rvagg**](https://github.com/rvagg))

## [0.14.0] - 2013-08-19

### Changed

- Encodings overhaul, allow custom encoders/decoders for `keyEncoding` or `valueEncoding` ([**@dominictarr**](https://github.com/dominictarr))

## [0.13.0] - 2013-08-11

### Changed

- Upgrade LevelDOWN dependency version ~0.7.0 for Node 0.8->0.11 compatibility ([**@rvagg**](https://github.com/rvagg))

## [0.12.0] - 2013-07-25

### Changed

- Upgrade LevelDOWN dependency version ~0.6.2 ([**@rvagg**](https://github.com/rvagg))

## [0.11.0] - 2013-07-17

### Added

- Add [**@pgte**](https://github.com/pgte) as contributor

### Changed

- Switch from direct Buffer access to bops for better browser compatibility ([**@juliangruber**](https://github.com/juliangruber))
- WriteStream#end accepts `data` argument ([**@pgte**](https://github.com/pgte))

### Removed

- Remove all Function#bind calls for better browser compatibility ([**@juliangruber**](https://github.com/juliangruber))

## [0.10.0] - 2013-06-14

### Changed

- Upgrade to `LevelDOWN@0.6.0` which upgrades to `LevelDB@1.11.0`, some important bugfixes: <https://groups.google.com/forum/#!topic/leveldb/vS1JvmGlp4E> ([**@rvagg**](https://github.com/rvagg))

## [0.9.0] - 2013-05-21

### Changed

- Use LevelDOWN@0.5.0, see <https://github.com/level/leveldown/blob/master/CHANGELOG.md> for details ([**@rvagg**](https://github.com/rvagg))
- Race-condition(ish) fixed in ReadStream--createReadStream() does not start immediately and therefore allowed put()s to happen before the stream starts ([**@dominictarr**](https://github.com/dominictarr))
- ReadStream doesn't emit "ready" event ([**@dominictarr**](https://github.com/dominictarr))
- Allow separate encodings per operation in db.batch() ([**@juliangruber**](https://github.com/juliangruber))
- Allow separate encodings per write() in WriteStream ([**@juliangruber**](https://github.com/juliangruber))
- WriteStream supports "type" option ("put" \[default] or "del") on constructor and individual write()s ([**@mcollina**](https://github.com/mcollina))
- Expose LevelDOWN (or LevelDOWN substitute) as `db` property on LevelUP instance (e.g. db.db.approximateSize()) ([**@rvagg**](https://github.com/rvagg))
- Chained batch exposed from LevelDOWN, invoked with argument-less db.batch() ([**@juliangruber**](https://github.com/juliangruber), [**@rvagg**](https://github.com/rvagg))
- Significantly improve ReadStream performance by replacing .bind() and .apply() ([**@mcollina**](https://github.com/mcollina), [**@kesla**](https://github.com/kesla))
- Better Browserify support ([**@rvagg**](https://github.com/rvagg), [**@juliangruber**](https://github.com/juliangruber), [**@maxogden**](https://github.com/maxogden), etc.)
- Deprecate secondary LevelDB-specific operations on LevelUP, prefer direct LevelDOWN access (approximateSize(), repair(), destroy(), getProperty()--new in LevelDOWN@0.5.0) ([**@rvagg**](https://github.com/rvagg))

### Removed

- Remove "leveldown" from dependencies (see <http://r.va.gg/2013/05/levelup-v0.9-some-major-changes.html>) ([**@rvagg**](https://github.com/rvagg))

## [0.8.0] - 2013-04-17

### Changed

- More comprehensive argument checking, will now report back directly or throw if there is a problem rather than on nextTick ([**@rvagg**](https://github.com/rvagg))
- Expose `.options` property on LevelUP instances. ([**@rvagg**](https://github.com/rvagg))
- Further clarify 'encoding' -> 'valueEncoding' shift. db.options.valueEncoding is now authoritative even if user used 'encoding' on initialisation. ([**@rvagg**](https://github.com/rvagg))
- `level` package now published to npm that bundles `LevelUP` and `LevelDOWN` and exposes `LevelUP` directly; for planned shift to detaching LevelDOWN as a direct-dependency of LevelUP. ([**@rvagg**](https://github.com/rvagg))

## [0.7.0] - 2013-04-08

### Added

- Add windows support in `LevelDOWN@0.2.0` ([**@rvagg**](https://github.com/rvagg))
- Add 'db' option on constructor to replace LevelDOWN ([**@rvagg**](https://github.com/rvagg))
- Add `repair()` and `destroy()` aliases for LevelDOWN implementations ([**@rvagg**](https://github.com/rvagg))

### Changed

- Improved ReadStream reverse=true start key handling ([**@kesla**](https://github.com/kesla))
- ReadStream empty start and end keys ignored rather than segfault ([**@kesla**](https://github.com/kesla))
- 'encoding' option now an alias for `valueEncoding` only, `keyEncoding` defaults to `'utf8'` and must be changed explicitly ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix early `close` emit in WriteStream ([**@rvagg**](https://github.com/rvagg))

## [0.6.2] - 2013-03-04

### Changed

- Use `xtend` package instead of internal `util._extend` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Internal cleanup of `callback` argument detection ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Move deferred-open-operations into an internal `this._db` wrapper rather than make them call public .get()/.put() etc. for a second time ([**@dominictarr**](https://github.com/dominictarr))

## [0.6.1] - 2013-03-01

### Changed

- Internal code cleanup and refactoring ([**@ralphtheninja**](https://github.com/ralphtheninja))

### Fixed

- Fix multiple `iterator.end()` calls in ReadStreams throwing errors, destroy() called while read/next is in progress [#82](https://github.com/level/levelup/issues/82) [#83](https://github.com/level/levelup/issues/83) [#84](https://github.com/level/levelup/issues/84) ([**@rvagg**](https://github.com/rvagg))

## [0.6.0] - 2013-02-25

### Changed

- Rename `ReadStream`, `KeyStream` and `ValueStream` to `createReadStream`, `createKeyStream` and `createValueStream` ([**@rvagg**](https://github.com/rvagg))
- Complete transition to `LevelDOWN` for the `LevelDB` binding. No native code left in `LevelUP` ([**@rvagg**](https://github.com/rvagg))
  - LevelDOWN now keeps its own ChangeLog at: <https://github.com/level/leveldown/blob/master/CHANGELOG.md>
  - LevelDB@1.9.0 and Snappy@1.1.0 are included in LevelDOWN@0.1.2

## [0.6.0-rc1] - 2013-02-24

### Changed

- Refactor and simplify db state code ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Extract all binding code to `leveldown` project ([**@rvagg**](https://github.com/rvagg))
- Depend on `leveldown@0.0.1` ([**@rvagg**](https://github.com/rvagg))
- Simplify callback signature by removing extra, undocumented properties from some callbacks ([**@rvagg**](https://github.com/rvagg), [**@dominictarr**](https://github.com/dominictarr))

## [0.5.4] - 2013-02-15

### Changed

- Move `encodingOpts` from `levelup.js` to `util.js` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Allow one `next()` at a time, improve `end()` handling ([**@rvagg**](https://github.com/rvagg))
- Use explicit namespaces in C++ ([**@rvagg**](https://github.com/rvagg))

### Removed

- Remove `CloseError` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Remove `.useBatch` in `copy()` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Ensure iterator `end` and `next` don't conflict ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix `put`/`batch` bug in `WriteStream#_process()` ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Fix memory leak, `Persistent<Function>` callback not Dispose()d for `readStream()` ([**@rvagg**](https://github.com/rvagg))

## [0.5.3] - 2013-01-28

### Changed

- Disable all sqlite3 benchmarks ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Put `LevelUP()` into closure ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Swap `bufferstream` dependency for `simple-bufferstream` ([**@rvagg**](https://github.com/rvagg))
- Make `location` a read-only property on db object ([**@rvagg**](https://github.com/rvagg))

## [0.5.3-1] - 2013-02-05

### Changed

- Non shrinkwrapped release [**@rvagg**](https://github.com/rvagg)

## [0.5.2] - 2013-01-23

### Fixed

- Fix incorrect scope in approximateSize function ([**@sandfox**](https://github.com/sandfox))

## [0.5.1] - 2013-01-10

### Changed

- Version bump ([**@rvagg**](https://github.com/rvagg))

## [0.5.0] - 2013-01-08

### Added

- Add support for setting size of LRU-cache ([**@kesla**](https://github.com/kesla))

### Changed

- Use `util.inherits()` from node core ([**@ralphtheninja**](https://github.com/ralphtheninja))
- Adjust copyright & contributors ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Idempotent open and close, and emit \_state as events ([**@dominictarr**](https://github.com/dominictarr))
- Check that UINT32_OPTION_VALUE is a Uint32 ([**@kesla**](https://github.com/kesla))

## [0.5.0-1] - 2013-01-09

### Added

### Changed

- Change `createIfMissing` option default to `true` ([**@rvagg**](https://github.com/rvagg))
- Use `util._extend` instead of local variant ([**@rvagg**](https://github.com/rvagg))

## [0.4.4] - 2013-01-01

### Fixed

- Set `.maxListeners` to `Infinity` to prevent warnings when using deferred open ([**@juliangruber**](https://github.com/juliangruber))

## [0.4.3] - 2012-12-30

### Added

- Add [**@kesla**](https://github.com/kesla) to contributors list ([**@rvagg**](https://github.com/rvagg))
- Add `approximateSize()` ([**@kesla**](https://github.com/kesla))

## [0.4.2] - 2012-12-30

### Added

- Add [**@ralphtheninja**](https://github.com/ralphtheninja) to contributors list ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Use `setImmediate` instead of `process.nextTick` for `node@0.9.5` compatibility ([**@rvagg**](https://github.com/rvagg))

## [0.4.1] - 2012-12-19

### Removed

- Remove `useBatch` option on `writeStream()` [**@rvagg**](https://github.com/rvagg)

## [0.4.0] - 2012-12-17

### Added

- Add SQLite3 to test suite ([**@rvagg**](https://github.com/rvagg))
- Add basic `get()` benchmarks ([**@rvagg**](https://github.com/rvagg))
- Add `compress` boolean on `open()` ([**@rvagg**](https://github.com/rvagg))

### Changed

- Speed up `batch()` and allow non-Strings to C++ ([**@rvagg**](https://github.com/rvagg))
- Improved compression test ([**@rvagg**](https://github.com/rvagg))
- Return Strings not Buffers from C++ when possible ([**@rvagg**](https://github.com/rvagg))
- Optimised encoders and decoders ([**@rvagg**](https://github.com/rvagg))
- Revamped benchmark suite ([**@rvagg**](https://github.com/rvagg))
- Allow JS Strings through to native layer ([**@rvagg**](https://github.com/rvagg))
- Cleaner build for osx ([**@rvagg**](https://github.com/rvagg))
- Upgrade to `LevelDB@1.7` ([**@rvagg**](https://github.com/rvagg))

### Removed

- Remove old and unused util functions ([**@rvagg**](https://github.com/rvagg))
- Remove compile warnings on osx ([**@rvagg**](https://github.com/rvagg))
- Remove compile warnings for solaris ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix `batch()` benchmarks ([**@rvagg**](https://github.com/rvagg))

## [0.3.3] - 2012-12-14

### Added

- Add compression tests ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix Snappy compression ([**@rvagg**](https://github.com/rvagg))

## [0.3.2] - 2012-11-24

### Added

- Add more functional tests ([**@rvagg**](https://github.com/rvagg))
- Add snapshot tests ([**@rvagg**](https://github.com/rvagg))

### Changed

- Emit raw keys and values in events ([**@rvagg**](https://github.com/rvagg))

## [0.3.1] - 2012-11-21

### Added

- Add benchmark suite ([**@rvagg**](https://github.com/rvagg))
- Add `limit` option to `ReadStream` ([**@rvagg**](https://github.com/rvagg))

## [0.3.0] - 2012-11-18

### Added

- Add `.status` property to keep track of db status ([**@raynos**](https://github.com/raynos), [**@rvagg**](https://github.com/rvagg))
- Add `CloseError` error type ([**@raynos**](https://github.com/raynos), [**@rvagg**](https://github.com/rvagg))
- Add tests for deferred operations ([**@rvagg**](https://github.com/rvagg))

### Changed

- Document events ([**@rvagg**](https://github.com/rvagg))
- Run the encoding on `start` and `end` in case your keys are JSON encoded ([**@raynos**](https://github.com/raynos))
- First attempt at deferring operations. All operations that used to throw when called before open are now called once the database is open ([**@raynos**](https://github.com/raynos), [**@rvagg**](https://github.com/rvagg))

### Fixed

- If status is `'closing'`, call callback after db is closed ([**@raynos**](https://github.com/raynos), [**@rvagg**](https://github.com/rvagg))

## [0.2.1] - 2012-10-28

### Fixed

- Fix db GC when using multiple `ReadStream` ([**@rvagg**](https://github.com/rvagg))

## [0.2.0] - 2012-10-28

### Added

- Add support for Solaris/SunOS/SmartOS ([**@rvagg**](https://github.com/rvagg))

## [0.1.2] - 2012-10-26

### Fixed

- Fix bug with falsey values on `start` and `end`, fixes [#8](https://github.com/Level/levelup/issues/8) ([**@rvagg**](https://github.com/rvagg))

## [0.1.1] - 2012-10-17

### Fixed

- Fix bug with sticky options, fixes [#6](https://github.com/Level/levelup/issues/6) ([**@rvagg**](https://github.com/rvagg))

## [0.1.0] - 2012-09-28

### Added

- Add Travis setup ([**@rvagg**](https://github.com/rvagg))
- Add `KeyStream()` and `ValueStream()` ([**@rvagg**](https://github.com/rvagg))

## [0.0.5] - 2012-09-22

### Changed

- Native layer errors if `key` or `value` are `undefined` or `null` ([**@rvagg**](https://github.com/rvagg))

## [0.0.5-1] - 2012-09-28

### Added

- Add description to `package.json` ([**@rvagg**](https://github.com/rvagg))

## [0.0.4] - 2012-09-12

### Fixed

- Fix bug with `options` not being passed to readable streams ([**@rvagg**](https://github.com/rvagg))

## [0.0.3] - 2012-09-09

### Added

- Add `reverse` functionality to readable streams ([**@rvagg**](https://github.com/rvagg))

## [0.0.2] - 2012-09-07

### Changed

- Do not encourage using async `throw` in documentation ([**@rvagg**](https://github.com/rvagg))
- Return to classical prototypal inheritance ([**@rvagg**](https://github.com/rvagg))

### Fixed

- Fix typos in documentation ([**@rvagg**](https://github.com/rvagg))

## [0.0.2-1] - 2012-09-07

### Added

- Add repository information to `package.json` ([**@rvagg**](https://github.com/rvagg))

## [0.0.1] - 2012-08-31

### Added

- Add `start` and `end` options for readable streams ([**@rvagg**](https://github.com/rvagg))
- Add `'json'` encoding ([**@rvagg**](https://github.com/rvagg))
- Add `.nextLocation()`, `.checkBinaryTestData()`, `.loadBinaryTestData()`, `.openTestDatabase()`, `.commonTearDown()`, `.commonSetup()` and `.binaryTestDataMD5Sum` to `test/common.js` ([**@rvagg**](https://github.com/rvagg))
- Add tests for `.readStream()` with `start` being midway key ([**@rvagg**](https://github.com/rvagg))
- Add keywords to `package.json` ([**@rvagg**](https://github.com/rvagg))

### Changed

- New API. Database constructor now accepts callback ([**@rvagg**](https://github.com/rvagg))
- Update documentation for new API ([**@rvagg**](https://github.com/rvagg))

### Removed

- Remove usage of `global` in tests ([**@rvagg**](https://github.com/rvagg))

## [0.0.0] - 2012-08-17

:seedling: Initial release.

## 0.0.0-1 - 2012-08-18

### Added

- Add `bufferstream` dependency ([**@rvagg**](https://github.com/rvagg))

### Changed

- Document `ReadStream` and `WriteStream` ([**@rvagg**](https://github.com/rvagg))
- Start using `~` in dependencies ([**@rvagg**](https://github.com/rvagg))

### Removed

- Remove unused `inherits` variable ([**@rvagg**](https://github.com/rvagg))

[4.4.0]: https://github.com/Level/levelup/compare/v4.3.2...v4.4.0

[4.3.2]: https://github.com/Level/levelup/compare/v4.3.1...v4.3.2

[4.3.1]: https://github.com/Level/levelup/compare/v4.3.0...v4.3.1

[4.3.0]: https://github.com/Level/levelup/compare/v4.2.0...v4.3.0

[4.2.0]: https://github.com/Level/levelup/compare/v4.1.0...v4.2.0

[4.1.0]: https://github.com/Level/levelup/compare/v4.0.2...v4.1.0

[4.0.2]: https://github.com/Level/levelup/compare/v4.0.1...v4.0.2

[4.0.1]: https://github.com/Level/levelup/compare/v4.0.0...v4.0.1

[4.0.0]: https://github.com/Level/levelup/compare/v3.1.1...v4.0.0

[3.1.1]: https://github.com/Level/levelup/compare/v3.1.0...v3.1.1

[3.1.0]: https://github.com/Level/levelup/compare/v3.0.1...v3.1.0

[3.0.1]: https://github.com/Level/levelup/compare/v3.0.0...v3.0.1

[3.0.0]: https://github.com/Level/levelup/compare/v2.0.2...v3.0.0

[2.0.2]: https://github.com/Level/levelup/compare/v2.0.1...v2.0.2

[2.0.1]: https://github.com/Level/levelup/compare/v2.0.0...v2.0.1

[2.0.0]: https://github.com/Level/levelup/compare/v2.0.0-rc3...v2.0.0

[2.0.0-rc3]: https://github.com/Level/levelup/compare/v2.0.0-rc2...v2.0.0-rc3

[2.0.0-rc2]: https://github.com/Level/levelup/compare/v2.0.0-rc1...v2.0.0-rc2

[2.0.0-rc1]: https://github.com/Level/levelup/compare/v1.3.9...v2.0.0-rc1

[1.3.9]: https://github.com/Level/levelup/compare/v1.3.8...v1.3.9

[1.3.8]: https://github.com/Level/levelup/compare/v1.3.7...v1.3.8

[1.3.7]: https://github.com/Level/levelup/compare/v1.3.6...v1.3.7

[1.3.6]: https://github.com/Level/levelup/compare/v1.3.5...v1.3.6

[1.3.5]: https://github.com/Level/levelup/compare/v1.3.4...v1.3.5

[1.3.4]: https://github.com/Level/levelup/compare/v1.3.3...v1.3.4

[1.3.3]: https://github.com/Level/levelup/compare/v1.3.2...v1.3.3

[1.3.2]: https://github.com/Level/levelup/compare/v1.3.1...v1.3.2

[1.3.1]: https://github.com/Level/levelup/compare/v1.3.0...v1.3.1

[1.3.0]: https://github.com/Level/levelup/compare/v1.2.1...v1.3.0

[1.2.1]: https://github.com/Level/levelup/compare/v1.2.0...v1.2.1

[1.2.0]: https://github.com/Level/levelup/compare/v1.1.1...v1.2.0

[1.1.1]: https://github.com/Level/levelup/compare/v1.1.0...v1.1.1

[1.1.0]: https://github.com/Level/levelup/compare/v1.0.0...v1.1.0

[1.0.0]: https://github.com/Level/levelup/compare/v1.0.0-5...v1.0.0

[1.0.0-5]: https://github.com/Level/levelup/compare/v1.0.0-4...v1.0.0-5

[1.0.0-4]: https://github.com/Level/levelup/compare/v1.0.0-3...v1.0.0-4

[1.0.0-3]: https://github.com/Level/levelup/compare/v1.0.0-2...v1.0.0-3

[1.0.0-2]: https://github.com/Level/levelup/compare/v1.0.0-1...v1.0.0-2

[1.0.0-1]: https://github.com/Level/levelup/compare/v1.0.0-0...v1.0.0-1

[1.0.0-0]: https://github.com/Level/levelup/compare/v0.19.1...v1.0.0-0

[0.19.1]: https://github.com/Level/levelup/compare/v0.19.0...v0.19.1

[0.19.0]: https://github.com/Level/levelup/compare/v0.18.6...v0.19.0

[0.18.6]: https://github.com/Level/levelup/compare/v0.18.5...v0.18.6

[0.18.5]: https://github.com/Level/levelup/compare/v0.18.4...v0.18.5

[0.18.4]: https://github.com/Level/levelup/compare/v0.18.3...v0.18.4

[0.18.3]: https://github.com/Level/levelup/compare/v0.18.2...v0.18.3

[0.18.2]: https://github.com/Level/levelup/compare/v0.18.1...v0.18.2

[0.18.1]: https://github.com/Level/levelup/compare/0.18.0...v0.18.1

[0.18.0]: https://github.com/Level/levelup/compare/0.17.0...0.18.0

[0.17.0]: https://github.com/Level/levelup/compare/0.16.0...0.17.0

[0.16.0]: https://github.com/Level/levelup/compare/0.15.0...0.16.0

[0.15.0]: https://github.com/Level/levelup/compare/0.14.0...0.15.0

[0.14.0]: https://github.com/Level/levelup/compare/0.13.0...0.14.0

[0.13.0]: https://github.com/Level/levelup/compare/0.12.0...0.13.0

[0.12.0]: https://github.com/Level/levelup/compare/0.11.0...0.12.0

[0.11.0]: https://github.com/Level/levelup/compare/0.10.0...0.11.0

[0.10.0]: https://github.com/Level/levelup/compare/0.9.0...0.10.0

[0.9.0]: https://github.com/Level/levelup/compare/0.8.0...0.9.0

[0.8.0]: https://github.com/Level/levelup/compare/0.7.0...0.8.0

[0.7.0]: https://github.com/Level/levelup/compare/0.6.2...0.7.0

[0.6.2]: https://github.com/Level/levelup/compare/0.6.1...0.6.2

[0.6.1]: https://github.com/Level/levelup/compare/0.6.0...0.6.1

[0.6.0]: https://github.com/Level/levelup/compare/0.6.0-rc1...0.6.0

[0.6.0-rc1]: https://github.com/Level/levelup/compare/0.5.4...0.6.0-rc1

[0.5.4]: https://github.com/Level/levelup/compare/0.5.3...0.5.4

[0.5.3]: https://github.com/Level/levelup/compare/0.5.3-1...0.5.3

[0.5.3-1]: https://github.com/Level/levelup/compare/0.5.2...0.5.3-1

[0.5.2]: https://github.com/Level/levelup/compare/0.5.1...0.5.2

[0.5.1]: https://github.com/Level/levelup/compare/0.5.0...0.5.1

[0.5.0]: https://github.com/Level/levelup/compare/0.5.0-1...0.5.0

[0.5.0-1]: https://github.com/Level/levelup/compare/0.4.4...0.5.0-1

[0.4.4]: https://github.com/Level/levelup/compare/0.4.3...0.4.4

[0.4.3]: https://github.com/Level/levelup/compare/0.4.2...0.4.3

[0.4.2]: https://github.com/Level/levelup/compare/0.4.1...0.4.2

[0.4.1]: https://github.com/Level/levelup/compare/0.4.0...0.4.1

[0.4.0]: https://github.com/Level/levelup/compare/0.3.3...0.4.0

[0.3.3]: https://github.com/Level/levelup/compare/0.3.2...0.3.3

[0.3.2]: https://github.com/Level/levelup/compare/0.3.1...0.3.2

[0.3.1]: https://github.com/Level/levelup/compare/0.3.0...0.3.1

[0.3.0]: https://github.com/Level/levelup/compare/0.2.1...0.3.0

[0.2.1]: https://github.com/Level/levelup/compare/0.2.0...0.2.1

[0.2.0]: https://github.com/Level/levelup/compare/0.1.2...0.2.0

[0.1.2]: https://github.com/Level/levelup/compare/0.1.1...0.1.2

[0.1.1]: https://github.com/Level/levelup/compare/0.1.0...0.1.1

[0.1.0]: https://github.com/Level/levelup/compare/0.0.5...0.1.0

[0.0.5]: https://github.com/Level/levelup/compare/0.0.5-1...0.0.5

[0.0.5-1]: https://github.com/Level/levelup/compare/0.0.4...0.0.5-1

[0.0.4]: https://github.com/Level/levelup/compare/0.0.3...0.0.4

[0.0.3]: https://github.com/Level/levelup/compare/0.0.2...0.0.3

[0.0.2]: https://github.com/Level/levelup/compare/0.0.2-1...0.0.2

[0.0.2-1]: https://github.com/Level/levelup/compare/0.0.1...0.0.2-1

[0.0.1]: https://github.com/Level/levelup/compare/0.0.0...0.0.1

[0.0.0]: https://github.com/Level/levelup/compare/0.0.0-1...0.0.0
