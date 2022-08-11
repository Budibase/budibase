# throat

Throttle the parallelism of an asynchronous, promise returning, function / functions. This has special utility when you set the concurrency to `1`. That way you get a mutually exclusive lock.

[Professionally supported throat is now available](https://tidelift.com/subscription/pkg/npm-throat?utm_source=npm-throat&utm_medium=referral&utm_campaign=readme)

[![Build Status](https://img.shields.io/github/workflow/status/ForbesLindesay/throat/Test/master?style=for-the-badge)](https://github.com/ForbesLindesay/throat/actions?query=workflow%3ATest+branch%3Amaster)
[![Coveralls github branch](https://img.shields.io/coveralls/github/ForbesLindesay/throat/master?color=brightgreen&style=for-the-badge)](https://coveralls.io/github/ForbesLindesay/throat)
[![Rolling Versions](https://img.shields.io/badge/Rolling%20Versions-Enabled-brightgreen?style=for-the-badge)](https://rollingversions.com/ForbesLindesay/throat)
[![NPM version](https://img.shields.io/npm/v/throat?style=for-the-badge)](https://www.npmjs.com/package/throat)

## Installation

    npm install throat

## API

### throat(concurrency)

This returns a function that acts a bit like a lock (exactly as a lock if concurrency is 1).

Example, only 2 of the following functions will execute at any one time:

```js
const throat = require('throat')(2);

const resA = throat(async () => { /* async stuff... */ });
const resB = throat(async () => { /* async stuff... */ });
const resC = throat(async () => { /* async stuff... */ });
const resD = throat(async () => { /* async stuff... */ });
const resE = throat(async () => { /* async stuff... */ });
```

### throat(concurrency, worker)

This returns a function that is an exact copy of `worker` except that it will only execute up to `concurrency` times in parallel before further requests are queued:

```js
const throat = require('throat');

const input = ['fileA.txt', 'fileB.txt', 'fileC.txt', 'fileD.txt'];
const data = Promise.all(
  input.map(throat(2, (fileName) => readFile(fileName)))
);
```

Only 2 files will be read at a time, sometimes limiting parallelism in this way can improve scalability.

## Security contact information

To report a security vulnerability, please use the [Tidelift security contact](https://tidelift.com/security). Tidelift will coordinate the fix and disclosure.

## License

MIT
