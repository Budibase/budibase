# timekeeper
[![travis][travis-image]][travis-url]
[![npm][npm-image]][npm-url]

[travis-image]: https://travis-ci.org/vesln/timekeeper.svg?branch=master
[travis-url]: https://travis-ci.org/vesln/timekeeper

[npm-image]: https://img.shields.io/npm/v/timekeeper.svg?style=flat
[npm-url]: https://npmjs.org/package/timekeeper

This module mocks `Date` and `Date.now` in order to help you test time-dependent code.
Provides `travel` and `freeze` functionality for your Node.js tests.

## Features/problems

- Please note, that if you are using time freezing, `setTimeout` and
  `setInterval` won't work as expected, since they are using the `Date`
  class, but the time will not change until you call `timekeeper#reset`.

## Installation

- NPM: `npm install timekeeper --save-dev`
- Bower: `bower install timekeeper`

## Synopsis

### Freeze:

```js
var tk = require('timekeeper');
var time = new Date(1330688329321);

tk.freeze(time);

// The time hasn't changed at all.

var date = new Date;
var ms = Date.now();

tk.reset(); // Reset.

```

### Travel:

```js
var tk = require('timekeeper');
var time = new Date(1893448800000); // January 1, 2030 00:00:00

tk.travel(time); // Travel to that date.

setTimeout(function() {

	// `time` + ~500 ms.

	var date = new Date;
	var ms = Date.now();

	tk.reset(); // Reset.

}, 500);
```

Note: If traveling when time is frozen, the time will be frozen to the new traveled time.

### Reflection:

```js
var tk = require('timekeeper');
var time = new Date(1893448800000); // January 1, 2030 00:00:00

assertFalse(tk.isKeepingTime());
tk.travel(time);
assertTrue(tk.isKeepingTime());
```

## Requirements

- npm (http://npmjs.org/)
- Node.js (http://nodejs.org/)

## Tests

```
$ cd timekeeper
$ npm install
$ make test
```

## Releases
For maintainers only. `mversion` is used as a substitute for `npm version` to
simultaneously bump `package.json` and `bower.json`, create a new commit,
and a version tag at the new commit.
```
$ mversion <patch | minor | major>
$ git push --follow-tags
$ npm publish
```

## Credits

Inspired by the [timecop](https://github.com/travisjeffery/timecop) ruby gem.

## License

MIT License

Copyright (C) 2012 Veselin Todorov

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
