# ioredis-mock &middot; [![npm](https://img.shields.io/npm/dm/ioredis-mock.svg?style=flat-square)](https://npm-stat.com/charts.html?package=ioredis-mock) [![npm version](https://img.shields.io/npm/v/ioredis-mock.svg?style=flat-square)](https://www.npmjs.com/package/ioredis-mock) [![Redis Compatibility: 29%](https://img.shields.io/badge/redis-29%25-orange.svg?style=flat-square)](compat.md) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

This library emulates [ioredis](https://github.com/luin/ioredis) by performing
all operations in-memory. The best way to do integration testing against redis
and ioredis is on a real redis-server instance. However, there are cases where
mocking the redis-server is a better option.

Cases like:

- Your workflow already use a local redis-server instance for the dev server.
- You're on a platform
  [without an official redis release](https://github.com/MSOpenTech/redis),
  that's even worse than using an emulator.
- You're running tests on a CI, setting it up is complicated. If you combine it
  with CI that also run selenium acceptance testing it's even more complicated,
  as two redis-server instances on the same CI build is hard.
- The GitHub repo have bots that run the testing suite and is limited through
  npm package.json install scripts and can't fire up servers. (Having
  [Greenkeeper](https://greenkeeper.io/) notifying you when a new release of
  ioredis is out and wether your code breaks or not is awesome).

Check the [compatibility table](compat.md) for supported redis commands.

## Usage ([try it in your browser](https://runkit.com/npm/ioredis-mock))

```js
var Redis = require('ioredis-mock');
var redis = new Redis({
  // `options.data` does not exist in `ioredis`, only `ioredis-mock`
  data: {
    user_next: '3',
    emails: {
      'clark@daily.planet': '1',
      'bruce@wayne.enterprises': '2',
    },
    'user:1': { id: '1', username: 'superman', email: 'clark@daily.planet' },
    'user:2': { id: '2', username: 'batman', email: 'bruce@wayne.enterprises' },
  },
});
// Basically use it just like ioredis
```

### Configuring Jest

Use the jest specific bundle when setting up mocks:

```js
jest.mock('ioredis', () => require('ioredis-mock/jest'));
```

The `ioredis-mock/jest` bundle inlines imports from `ioredis` that `ioredis-mock` rely on. Thus you can map `ioredis` import identifiers to `ioredis-mock/jest` [without dealing with circular issues](https://github.com/stipsan/ioredis-mock/issues/568).

### Pub/Sub channels

We also support redis publish/subscribe channels (just like ioredis).
Like ioredis, you need two clients:

- the pubSub client for subcriptions and events, [which can only be used for subscriptions](https://redis.io/topics/pubsub)
- the usual client for issuing 'synchronous' commands like get, publish, etc

```js
var Redis = require('ioredis-mock');
var redisPubSub = new Redis();
// create a second Redis Mock (connected to redisPubSub)
var redisSync = redisPubSub.createConnectedClient();
redisPubSub.on('message', (channel, message) => {
  expect(channel).toBe('emails');
  expect(message).toBe('clark@daily.planet');
  done();
});
redisPubSub.subscribe('emails');
redisSync.publish('emails', 'clark@daily.planet');
```

### Promises

By default, ioredis-mock uses the native Promise library. If you need (or prefer) [bluebird](http://bluebirdjs.com/) promises, set `Redis.Promise`:

```js
var Promise = require('bluebird');
var Redis = require('ioredis-mock');

Redis.Promise = Promise;
```

### Lua scripting

You can use the `defineCommand` to define custom commands using lua or `eval` to directly execute lua code.

In order to create custom commands, using [lua](http://lua.org) scripting, [ioredis exposes the defineCommand method](https://github.com/luin/ioredis#lua-scripting).

You could define a custom command `MULTIPLY` which accepts one
key and one argument. A redis key, where you can get the multiplicand, and an argument which will be the multiplicator:

```js
var Redis = require('ioredis-mock');
const redis = new Redis({ data: { 'k1': 5 } });
const commandDefinition: { numberOfKeys: 1, lua: 'return KEYS[1] * ARGV[1]' };
redis.defineCommand('MULTIPLY', commandDefinition) // defineCommand(name, definition)
  // now we can call our brand new multiply command as an ordinary command
  .then(() => redis.multiply('k1', 10));
  .then(result => {
    expect(result).toBe(5 * 10);
  })
```

You can also achieve the same effect by using the `eval` command:

```js
var Redis = require('ioredis-mock');
const redis = new Redis({ data: { k1: 5 } });
const result = redis.eval(`return redis.call("GET", "k1") * 10`);
expect(result).toBe(5 * 10);
```

note we are calling the ordinary redis `GET` command by using the global `redis` object's `call` method.

As a difference from ioredis we currently don't support:

- dynamic key number by passing the number of keys as the first argument of the command.
- automatic definition of the custom command buffer companion (i.e. for the custom command `multiply` the `multiplyBuffer` which returns values using `Buffer.from(...)`)
- the `evalsha` command
- the `script` command

### Cluster(Experimental)

Work on Cluster support has started, the current implementation is minimal and PRs welcome #359

```js
var Redis = require('ioredis-mock');

const cluster = new Redis.Cluster(['redis://localhost:7001']);
const nodes = cluster.nodes;
expect(nodes.length).toEqual(1);
```

## Roadmap

This project started off as just an utility in
[another project](https://github.com/stipsan/epic) and got open sourced to
benefit the rest of the ioredis community. This means there's work to do before
it's feature complete:

- [x] Setup testing suite for the library itself.
- [x] Refactor to bluebird promises like ioredis, support node style callback
      too.
- [x] Implement remaining basic features that read/write data.
- [x] Implement ioredis
      [argument and reply transformers](https://github.com/luin/ioredis#transforming-arguments--replies).
- [ ] Connection Events
- [ ] Offline Queue
- [x] Pub/Sub
- [ ] Error Handling
- [ ] Implement [remaining](compat.md) commands

## I need a feature not listed here

Just create an issue and tell us all about it or submit a PR with it! 😄
