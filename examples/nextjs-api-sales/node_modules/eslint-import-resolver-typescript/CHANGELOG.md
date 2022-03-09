# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.5.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.4.0...v2.5.0) (2021-09-13)


### Features

* allow passing through custom options to resolve ([#79](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/79)) ([34c94c8](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/34c94c87066ba42fb2b52727b95f3e34259c227f))


### Bug Fixes

* bump (dev)Dependencies, apply stricter rules ([#75](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/75)) ([866f32f](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/866f32f2191dc7fc8df7d973cdacefa48c64a927))

## [2.4.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.3.0...v2.4.0) (2021-02-16)


### Features

* remove any querystring from imports ([#67](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/67)) ([82ef357](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/82ef3573fa1258e0de8d8181de57ae7109e35ec5))


### Bug Fixes

* remove .tsbuildinfo and d.ts.map files from package ([#57](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/57)) ([15f2849](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/15f2849c49bf1b4eb7719f027c61ca48b6e1f2a2))
* remove redundant condition ([#69](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/69)) ([ba62e65](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/ba62e65e7cfe382ff976238de3f100cd41c73e8f))

## [2.3.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.2.1...v2.3.0) (2020-09-01)


### Features

* import with .js and .jsx file extensions ([#56](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/56)) ([5340f96](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/5340f969fad38165f8cfb28025a5e15233d0e6f9))

### [2.2.1](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.2.0...v2.2.1) (2020-08-14)


### Bug Fixes

* replace postintall with prepare - fix [#54](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/54) ([f3ffd16](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/f3ffd16b93ba12c6cc0f4902efb7c14d021bd02e))

## [2.2.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.1.0...v2.2.0) (2020-07-30)


### Features

* rename option `directory` to `project` - close [#23](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/23) ([a662fc1](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/a662fc14f6833daf3b7a71f9137d1cbf9abb2b7c))

## [2.1.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.0.0...v2.1.0) (2020-07-30)


### Bug Fixes

* options could be null - close [#42](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/42) ([81db8eb](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/81db8eb0ae81af437e11b6341d8f237bc4bc4e39))
* typo ([#40](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/40)) ([585509e](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/585509e95f93adf8b7ef5839029c19c55edbe76e))
* wrong path resolution in multiple eslintrc configurations ([#51](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/51)) ([d563eeb](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/d563eeb2af2938b9ff7f75e0492a5a26112a4772)), closes [#50](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/50)

## [2.0.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v1.1.1...v2.0.0) (2019-10-17)


### Features

* add alwaysTryTypes option, add tests ([fe0aa6f](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/fe0aa6f0001904274c122d78cf0fd0757005b61f))
* replace glob with tiny-glob for faster speed, close [#12](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/12) ([f436627](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/f436627deb910afb332d6de9764a13f05b231dab))
* replace glob with tiny-glob for faster speed, close [#12](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/12) ([#13](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/13)) ([5f87698](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/5f8769830abcbb87e67e5788d4bbcda7a5e632c7))
* resolve .ts/.tsx/.d.ts first, and then fallback to @types/* ([b11ede3](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/b11ede3c9fafbc548db011729fd64e958cde6e51))
* support scoped packages from DefinitelyTyped ([b4e72a5](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/b4e72a54966bda12ef70791f09df5cbe0f04b889))
* use types/typings/module first to use .d.ts whenever possible ([74de3d9](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/74de3d9fa2552b5d1b0eb799638a657c9af67887))


### Bug Fixes

* add pretest script which is required ([1ffcd83](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/1ffcd834931ebc1f721543ed89d071a91fadb1ae))
* **deps:** bump configurations, use resolutions to simplify tests ([5eb4874](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/5eb48749870f8bcc5ff246a39d15daf19d11af39))
* only check alwaysTryTypes if foundNodePath is null ([23e2e8c](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/23e2e8cf71ee6c19da9f55e85b2ab34543d2a12e))
