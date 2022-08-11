[![npm version](https://badge.fury.io/js/redlock.svg)](https://www.npmjs.com/package/redlock)
[![Build Status](https://travis-ci.org/mike-marcacci/node-redlock.svg)](https://travis-ci.org/mike-marcacci/node-redlock)
[![Coverage Status](https://coveralls.io/repos/mike-marcacci/node-redlock/badge.svg)](https://coveralls.io/r/mike-marcacci/node-redlock)

Redlock
=======
This is a node.js implementation of the [redlock](http://redis.io/topics/distlock) algorithm for distributed redis locks. It provides strong guarantees in both single-redis and multi-redis environments, and provides fault tolerance through use of multiple independent redis instances or clusters.

- [Installation](#installation)
- [Usage (Promise Style)](#usage-promise-style)
- [Usage (Disposer Style)](#usage-disposer-style)
- [Usage (Callback Style)](#usage-callback-style)
- [Locking multiple resources](#locking-multiple-resources)
- [API Docs](#api-docs)

### High-Availability Recommendations
- Use at least 3 independent servers or clusters
- Use an odd number of independent redis ***servers*** for most installations
- Use an odd number of independent redis ***clusters*** for massive installations
- When possible, distribute redis nodes across different physical machines


### Using Cluster/Sentinel

***Please make sure to use a client with built-in cluster support, such as [ioredis](https://github.com/luin/ioredis).***

It is completely possible to use a *single* redis cluster or sentinal configuration by passing one preconfigured client to redlock. While you do gain high availability and vastly increased throughput under this scheme, the failure modes are a bit different, and it becomes theoretically possible that a lock is acquired twice:

Assume you are using eventually-consistent redis replication, and you acquire a lock for a resource. Immediately after acquiring your lock, the redis master for that shard crashes. Redis does its thing and fails over to the slave which hasn't yet synced your lock. If another process attempts to acquire a lock for the same resource, it will succeed!

This is why redlock allows you to specify multiple independent nodes/clusters: by requiring consensus between them, we can safely take out or fail-over a minority of nodes without invalidating active locks.

To learn more about the the algorithm, check out the [redis distlock page](http://redis.io/topics/distlock).


### How do I check if something is locked?
Redlock cannot tell you *with certainty* if a resource is currently locked. For example, if you are on the smaller side of a network partition you will fail to acquire a lock, but you don't know if the lock exists on the other side; all you know is that you can't guarantee exclusivity on yours.

That said, for many tasks it's sufficient to attempt a lock with `retryCount=0`, and treat a failure as the resource being "locked" or (more correctly) "unavailable",

With `retryCount=-1` there will be unlimited retries until the lock is aquired.


Installation
------------
```bash
npm install --save redlock
```

Configuration
-------------
Redlock can use [node redis](https://github.com/mranney/node_redis), [ioredis](https://github.com/luin/ioredis) or any other compatible redis library to keep its client connections.

A redlock object is instantiated with an array of at least one redis client and an optional `options` object. Properties of the Redlock object should NOT be changed after it is first used, as doing so could have unintended consequences for live locks.

```js
var client1 = require('redis').createClient(6379, 'redis1.example.com');
var client2 = require('redis').createClient(6379, 'redis2.example.com');
var client3 = require('redis').createClient(6379, 'redis3.example.com');
var Redlock = require('redlock');

var redlock = new Redlock(
	// you should have one client for each independent redis node
	// or cluster
	[client1, client2, client3],
	{
		// the expected clock drift; for more details
		// see http://redis.io/topics/distlock
		driftFactor: 0.01, // multiplied by lock ttl to determine drift time

		// the max number of times Redlock will attempt
		// to lock a resource before erroring
		retryCount:  10,

		// the time in ms between attempts
		retryDelay:  200, // time in ms

		// the max time in ms randomly added to retries
		// to improve performance under high contention
		// see https://www.awsarchitectureblog.com/2015/03/backoff.html
		retryJitter:  200 // time in ms
	}
);
```


Error Handling
--------------

Because redlock is designed for high availability, it does not care if a minority of redis instances/clusters fail at an operation. If you want to write logs or take another action when a redis client fails, you can listen for the `clientError` event:

```js

// ...

redlock.on('clientError', function(err) {
	console.error('A redis error has occurred:', err);
});

// ...

```


Usage (promise style)
---------------------


### Locking & Unlocking

```js

// the string identifier for the resource you want to lock
var resource = 'locks:account:322456';

// the maximum amount of time you want the resource locked in milliseconds,
// keeping in mind that you can extend the lock up until
// the point when it expires
var ttl = 1000;

redlock.lock(resource, ttl).then(function(lock) {

	// ...do something here...

	// unlock your resource when you are done
	return lock.unlock()
	.catch(function(err) {
		// we weren't able to reach redis; your lock will eventually
		// expire, but you probably want to log this error
		console.error(err);
	});
});

```


### Locking and Extending

```js
redlock.lock('locks:account:322456', 1000).then(function(lock) {

	// ...do something here...

	// if you need more time, you can continue to extend
	// the lock as long as you never let it expire

	// this will extend the lock so that it expires
	// approximitely 1s from when `extend` is called
	return lock.extend(1000).then(function(lock){

		// ...do something here...

		// unlock your resource when you are done
		return lock.unlock()
		.catch(function(err) {
			// we weren't able to reach redis; your lock will eventually
			// expire, but you probably want to log this error
			console.error(err);
		});
	});
});

```


Usage (disposer style)
----------------------


### Locking & Unlocking

```js
var using = require('bluebird').using;

// the string identifier for the resource you want to lock
var resource = 'locks:account:322456';

// the maximum amount of time you want the resource locked,
// keeping in mind that you can extend the lock up until
// the point when it expires
var ttl = 1000;

// if we weren't able to reach redis, your lock will eventually
// expire, but you probably want to do something like log that
// an error occurred; if you don't pass a handler, this error
// will be ignored
function unlockErrorHandler(err) {
	console.error(err);
}

using(redlock.disposer(resource, ttl, unlockErrorHandler), function(lock) {

	// ...do something here...

}); // <-- unlock is automatically handled by bluebird

```


### Locking and Extending

```js
using(redlock.disposer('locks:account:322456', 1000, unlockErrorHandler), function(lock) {

	// ...do something here...

	// if you need more time, you can continue to extend
	// the lock as long as you never let it expire

	// this will extend the lock so that it expires
	// approximitely 1s from when `extend` is called
	return lock.extend(1000).then(function(extended){

		// Note that redlock modifies the original lock,
		// so the vars `lock` and `extended` point to the
		// exact same object

		// ...do something here...

	});
}); // <-- unlock is automatically handled by bluebird

```


Usage (callback style)
----------------------


### Locking & Unlocking

```js

// the string identifier for the resource you want to lock
var resource = 'locks:account:322456';

// the maximum amount of time you want the resource locked,
// keeping in mind that you can extend the lock up until
// the point when it expires
var ttl = 1000;

redlock.lock(resource, ttl, function(err, lock) {

	// we failed to lock the resource
	if(err) {
		// ...
	}

	// we have the lock
	else {


		// ...do something here...


		// unlock your resource when you are done
		lock.unlock(function(err) {
			// we weren't able to reach redis; your lock will eventually
			// expire, but you probably want to log this error
			console.error(err);
		});
	}
});

```


### Locking and Extending

```js
redlock.lock('locks:account:322456', 1000, function(err, lock) {

	// we failed to lock the resource
	if(err) {
		// ...
	}

	// we have the lock
	else {


		// ...do something here...


		// if you need more time, you can continue to extend
		// the lock as long as you never let it expire

		// this will extend the lock so that it expires
		// approximitely 1s from when `extend` is called
		lock.extend(1000, function(err, lock){

			// we failed to extend the lock on the resource
			if(err) {
				// ...
			}


			// ...do something here...


			// unlock your resource when you are done
			lock.unlock();
		}
	}
});

```

## Locking multiple resources
Multiple resources can be locked by providing an `Array` of strings to `Redlock.prototype.lock` call. Internally a single attempt is made to `redis` by evaluating script which executes lock statements. For more details about atomicity of scripts please see [redis reference](https://redis.io/commands/eval#atomicity-of-scripts).

There are however some limitations of which you need to be aware of:
- When requesting a lock it will fail if any of requested resources is already set
- If lock attempt fails for any resource (due to whatever reason) an attempt for removing already set resources is made. However there are no guarantees that it will succeed (`redis` doesn't provide them)
- Releasing lock will fail if any of requested resources is missing
- Extending lock will fail if any of requested resources is missing

Example:
```js
redlock.lock(['locks:account:322456', 'locks:account:322457', 'locks:account:322458'], 1000).then(function(lock) {

	// ...do something here...

	// if you need more time, you can continue to extend
	// the lock as long as you never let it expire

	// this will extend the lock so that it expires
	// approximitely 1s from when `extend` is called
	return lock.extend(1000).then(function(lock){

		// ...do something here...

		// unlock your resource when you are done
		return lock.unlock()
		.catch(function(err) {
			// we weren't able to reach redis; your lock will eventually
			// expire, but you probably want to log this error
			console.error(err);
		});
	});
});
```


API Docs
--------

### `Redlock.prototype.lock(resource, ttl, ?callback) => Promise<Lock>`
- `resource (string or string[])` resource(s) to be locked
- `ttl (number)` time in ms until the lock expires
- `callback (function)` callback returning:
	- `err (Error)`
	- `lock (Lock)`


### `Redlock.prototype.unlock(lock, ?callback) => Promise`
- `lock (Lock)` lock to be released
- `callback (function)` callback returning:
	- `err (Error)`


### `Redlock.prototype.extend(lock, ttl, ?callback) => Promise<Lock>`
- `lock (Lock)` lock to be extended
- `ttl (number)` time in ms to extend the lock's expiration
- `callback (function)` callback returning:
	- `err (Error)`
	- `lock (Lock)`


### `Redlock.prototype.disposer(resource, ttl, ?unlockErrorHandler)`
- `resource (string or string[])` resource(s) to be locked
- `ttl (number)` time in ms to extend the lock's expiration
- `callback (function)` error handler called with:
	- `err (Error)`


### `Redlock.prototype.quit(?callback) => Promise<*[]>`
- `callback (function)` error handler called with:
	- `err (Error)`
	- `*[]` results of calling `.quit()` on each client


### `Lock.prototype.unlock(?callback) => Promise`
- `callback (function)` callback returning:
	- `err (Error)`


### `Lock.prototype.extend(ttl, ?callback) => Promise<Lock>`
- `ttl (number)` time from now in ms to set as the lock's new expiration
- `callback (function)` callback returning:
	- `err (Error)`
	- `lock (Lock)`

