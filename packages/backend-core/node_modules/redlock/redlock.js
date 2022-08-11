'use strict';

const util = require('util');
const crypto = require('crypto');
const Promise = require('bluebird');
const EventEmitter = require('events');

// constants
const lockScript = `
	-- Return 0 if an entry already exists.
	for i, key in ipairs(KEYS) do
		if redis.call("exists", key) == 1 then
			return 0
		end
	end

	-- Create an entry for each provided key.
	for i, key in ipairs(KEYS) do
		redis.call("set", key, ARGV[1], "PX", ARGV[2])
	end

	-- Return the number of entries added.
	return #KEYS
`;

const unlockScript = `
	local count = 0
	for i, key in ipairs(KEYS) do
		-- Only remove entries for *this* lock value.
		if redis.call("get", key) == ARGV[1] then
			redis.pcall("del", key)
			count = count + 1
		end
	end

	-- Return the number of entries removed.
	return count
`;

const extendScript = `
	-- Return 0 if an entry exists with a *different* lock value.
	for i, key in ipairs(KEYS) do
		if redis.call("get", key) ~= ARGV[1] then
			return 0
		end
	end

	-- Update the entry for each provided key.
	for i, key in ipairs(KEYS) do
		redis.call("set", key, ARGV[1], "PX", ARGV[2])
	end

	-- Return the number of entries updated.
	return #KEYS
`;

// defaults
const defaults = {
	driftFactor: 0.01,
	retryCount:  10,
	retryDelay:  200,
	retryJitter: 100
};





// LockError
// ---------
// This error is returned when there is an error locking a resource.
function LockError(message, attempts) {
	Error.call(this);
	Error.captureStackTrace(this, LockError);
	this.name = 'LockError';
	this.message = message || 'Failed to lock the resource.';
	this.attempts = attempts;
}

util.inherits(LockError, Error);






// Lock
// ----
// An object of this type is returned when a resource is successfully locked. It contains
// convenience methods `unlock` and `extend` which perform the associated Redlock method on
// itself.
function Lock(redlock, resource, value, expiration, attempts, attemptsRemaining) {
	this.redlock           = redlock;
	this.resource          = resource;
	this.value             = value;
	this.expiration        = expiration;
	this.attempts          = attempts;
	this.attemptsRemaining = attemptsRemaining;
}

Lock.prototype.unlock = function unlock(callback) {
	return this.redlock.unlock(this, callback);
};

Lock.prototype.extend = function extend(ttl, callback) {
	return this.redlock.extend(this, ttl, callback);
};

// Attach a reference to Lock, which allows the application to use instanceof
// to ensure type.
Redlock.Lock = Lock;


// Redlock
// -------
// A redlock object is instantiated with an array of at least one redis client and an optional
// `options` object. Properties of the Redlock object should NOT be changed after it is first
// used, as doing so could have unintended consequences for live locks.
function Redlock(clients, options) {
	// set default options
	options = options || {};
	this.driftFactor  = typeof options.driftFactor  === 'number' ? options.driftFactor : defaults.driftFactor;
	this.retryCount   = typeof options.retryCount   === 'number' ? options.retryCount  : defaults.retryCount;
	this.retryDelay   = typeof options.retryDelay   === 'number' ? options.retryDelay  : defaults.retryDelay;
	this.retryJitter  = typeof options.retryJitter  === 'number' ? options.retryJitter : defaults.retryJitter;
	this.lockScript   = typeof options.lockScript   === 'function' ? options.lockScript(lockScript) : lockScript;
	this.unlockScript = typeof options.unlockScript === 'function' ? options.unlockScript(unlockScript) : unlockScript;
	this.extendScript = typeof options.extendScript === 'function' ? options.extendScript(extendScript) : extendScript;
	// set the redis servers from additional arguments
	this.servers = clients;
	if(this.servers.length === 0)
		throw new Error('Redlock must be instantiated with at least one redis server.');

	this.scripts = {
		lockScript: { value: this.lockScript, hash: this._hashScript(this.lockScript) },
		unlockScript: { value: this.unlockScript, hash: this._hashScript(this.unlockScript) },
		extendScript: { value: this.extendScript, hash: this._hashScript(this.extendScript) },
	};
}

// Inherit all the EventEmitter methods, like `on`, and `off`
util.inherits(Redlock, EventEmitter);


