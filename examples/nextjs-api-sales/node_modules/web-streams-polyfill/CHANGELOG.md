# Changelog

> **Tags:**
> - 💥 Breaking Change
> - 👓 Spec Compliance
> - 🚀 New Feature
> - 🐛 Bug Fix
> - 👎 Deprecation
> - 📝 Documentation
> - 🏠 Internal
> - 💅 Polish

## v3.2.0 (2021-11-06)

* 👎 Deprecate `WritableStreamDefaultController.abortReason` ([#102](https://github.com/MattiasBuelens/web-streams-polyfill/pull/102))
  * Use `WritableStreamDefaultController.signal.reason` instead.
* 👓 Align with [spec version `4b6b93c`](https://github.com/whatwg/streams/tree/4b6b93c69e531e2fe45a6ed4cb1484a7ba4eb8bb/) ([#103](https://github.com/MattiasBuelens/web-streams-polyfill/pull/103))

## v3.1.1 (2021-09-06)

* 🐛 Fix compatibility with TypeScript's DOM types for `ReadableStream` and `TransformStream` ([#85](https://github.com/MattiasBuelens/web-streams-polyfill/issues/85), [#86](https://github.com/MattiasBuelens/web-streams-polyfill/pull/86))

## v3.1.0 (2021-07-21)

* 🚀 Calling `ReadableStream.tee()` on a readable byte stream now returns two readable byte streams. ([#81](https://github.com/MattiasBuelens/web-streams-polyfill/pull/81))
* 🚀 Add `WritableStreamDefaultController.signal` and `.abortReason`. ([#81](https://github.com/MattiasBuelens/web-streams-polyfill/pull/81))
  * `.signal` requires a global `AbortController` constructor to be available. If necessary, use a polyfill.
* 🐛 Make sure streams created with a different version of the polyfill do not pass the brand checks. ([#75](https://github.com/MattiasBuelens/web-streams-polyfill/issues/75), [#77](https://github.com/MattiasBuelens/web-streams-polyfill/pull/77))
* 👓 Align with [spec version `cada812`](https://github.com/whatwg/streams/tree/cada8129edcc4803b2878a7a3f5e1d8325dc0c23/) ([#79](https://github.com/MattiasBuelens/web-streams-polyfill/pull/79), [#81](https://github.com/MattiasBuelens/web-streams-polyfill/pull/81))

## v3.0.3 (2021-04-09)

* 💅 Change `Promise<void>` to `Promise<undefined>` in TypeScript type definitions ([#72](https://github.com/MattiasBuelens/web-streams-polyfill/pull/72))
* 🐛 Fix `ReadableStream.tee()` resolving its `cancel()` promise too early ([#73](https://github.com/MattiasBuelens/web-streams-polyfill/pull/73))
* 👓 Align with [spec version `6762cdb`](https://github.com/whatwg/streams/tree/6762cdb4c6421cfa0da1d834d5a14fdd7326aaa5/) ([#73](https://github.com/MattiasBuelens/web-streams-polyfill/pull/73))

## v3.0.2 (2021-02-10)

* 👓 Align with [spec version `200c971`](https://github.com/whatwg/streams/tree/200c971563b1a695fce3eebe6dab45c348ff0ac0/) ([#69](https://github.com/MattiasBuelens/web-streams-polyfill/pull/69))

## v3.0.1 (2020-11-12)

* 📝 Add documentation to type definitions ([#62](https://github.com/MattiasBuelens/web-streams-polyfill/pull/62))
* 👓 Align with [spec version `6cd5e81`](https://github.com/whatwg/streams/tree/6cd5e81f6191fed9e7d99ee73d4941e3060311ce/) ([#63](https://github.com/MattiasBuelens/web-streams-polyfill/pull/63))
* 🐛 Fix an issue where the polyfill could throw an error when resolving/rejecting `reader.closed` when it was already resolved/rejected ([#66](https://github.com/MattiasBuelens/web-streams-polyfill/issues/66), [#67](https://github.com/MattiasBuelens/web-streams-polyfill/pull/67))

## v3.0.0 (2020-07-20)

* 💥 Align with [spec version `62fe4c8`](https://github.com/whatwg/streams/tree/62fe4c8c0df34cec4ff28db9bfa69aec6c65e38d/) ([#52](https://github.com/MattiasBuelens/web-streams-polyfill/pull/52), [#57](https://github.com/MattiasBuelens/web-streams-polyfill/pull/57), [#59](https://github.com/MattiasBuelens/web-streams-polyfill/pull/59))  
  This includes the following **breaking changes**:
  * All classes are now exposed globally. Concretely, this adds the following classes:
    * `ReadableStreamDefaultController`
    * `ReadableByteStreamController`
    * `ReadableStreamBYOBRequest`
    * `ReadableStreamDefaultReader`
    * `ReadableStreamBYOBReader`
    * `WritableStreamDefaultController`
    * `WritableStreamDefaultWriter`
    * `TransformStreamDefaultController`
  * `ReadableStream.getIterator()` is renamed to `ReadableStream.values()`
  * `ReadableByteStreamController.byobRequest` can be `null` (instead of `undefined`) if there is no current BYOB request.
  * `ReadableStreamBYOBRequest.view` can be `null` (instead of `undefined`) if the BYOB request has already been responded to.
  * Constructors and methods have stricter type checking for object arguments. For example, `new ReadableStream(null)` would previously behave like `new ReadableStream({})`, but now it throws a `TypeError` instead.
  * Some constructors and methods may throw slightly different errors when given invalid arguments.
  * Various byte-stream-related APIs now prohibit zero-length views or buffers.
  * The async iterator of a `ReadableStream` now behaves more like an async generator, e.g. returning promises fulfilled with `{ value: undefined, done: true }` after `return()`ing the iterator, instead of returning a rejected promise.
* 💥 Updated TypeScript types to align with new specification ([#60](https://github.com/MattiasBuelens/web-streams-polyfill/pull/60))  
  While these are _technically_ breaking changes, you should only be affected if you manually reference these types from your code.
  * `PipeOptions` is renamed to `StreamPipeOptions`
  * `ReadResult` is replaced by `ReadableStreamDefaultReadResult` and `ReadableStreamBYOBReadResult`
  * `ReadableStreamDefaultControllerCallback` is replaced by `UnderlyingSourceStartCallback` and `UnderlyingSourcePullCallback`
  * `ReadableByteStreamControllerCallback` is replaced by `UnderlyingByteSourceStartCallback` and `UnderlyingByteSourcePullCallback`
  * `ReadableStreamErrorCallback` is renamed to `UnderlyingSourceCancelCallback`
  * `WritableStreamDefaultControllerStartCallback` is renamed to `UnderlyingSinkStartCallback`
  * `WritableStreamDefaultControllerWriteCallback` is renamed to `UnderlyingSinkWriteCallback`
  * `WritableStreamDefaultControllerCloseCallback` is renamed to `UnderlyingSinkCloseCallback`
  * `WritableStreamErrorCallback` is renamed to `UnderlyingSinkAbortCallback`
  * `TransformStreamDefaultControllerCallback` is replaced by `TransformerStartCallback` and `TransformerFlushCallback`
  * `TransformStreamDefaultControllerTransformCallback` is renamed to `TransformerTransformCallback`

## v2.1.1 (2020-04-11)

* 💅 Improve `ReadResult` in TypeScript type definitions. ([759506e](https://github.com/MattiasBuelens/web-streams-polyfill/commit/759506e00e55289ae6f92f30922b8855fcddd9ab), [#49](https://github.com/MattiasBuelens/web-streams-polyfill/pull/49))

## v2.1.0 (2020-02-23)

* 👓 Align with [spec version `ed00d2f`](https://github.com/whatwg/streams/tree/ed00d2fe2d53ac5ad9ff8e727c7ef0a68f424074/) ([#43](https://github.com/MattiasBuelens/web-streams-polyfill/issues/43), [#44](https://github.com/MattiasBuelens/web-streams-polyfill/pull/44))
* 🏠 Down-level type definitions for older TypeScript versions. ([#41](https://github.com/MattiasBuelens/web-streams-polyfill/pull/41))

## v2.0.6 (2019-11-08)

* 🐛 Fix type definitions to be compatible with TypeScript 3.3 and lower. ([#39](https://github.com/MattiasBuelens/web-streams-polyfill/issues/39), [#40](https://github.com/MattiasBuelens/web-streams-polyfill/pull/40))

## v2.0.5 (2019-10-08)

* 👓 Align with [spec version `ae5e0cb`](https://github.com/whatwg/streams/tree/ae5e0cb41e9f72cdd97f3a6d47bc674c1f4049d1/) ([#33](https://github.com/MattiasBuelens/web-streams-polyfill/pull/33))
* 🐛 Fix support for non-browser environments, such as Node.
  * Accept polyfilled `AbortSignal`s. ([#36](https://github.com/MattiasBuelens/web-streams-polyfill/pull/36))
  * Polyfill `DOMException` if necessary. ([#37](https://github.com/MattiasBuelens/web-streams-polyfill/pull/37))

## v2.0.4 (2019-08-01)

* 🐛 Fix pipe not aborting when both `preventAbort` and `preventCancel` are set ([#31](https://github.com/MattiasBuelens/web-streams-polyfill/pull/31))
* 👓 Align with [spec version `e4d3b1a`](https://github.com/whatwg/streams/tree/e4d3b1a826e34d27a7cb5485a1cc4b078608c9ec/) ([#31](https://github.com/MattiasBuelens/web-streams-polyfill/pull/31))

## v2.0.3 (2019-04-04)

* 👓 Align with [spec version `6f94580`](https://github.com/whatwg/streams/tree/6f94580f6731d1e017c516af097d47c45aad1f56/) ([#21](https://github.com/MattiasBuelens/web-streams-polyfill/pull/21))
* 🏠 Run web platform tests on ES5 variant ([#19](https://github.com/MattiasBuelens/web-streams-polyfill/pull/19))

## v2.0.2 (2019-03-17)

* 💅 Improve performance of `reader.read()` and `writer.write()` ([#17](https://github.com/MattiasBuelens/web-streams-polyfill/pull/17), [#18](https://github.com/MattiasBuelens/web-streams-polyfill/pull/18))

## v2.0.1 (2019-03-16)

* 🐛 Fix performance issue with large queues ([#15](https://github.com/MattiasBuelens/web-streams-polyfill/pull/15), [#16](https://github.com/MattiasBuelens/web-streams-polyfill/pull/16))

## v2.0.0 (2019-03-10)

* 💥 Ownership change: [@mattiasbuelens/web-streams-polyfill](https://www.npmjs.com/package/@mattiasbuelens/web-streams-polyfill/v/0.3.2) has been republished as [web-streams-polyfill](https://www.npmjs.com/package/web-streams-polyfill).
  For the full list of changes between web-streams-polyfill v1.3.2 and this version, [visit the fork's changelog](https://github.com/MattiasBuelens/web-streams-polyfill/blob/v0.3.2/CHANGELOG.md).

* 💥 CommonJS entry points have been moved to `dist/`:
  * `index.js` ➡ `dist/polyfill.js`
  * `index.es6.js` ➡ `dist/polyfill.es6.js`

  However, we recommend migrating to a [variant sub-package](https://github.com/MattiasBuelens/web-streams-polyfill#usage) instead:
  * `require('web-streams-polyfill/index.js')` ➡ `require('web-streams-polyfill')`
  * `require('web-streams-polyfill/index.es6.js')` ➡ `require('web-streams-polyfill/es6')`

* 👓 Align with [spec version `2c8f35e`](https://github.com/whatwg/streams/tree/2c8f35ed23451ffc9b32ec37b56def4a5349abb1/)

* 🏠 Code moved from [creatorrr/web-streams-polyfill](https://github.com/creatorrr/web-streams-polyfill) to [MattiasBuelens/web-streams-polyfill](https://github.com/MattiasBuelens/web-streams-polyfill)
