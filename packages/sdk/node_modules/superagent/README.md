# superagent

[![build status](https://img.shields.io/travis/visionmedia/superagent.svg)](https://travis-ci.org/visionmedia/superagent)
[![code coverage](https://img.shields.io/codecov/c/github/visionmedia/superagent.svg)](https://codecov.io/gh/visionmedia/superagent)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/visionmedia/superagent.svg)](LICENSE)

> Small progressive client-side HTTP request library, and Node.js module with the same API, supporting many high-level HTTP client features


## Table of Contents

* [Install](#install)
* [Usage](#usage)
  * [Node](#node)
  * [Browser](#browser)
* [Supported Platforms](#supported-platforms)
  * [Required Browser Features](#required-browser-features)
* [Plugins](#plugins)
* [Upgrading from previous versions](#upgrading-from-previous-versions)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install superagent
```

[yarn][]:

```sh
yarn add superagent
```


## Usage

### Node

```js
const superagent = require('superagent');

// callback
superagent
  .post('/api/pet')
  .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
  .set('X-API-Key', 'foobar')
  .set('accept', 'json')
  .end((err, res) => {
    // Calling the end function will send the request
  });

// promise with then/catch
superagent.post('/api/pet').then(console.log).catch(console.error);

// promise with async/await
(async () => {
  try {
    const res = await superagent.post('/api/pet');
    console.log(res);
  } catch (err) {
    console.error(err);
  }
})();
```

### Browser

**The browser-ready, minified version of `superagent` is only 6 KB (minified and gzipped)!**

Browser-ready versions of this module are available via [jsdelivr][], [unpkg][], and also in the `node_modules/superagent/dist` folder in downloads of the `superagent` package.

> Note that we also provide unminified versions with `.js` instead of `.min.js` file extensions.

#### VanillaJS

This is the solution for you if you're just using `<script>` tags everywhere!

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=Array.from,Promise,Symbol,Object.setPrototypeOf,Object.getOwnPropertySymbols"></script>
<script src="https://cdn.jsdelivr.net/npm/superagent"></script>
<!-- if you wish to use unpkg.com instead: -->
<!-- <script src="https://unpkg.com/superagent"></script> -->
<script type="text/javascript">
  (function() {
    // superagent is exposed as `window.superagent`
    // if you wish to use "request" instead please
    // uncomment the following line of code:
    // `window.request = superagent;`
    superagent
      .post('/api/pet')
      .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
      .set('X-API-Key', 'foobar')
      .set('accept', 'json')
      .end(function (err, res) {
        // Calling the end function will send the request
      });
  })();
</script>
```

#### Bundler

If you are using [browserify][], [webpack][], [rollup][], or another bundler, then you can follow the same usage as [Node](#node) above.


## Supported Platforms

* Node: v6.x+
* Browsers (see [.browserslistrc](.browserslistrc)):

  ```sh
  npx browserslist
  ```

  ```sh
  and_chr 71
  and_ff 64
  and_qq 1.2
  and_uc 11.8
  android 67
  android 4.4.3-4.4.4
  baidu 7.12
  bb 10
  bb 7
  chrome 73
  chrome 72
  chrome 71
  edge 18
  edge 17
  firefox 66
  firefox 65
  ie 11
  ie 10
  ie 9
  ie_mob 11
  ie_mob 10
  ios_saf 12.0-12.1
  ios_saf 11.3-11.4
  op_mini all
  op_mob 46
  op_mob 12.1
  opera 58
  opera 57
  safari 12
  safari 11.1
  samsung 8.2
  samsung 7.2-7.4
  ```

### Required Browser Features

We recommend using <https://polyfill.io> (specifically with the bundle mentioned in [VanillaJS](#vanillajs) above):

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=Array.from,Promise,Symbol,Object.setPrototypeOf,Object.getOwnPropertySymbols"></script>
```

* IE 9-10 requires a polyfill for `Promise`, `Array.from`, `Symbol`, `Object.getOwnPropertySymbols`, and `Object.setPrototypeOf`
* IE 9 requires a polyfill for `window.FormData` (we recommend [formdata-polyfill][])


## Plugins

SuperAgent is easily extended via plugins.

```js
const nocache = require('superagent-no-cache');
const superagent = require('superagent');
const prefix = require('superagent-prefix')('/static');

superagent
  .get('/some-url')
  .query({ action: 'edit', city: 'London' }) // query string
  .use(prefix) // Prefixes *only* this request
  .use(nocache) // Prevents caching of *only* this request
  .end((err, res) => {
    // Do something
  });
```

Existing plugins:

* [superagent-no-cache](https://github.com/johntron/superagent-no-cache) - prevents caching by including Cache-Control header
* [superagent-prefix](https://github.com/johntron/superagent-prefix) - prefixes absolute URLs (useful in test environment)
* [superagent-suffix](https://github.com/timneutkens1/superagent-suffix) - suffix URLs with a given path
* [superagent-mock](https://github.com/M6Web/superagent-mock) - simulate HTTP calls by returning data fixtures based on the requested URL
* [superagent-mocker](https://github.com/shuvalov-anton/superagent-mocker) — simulate REST API
* [superagent-cache](https://github.com/jpodwys/superagent-cache) - A global SuperAgent patch with built-in, flexible caching
* [superagent-cache-plugin](https://github.com/jpodwys/superagent-cache-plugin) - A SuperAgent plugin with built-in, flexible caching
* [superagent-jsonapify](https://github.com/alex94puchades/superagent-jsonapify) - A lightweight [json-api](http://jsonapi.org/format/) client addon for superagent
* [superagent-serializer](https://github.com/zzarcon/superagent-serializer) - Converts server payload into different cases
* [superagent-httpbackend](https://www.npmjs.com/package/superagent-httpbackend) - stub out requests using AngularJS' $httpBackend syntax
* [superagent-throttle](https://github.com/leviwheatcroft/superagent-throttle) - queues and intelligently throttles requests
* [superagent-charset](https://github.com/magicdawn/superagent-charset) - add charset support for node's SuperAgent
* [superagent-verbose-errors](https://github.com/jcoreio/superagent-verbose-errors) - include response body in error messages for failed requests
* [superagent-declare](https://github.com/damoclark/superagent-declare) - A simple [declarative](https://en.wikipedia.org/wiki/Declarative_programming) API for SuperAgent
* [superagent-node-http-timings](https://github.com/webuniverseio/superagent-node-http-timings) - measure http timings in node.js

Please prefix your plugin with `superagent-*` so that it can easily be found by others.

For SuperAgent extensions such as couchdb and oauth visit the [wiki](https://github.com/visionmedia/superagent/wiki).


## Upgrading from previous versions

Our breaking changes are mostly in rarely used functionality and from stricter error handling.

* [4.x to 5.x](https://github.com/visionmedia/superagent/releases/tag/v5.0.0):
  * We've implemented the build setup of [Lass](https://lass.js.org) to simplify our stack and linting
  * Unminified browserified build size has been reduced from 48KB to 20KB (via `tinyify` and the latest version of Babel using `@babel/preset-env` and `.browserslistrc`)
  * Linting support has been added using `caniuse-lite` and `eslint-plugin-compat`
  * We can now target what versions of Node we wish to support more easily using `.babelrc`
* [3.x to 4.x](https://github.com/visionmedia/superagent/releases/tag/v4.0.0-alpha.1):
  * Ensure you're running Node 6 or later. We've dropped support for Node 4.
  * We've started using ES6 and for compatibility with Internet Explorer you may need to use Babel.
  * We suggest migrating from `.end()` callbacks to `.then()` or `await`.
* [2.x to 3.x](https://github.com/visionmedia/superagent/releases/tag/v3.0.0):
  * Ensure you're running Node 4 or later. We've dropped support for Node 0.x.
  * Test code that calls `.send()` multiple times. Invalid calls to `.send()` will now throw instead of sending garbage.
* [1.x to 2.x](https://github.com/visionmedia/superagent/releases/tag/v2.0.0):
  * If you use `.parse()` in the _browser_ version, rename it to `.serialize()`.
  * If you rely on `undefined` in query-string values being sent literally as the text "undefined", switch to checking for missing value instead. `?key=undefined` is now `?key` (without a value).
  * If you use `.then()` in Internet Explorer, ensure that you have a polyfill that adds a global `Promise` object.
* 0.x to 1.x:
  * Instead of 1-argument callback `.end(function(res){})` use `.then(res => {})`.


## Contributors

| Name                |
| ------------------- |
| **Kornel Lesiński** |
| **Peter Lyons**     |
| **Hunter Loftis**   |
| **Nick Baugh**      |


## License

[MIT](LICENSE) © TJ Holowaychuk


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[formdata-polyfill]: https://www.npmjs.com/package/formdata-polyfill

[jsdelivr]: https://www.jsdelivr.com/

[unpkg]: https://unpkg.com/

[browserify]: https://github.com/browserify/browserify

[webpack]: https://github.com/webpack/webpack

[rollup]: https://github.com/rollup/rollup