// Attach a reference to LockError per issue #7, which allows the application to use instanceof
// to destinguish between error types.
Redlock.LockError = LockError;

// quit
// ----
// This method runs `.quit()` on all client connections.

Redlock.prototype.quit = function quit(callback) {

	// quit all clients
	return Promise.map(this.servers, function(client) {
		return client.quit();
	})

	// optionally run callback
	.nodeify(callback);
};


// lock
// ----
// This method locks a resource using the redlock algorithm.
//
// ```js
// redlock.lock(
//   'some-resource',       // the resource to lock
//   2000,                  // ttl in ms
//   function(err, lock) {  // callback function (optional)
//     ...
//   }
// )
// ```
Redlock.prototype.acquire =
Redlock.prototype.lock = function lock(resource, ttl, callback) {
	return this._lock(resource, null, ttl, {}, callback);
};

// lockWithOptions
// ---------------
// This method locks a resource and overwrites some of the options
// ```js
// redlock.lockWithOptions(
//   'some-resource',                    // the resource to lock
//   2000,                               // ttl in ms
//   { retryCount: 1, retryDelay: 100 }, // additional options
//   function(err, lock) {               // callback function (optional)
//     ...
//   }
// )
// ```
Redlock.prototype.acquireWithOptions =
Redlock.prototype.lockWithOptions = function lock(resource, ttl, options, callback) {
	return this._lock(resource, null, ttl, options, callback);
};

// lock
// ----
// This method locks a resource using the redlock algorithm,
// and returns a bluebird disposer.
//
// ```js
// using(
//   redlock.disposer(
//     'some-resource',       // the resource to lock
//     2000                   // ttl in ms
//   ),
//   function(lock) {
//     ...
//   }
// );
// ```
Redlock.prototype.disposer = function disposer(resource, ttl, errorHandler) {
	errorHandler = errorHandler || function(err) {};
	return this._lock(resource, null, ttl, {}).disposer(function(lock){
		return lock.unlock().catch(errorHandler);
	});
};


// unlock
// ------
// This method unlocks the provided lock from all servers still persisting it. It will fail
// with an error if it is unable to release the lock on a quorum of nodes, but will make no
// attempt to restore the lock on nodes that failed to release. It is safe to re-attempt an
// unlock or to ignore the error, as the lock will automatically expire after its timeout.
Redlock.prototype.release =
Redlock.prototype.unlock = function unlock(lock, callback) {
	const self = this;

	// array of locked resources
	const resource = Array.isArray(lock.resource)
		? lock.resource
		: [lock.resource];
	
	// immediately invalidate the lock
	lock.expiration = 0;

	return new Promise(function(resolve, reject) {

		// the number of votes needed for consensus
		const quorum = Math.floor(self.servers.length / 2) + 1;

		// the number of servers which have agreed to release this lock
		let votes = 0;

		// the number of async redis calls still waiting to finish
		let waiting = self.servers.length;

		// release the lock on each server
		self.servers.forEach(function(server){
			return self._executeScript(server, 'unlockScript', [
					resource.length,
					...resource,
					lock.value
			], loop);
		});

		function loop(err, response) {
			if(err) self.emit('clientError', err);

			// - If the response is less than the resource length, than one or
			//   more resources failed to unlock:
			//   - It may have been re-acquired by another process;
			//   - It may hava already been manually released;
			//   - It may have expired;

			if(response === resource.length || response === '' + resource.length)
				votes++;

			if(waiting-- > 1) return;

			// SUCCESS: there is concensus and the lock is released
			if(votes >= quorum)
				return resolve();

			// FAILURE: the lock could not be released
			return reject(new LockError('Unable to fully release the lock on resource "' + lock.resource + '".'));
		}
	})

	// optionally run callback
	.nodeify(callback);
};


// extend
// ------
// This method extends a valid lock by the provided `ttl`.
Redlock.prototype.extend = function extend(lock, ttl, callback) {
	const self = this;

	// the lock has expired
	if(lock.expiration < Date.now())
		return Promise.reject(new LockError('Cannot extend lock on resource "' + lock.resource + '" because the lock has already expired.', 0)).nodeify(callback);

	// extend the lock
	return self._lock(lock.resource, lock.value, ttl, {})

	// modify and return the original lock object
	.then(function(extension){
		lock.value      = extension.value;
		lock.expiration = extension.expiration;
		return lock;
	})

	// optionally run callback
	.nodeify(callback);
};


