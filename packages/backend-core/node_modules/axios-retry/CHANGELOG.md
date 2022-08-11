# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.2.4] - 2021-10-27

- fix: add package.json to exports

## [3.2.3] - 2021-10-19

- fix: removed breaking requirements introduced in 3.2.1
- fix: allow Typescript CommonJS default import

## [3.2.2] - 2021-10-14

- fix: added missing @babel/runtime runtime dep

## [3.2.1] - 2021-10-14

- updated all dependencies
- made the package hybrid (ES modules and CommonJS)
- BREAKING: axios >=0.21.2 is now required to work as a peer dep.
- BREAKING: NodeJS "^12.20.0 || ^14.13.1 || >=16.0.0" to work

## [3.2.0] - 2021-09-28

### Added

- Retry condition accepts a function that returns a Promise resolving to a boolean

## [3.1.9] - 2020-09-18

### Fixed

- TS: extended AxiosRequestConfig with optional "axios-retry" property

## [3.1.8] - 2019-04-24

### Fixed

- TS: export types for all functions

## [3.1.7] - 2019-04-23

### Fixed

- Fixed default export to resolve TS2309
- Updated dependencies to fix build error
- Added missing CHANGELOG entries (versions 3.0.1 until today)

## [3.1.6] - 2019-04-21

### Fixed

- Fixed export of `IAxiosRetryConfig`

## [3.1.5] - 2019-04-20

### Fixed

- Fixed TS definitions

## [3.1.4] - 2019-04-18

### Fixed

- Fixed TS definitions

### Added

- Added note in README related to compatibility issue with `axios 0.19.0`
- Updated LICENSE

## [3.1.2] - 2019-01-24

### Added

- TravisCI build status badge in README
- Update `index.d.ts` with missing functions

## [3.1.1] - 2018-06-13

### Fixed

- Do not run `requestTransform` again after retry

### Added

- Explicit return type on `axiosRetry`
- Prettier

## [3.1.0] - 2018-04-26

### Fixed

- Export `isRetryableError` for CommonJS

### Added

- Added additional param `shouldResetTimeout`

## [3.0.2] - 2018-02-09

### Added

- Now `isRetryableError` method is accessible.
- Added `delayStrategy` option to be able to have exponential backoff for successive retries.

## [3.0.1] - 2017-08-16

### Fixed

- Fixed first request time not being taken into account in timeout across retries.
- Fixed negative timeouts being passed to XHR (browsers), causing that no timeout was applied.
- Fixed safe methods and idempotent errors not being retried on unknown network errors.

## [3.0.0] - 2017-08-13

### Changed

- Retried errors on idempotent requests (5xx with get, head, options, put and delete) by default,
along with safe network errors.
- Moved some hard-coded conditions to the default `retryCondition` function so users can define a
custom function that overwrites them. The conditions that verify that the error is not a timeout or
an unsafe network error have been moved to `isNetworkError`.

### Added

- Added additional pre-defined retry conditions: `isSafeRequestError`, `isIdempotentRequestError`.

## [2.0.1] - 2017-06-19

### Fixed

- Removed dependency from the `package.json` file.

## [2.0.0] - 2017-06-15

### Changed

- Now the configured timeout in Axios is not for each retry request but for the whole request lifecycle.

## [1.3.1] - 2017-06-19

### Fixed

- Removed dependency from the `package.json` file.

## [1.3.0] - 2017-06-15

### Added

- Allowed per-request configuration using the `axios-retry` namespace.
