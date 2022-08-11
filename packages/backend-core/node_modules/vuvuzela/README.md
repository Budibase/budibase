vuvuzela [![Build Status](https://travis-ci.org/nolanlawson/vuvuzela.svg)](https://travis-ci.org/nolanlawson/vuvuzela)
=========

Simple and non-recursive JSON parse/stringify library.

Goals
-----

- **No recursion**
  - Avoids the "too much recursion" or "maximum call stack" errors that the native `JSON.parse` and `JSON.stringify`  methods may throw if an object is deeply nested.
- **Simplicity**
  - No functions-within-functions, just a `while` loop and a stack.
- **Small footprint**
  - ~1 KB minified and gzipped

Description
-----

[![vuvuzela, courtesy of Berndt Meyer via the Wikipedia page](vuvuzela.jpg)](https://en.wikipedia.org/wiki/Vuvuzela)

The vuvuzela is a coarse instrument, but it's lightweight, and it gets the job done.

This module will use up tons of memory, but unlike the native `JSON` methods or [json3](https://github.com/bestiejs/json3), it'll never throw a "maximum call stack size exceeded" exception. Your JSON objects can be as deeply nested as you like.

This is not a streaming library, so unlike [oboe](https://github.com/jimhigson/oboe.js)/[clarinet](https://github.com/dscape/clarinet), it reads the whole thing into memory at once. It's also [quite a bit slower than the native JSON methods](http://jsperf.com/vuvuzela-vs-json). Use at your own risk!

Usage
------

    $ npm install vuvuzela

```js
var vuvuzela = require('vuvuzela')

var asString = vuvuzela.stringify({hello: 'world'}); // '{"hello":"world"}'

var asJson = vuvuzela.parse('{"hello": "world"}'); // {hello: 'world'}

```

Browser builds are available in the `dist/` folder. They'll create a `window.vuvuzela` object you can use.

Limitations
---------

At the top level, it will currently only parse objects and arrays, not arbitrary values like booleans, strings, numbers, and `null`.

Testing
------

Unit tests:

    $ npm test
    
Coverage tests:

    $ npm run coverage
    
Building
-------

    $ npm run build
