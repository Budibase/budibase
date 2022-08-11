# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.0] - 2021-06-29

### Added

- `setRefreshOAuth2` option to customise the OAuth2 adapter that is used to refresh the access token.

## [2.0.2] - 2021-05-11

### Updated

- Update dependencies and test against node 16.

## [2.0.1] - 2020-12-02

### Updated

- Update dependencies and test against node 14.

## [2.0.0] - 2020-03-25

### Breaking

- Drop support for node < 10.

## [1.1.0] - 2018-06-06

### Added

- Support using a strategy which overrides the `getOAuthAccessToken` function, for example the Reddit or Spotify strategy. #10

## [1.0.0] - 2015-12-17

### Added

- Allow extra params to be sent when requesting access token.
- Use embedded `_oauth2` constructor to create new OAuth2 instance, to support instances where the `_oauth2` object is using a custom implementation.

### Removed

- Dropped peerDependency on `oauth2` library, in favour of using the `_oauth2` object exposed by passport.
- Dropped support for node.js 0.6 and 0.8, lowest supported version is now 0.10. _If you still need support for 0.6 or 0.8, please continue to use v0.4.0 of this module._

### Upgrading from 0.4

The move from 0.4 to 1.0 is non-breaking, _unless_ you are using a version of node.js lower than 0.10. In this case, you should stick to using 0.4. Otherwise, you can safely upgrade with no code changes required.

## [0.4.0] - 2015-04-01

### Added

- Allow strategy to be added with an explicit name: `refresh.use(name, strategy)`.

## [0.3.1] - 2015-03-06

### Changed

- Removed peer dependency on passport-oauth2, to fix npm 3 warning.

## [0.3.0] - 2015-01-27

### Added

- Support strategies which use separate URLs for generating and refreshing tokens (e.g. `passport-echosign`).

## [0.2.1] - 2014-11-16

### Fixed

- Fixed passport-oauth2 peer dependency link.

## [0.2.0] - 2014-11-16

### Changed

- Added passport-oauth2 as a peer dependency.

## [0.1.2] - 2014-11-16

### Changed

- Fixed git url.

## [0.1.1] - 2014-11-16

### Changed

- Fixed README typo.

## 0.1.0 - 2014-11-16

### Added

- Initial release.

[2.1.0]: https://github.com/fiznool/passport-oauth2-refresh/compare/v2.0.2...v2.1.0
[2.0.2]: https://github.com/fiznool/passport-oauth2-refresh/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/fiznool/passport-oauth2-refresh/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/fiznool/passport-oauth2-refresh/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/fiznool/passport-oauth2-refresh/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/fiznool/passport-oauth2-refresh/compare/v0.4.0...v1.0.0
[0.4.0]: https://github.com/fiznool/passport-oauth2-refresh/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/fiznool/passport-oauth2-refresh/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/fiznool/passport-oauth2-refresh/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/fiznool/passport-oauth2-refresh/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/fiznool/passport-oauth2-refresh/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/fiznool/passport-oauth2-refresh/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/fiznool/passport-oauth2-refresh/compare/v0.1.0...v0.1.1