// _lock
// -----
// This method locks a resource using the redlock algorithm.
//
// ###Creating New Locks:
//
// ```js
// redlock._lock(
//   'some-resource',       // the resource to lock
//   null,                  // no original lock value
//   2000,                  // ttl in ms
//   {},                    // option overrides {retryCount, retryDelay}
//   function(err, lock) {  // callback function (optional)
//     ...
//   }
// )
// ```
//
// ###Extending Existing Locks:
//
// ```js
// redlock._lock(
//   'some-resource',       // the resource to lock
//   'dkkk18g4gy39dx6r',    // the value of the original lock
//   2000,                  // ttl in ms
//   {},                    // option overrides {retryCount, retryDelay}
//   function(err, lock) {  // callback function (optional)
//     ...
//   }
// )
// ```
Redlock.prototype._lock = function _lock(resource, value, ttl, options, callback) {
	const self = this;

	// backwards compatibility with previous method signature: _lock(resource, value, ttl, callback)
	if (typeof options === 'function' && typeof callback === 'undefined') {
		callback = options;
		options = {};
	}

	// array of locked resources
	resource = Array.isArray(resource) ? resource : [resource];

	return new Promise(function(resolve, reject) {
		let request;

		// the number of times we have attempted this lock
		let attempts = 0;

		// create a new lock
		if(value === null) {
			value = self._random();
			request = function(server, loop){
				return self._executeScript(server, 'lockScript', [
						resource.length,
						...resource,
						value,
						ttl
				], loop);
			};
		}

		// extend an existing lock
		else {
			request = function(server, loop){
				return self._executeScript(server, 'extendScript', [
						resource.length,
						...resource,
						value,
						ttl
				], loop);
			};
		}

		function attempt(){
			attempts++;

			let retryCount = options.retryCount || self.retryCount;
			let retryDelay = options.retryDelay || self.retryDelay;

			// the time when this attempt started
			const start = Date.now();

			// the number of votes needed for consensus
			const quorum = Math.floor(self.servers.length / 2) + 1;

			// the number of servers which have agreed to this lock
			let votes = 0;

			// the number of async redis calls still waiting to finish
			let waiting = self.servers.length;

			function loop(err, response) {
				if(err) self.emit('clientError', err);
				if(response === resource.length || response === '' + resource.length) votes++;
				if(waiting-- > 1) return;
				
				// Add 2 milliseconds to the drift to account for Redis expires precision, which is 1 ms,
				// plus the configured allowable drift factor
				const drift = Math.round(self.driftFactor * ttl) + 2;
				const lock = new Lock(self, resource, value, start + ttl - drift, attempts, retryCount - attempts);
				
				// SUCCESS: there is concensus and the lock is not expired
				if(votes >= quorum && lock.expiration > Date.now())
					return resolve(lock);


				// remove this lock from servers that voted for it
				return lock.unlock(function(){

					// RETRY
					if(retryCount === -1 || attempts <= retryCount)
						return setTimeout(attempt, Math.max(0, retryDelay + Math.floor((Math.random() * 2 - 1) * self.retryJitter)));

					// FAILED
					return reject(new LockError('Exceeded ' + retryCount + ' attempts to lock the resource "' + resource + '".', attempts));
				});
			}

			return self.servers.forEach(function(server){
				return request(server, loop);
			});
		}

		return attempt();
	})

	// optionally run callback
	.nodeify(callback);
};


Redlock.prototype._random = function _random(){
	return crypto.randomBytes(16).toString('hex');
};

Redlock.prototype._executeScript = function(server, name, args, callback) {
	const script = this.scripts[name];

	return server.evalsha(script.hash, args, (err, result) => {
		if(err !== null && err.message.startsWith("NOSCRIPT")) {
			// Script is not loaded yet, call eval and it will populate it in redis lua scripts cache
			args.unshift(script.value);
			return server.eval(args, callback);
		}

		return callback(err, result);
	});
}

Redlock.prototype._hashScript = function(value) {
	return crypto.createHash('sha1').update(value).digest('hex');
}

module.exports = Redlock;
