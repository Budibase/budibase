# memdown <img alt="LevelDB Logo" height="20" src="http://leveldb.org/img/logo.svg" />

> In-memory `abstract-leveldown` store for Node.js and browsers.

[![Travis](https://secure.travis-ci.org/Level/memdown.png)](http://travis-ci.org/Level/memdown) [![Coverage Status](https://coveralls.io/repos/Level/memdown/badge.svg?branch=master&service=github)](https://coveralls.io/github/Level/memdown?branch=master) [![npm](https://img.shields.io/npm/v/memdown.svg)](https://www.npmjs.com/package/memdown) [![npm](https://img.shields.io/npm/dm/memdown.svg)](https://www.npmjs.com/package/memdown) [![Greenkeeper badge](https://badges.greenkeeper.io/Level/memdown.svg)](https://greenkeeper.io/)

## Example

`levelup` allows you to pass a `db` option to its constructor. This overrides the default `leveldown` store.

```js
// Note that if multiple instances point to the same location,
// the db will be shared, but only per process.
var levelup = require('levelup')
var db = levelup('/some/location', { db: require('memdown') })

db.put('hey', 'you', function (err) {
  if (err) throw err

  db.createReadStream()
    .on('data', function (kv) {
      console.log('%s: %s', kv.key, kv.value)
    })
    .on('end', function () {
      console.log('done')
    })
})
```

Your data is discarded when the process ends or you release a reference to the database. Note as well, though the internals of `memdown` operate synchronously - `levelup` does not.

Running our example gives:

```
hey: you
done
```

Browser support
----

[![Sauce Test Status](https://saucelabs.com/browser-matrix/level-ci.svg)](https://saucelabs.com/u/level-ci)

`memdown` requires a ES5-capable browser. If you're using one that's isn't (e.g. PhantomJS, Android < 4.4, IE < 10) then you will need [es5-shim](https://github.com/es-shims/es5-shim).

Global Store
---

Even though it's in memory, the location parameter does do something. `memdown`
has a global cache, which it uses to save databases by the path string.

So for instance if you create these two instances:

```js
var db1 = levelup('foo', {db: require('memdown')});
var db2 = levelup('foo', {db: require('memdown')});
```

Then they will actually share the same data, because the `'foo'` string is the same.

You may clear this global store using `memdown.clearGlobalStore()`:

```js
require('memdown').clearGlobalStore();
```

By default, it doesn't delete the store but replaces it with a new one, so the open instance of `memdown` will not be affected.

`clearGlobalStore` takes a single parameter, which if truthy clears the store strictly by deleting each individual key:

```js
require('memdown').clearGlobalStore(true); // delete each individual key
```

If you are using `memdown` somewhere else while simultaneously clearing the global store in this way, then it may throw an error or cause unexpected results.

Test
----

In addition to the regular `npm test`, you can test `memdown` in a browser of choice with:

    npm run test-browser-local

To check code coverage:

    npm run coverage

Licence
---

`memdown` is Copyright (c) 2013-2017 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.
