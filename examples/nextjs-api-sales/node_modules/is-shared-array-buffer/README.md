# is-shared-array-buffer <sup>[![Version Badge][2]][1]</sup>

[![dependency status][5]][6]
[![dev dependency status][7]][8]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][11]][1]

Is this value a JS SharedArrayBuffer? This module works cross-realm/iframe, does not depend on `instanceof` or mutable properties, and despite ES6 Symbol.toStringTag.

## Example

```js
var assert = require('assert');
var isSharedArrayBuffer = require('is-shared-array-buffer');

assert(!isSharedArrayBuffer(function () {}));
assert(!isSharedArrayBuffer(null));
assert(!isSharedArrayBuffer(function* () { yield 42; return Infinity; });
assert(!isSharedArrayBuffer(Symbol('foo')));
assert(!isSharedArrayBuffer(1n));
assert(!isSharedArrayBuffer(Object(1n)));

assert(!isSharedArrayBuffer(new Set()));
assert(!isSharedArrayBuffer(new WeakSet()));
assert(!isSharedArrayBuffer(new Map()));
assert(!isSharedArrayBuffer(new WeakMap()));
assert(!isSharedArrayBuffer(new WeakRef({})));
assert(!isSharedArrayBuffer(new FinalizationRegistry(() => {})));
assert(!isSharedArrayBuffer(new ArrayBuffer()));

assert(isSharedArrayBuffer(new SharedArrayBuffer()));

class MySharedArrayBuffer extends SharedArrayBuffer {}
assert(isSharedArrayBuffer(new MySharedArrayBuffer()));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[1]: https://npmjs.org/package/is-shared-array-buffer
[2]: https://versionbadg.es/inspect-js/is-shared-array-buffer.svg
[5]: https://david-dm.org/inspect-js/is-shared-array-buffer.svg
[6]: https://david-dm.org/inspect-js/is-shared-array-buffer
[7]: https://david-dm.org/inspect-js/is-shared-array-buffer/dev-status.svg
[8]: https://david-dm.org/inspect-js/is-shared-array-buffer#info=devDependencies
[11]: https://nodei.co/npm/is-shared-array-buffer.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/is-shared-array-buffer.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/is-shared-array-buffer.svg
[downloads-url]: https://npm-stat.com/charts.html?package=is-shared-array-buffer
