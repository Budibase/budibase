# lie
<a href="http://promises-aplus.github.com/promises-spec">
  <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
       alt="Promises/A+ logo" title="Promises/A+ 1.1 compliant" align="right" />
</a> [![Build Status](https://travis-ci.org/calvinmetcalf/lie.svg)](https://travis-ci.org/calvinmetcalf/lie)

lie a small, performant, promise library implementing the [Promises/A+ spec Version 1.1](http://promises-aplus.github.com/promises-spec/).

A originally a fork of [Ruben Verborgh's](https://github.com/RubenVerborgh) library called [promiscuous](https://github.com/RubenVerborgh/promiscuous), version 2.6 and above are forked from [ayepromise](https://github.com/cburgmer/ayepromise) by [Chris Burgmer](https://github.com/cburgmer).

```bash
npm install lie

```

```javascript
var Promise = require('lie');
// or use the pollyfill
require('lie/polyfill');
```

## Usage

Either use it with [browserify](http://browserify.org/) (recommended) or grab one of the files from the dist folder

- lie.js/lie.min.js makes 'Promise' available in global scope (or since it's a UMD `Promise` will be available through a CJS or AMD loader if it's available instead)
- lie.polyfill.js/lie.polyfill.min.js adds 'Promise' to the global scope only if it's not already defined (not a UMD).

## API

Implements the standard ES6 api,

```js
new Promise(function(resolve, reject){
    doSomething(function(err, result) {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
}).then(function (value) {
    //on success
}, function (reason) {
    //on error
}).catch(function (reason) {
    //shortcut for error handling
});

Promise.all([
    //array of promises or values
]).then(function ([/* array of results */]));

Promise.race([
    //array of promises or values
]);
// either resolves or rejects depending on the first value to do so
```

## Unhandled Rejections

In node lie emits `unhandledRejection` events when promises are not handled in
line with how [iojs does so](https://iojs.org/api/process.html#process_event_unhandledrejection)
meaning it can act as promise shim in node as well as the browser.
