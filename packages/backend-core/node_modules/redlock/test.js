'use strict';

var assert = require('chai').assert;
var Promise = require('bluebird');
var Redlock = require('./redlock');

test('single-server: https://www.npmjs.com/package/redis', [require('redis').createClient()]);
test('single-server: https://www.npmjs.com/package/redis (string_numbers=true)', [require('redis').createClient({string_numbers: true})]);
test('single-server: https://www.npmjs.com/package/ioredis', [new (require('ioredis'))()]);
test('multi-server: https://www.npmjs.com/package/ioredis', [new (require('ioredis'))({db: 1}), new (require('ioredis'))({db: 2}), new (require('ioredis'))({db: 3})]);

/* istanbul ignore next */
function test(name, clients){
	var redlock = new Redlock(clients, {
		retryCount: 2,
		retryDelay: 150,
		retryJitter: 50
	});

	var resourceString = 'Redlock:test:resource';
	var resourceArray = ['Redlock:test:resource1','Redlock:test:resource2'];
	var error = 'Redlock:test:error';

	describe('Redlock: ' + name, function(){

		before(function(done) {
			var err;
			var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
			for (var i = clients.length - 1; i >= 0; i--) {
				clients[i].sadd(error, 'having a set here should cause a failure', cb);
			}
		});

		before(function(done) {
			var err;
			var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
			for (var i = clients.length - 1; i >= 0; i--) {
				clients[i].script('flush', cb);
			}
		})

		it('should throw an error if not passed any clients', function(){
			assert.throws(function(){
				new Redlock([], {
					retryCount: 2,
					retryDelay: 150,
					retryJitter: 0
				});
			});
		});

		it('emits a clientError event when a client error occurs', function(done){
			var emitted = 0;
			function test(err) {
				assert.isNotNull(err);
				emitted++;
			}
			redlock.on('clientError', test);
			redlock.lock(error, 200, function(err, lock){
				redlock.removeListener('clientError', test);
				assert.isNotNull(err);
				assert.equal(emitted, 3 * redlock.servers.length);
				done();
			});
		});

		it('supports custom script functions in options', function(){
			var opts = {
				lockScript: function(lockScript) { return lockScript + 'and 1'; },
				unlockScript: function(unlockScript) { return unlockScript + 'and 2'; },
				extendScript: function(extendScript) { return extendScript + 'and 3'; },
			};
			var customRedlock = new Redlock(clients, opts);
			var i = 1;
			assert.equal(customRedlock.lockScript, redlock.lockScript + 'and ' + i++);
			assert.equal(customRedlock.unlockScript, redlock.unlockScript + 'and ' + i++);
			assert.equal(customRedlock.extendScript, redlock.extendScript + 'and ' + i++);
		});

		describe('callbacks', function(){
			before(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					clients[i].del(resourceString, cb);
				}
			});

			var one;
			it('should lock a resource', function(done) {
				redlock.lock(resourceString, 200, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.instanceOf(lock, Redlock.Lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.equal(lock.attempts, 1);
					one = lock;
					done();
				});
			});

			var two;
			var two_expiration;
			it('should wait until a lock expires before issuing another lock', function(done) {
				assert(one, 'Could not run because a required previous test failed.');
				redlock.lock(resourceString, 800, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isAbove(Date.now()+1, one.expiration);
					assert.isAbove(lock.attempts, 1);
					two = lock;
					two_expiration = lock.expiration;
					done();
				});
			});

			it('should unlock a resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.unlock(done);
				assert.equal(two.expiration, 0, 'Failed to immediately invalidate the lock.');
			});

			it('should unlock an already-unlocked resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.unlock(function(err) {
					assert.isNotNull(err)
					done();
				});
			});

			it('should error when unable to fully release a resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				var failingTwo = Object.create(two);
				failingTwo.resource = error;
				failingTwo.unlock(function(err) {
					assert.isNotNull(err);
					done();
				});
			});

			it('should fail to extend a lock on an already-unlocked resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.extend(200, function(err, lock){
					assert.isNotNull(err);
					assert.instanceOf(err, Redlock.LockError);
					assert.equal(err.attempts, 0);
					done();
				});
			});

			var three;
			it('should issue another lock immediately after a resource is unlocked', function(done) {
				assert(two_expiration, 'Could not run because a required previous test failed.');
				redlock.lock(resourceString, 800, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isBelow(Date.now()-1, two_expiration);
					assert.equal(lock.attempts, 1);
					three = lock;
					done();
				});
			});

			var four;
			it('should extend an unexpired lock', function(done) {
				assert(three, 'Could not run because a required previous test failed.');
				three.extend(800, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isAbove(lock.expiration, three.expiration-1);
					assert.equal(lock.attempts, 1);
					assert.equal(three, lock);
					four = lock;
					done();
				});
			});

			it('should fail after the maximum retry count is exceeded', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				redlock.lock(resourceString, 200, function(err, lock){
					assert.isNotNull(err);
					assert.instanceOf(err, Redlock.LockError);
					assert.equal(err.attempts, 3);
					done();
				});
			});

			it('should fail to extend an expired lock', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				setTimeout(function(){
					three.extend(800, function(err, lock){
						assert.isNotNull(err);
						assert.instanceOf(err, Redlock.LockError);
						assert.equal(err.attempts, 0);
						done();
					});
				}, four.expiration - Date.now() + 100);
			});

			it('should issue another lock immediately after a resource is expired', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				redlock.lock(resourceString, 800, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.equal(lock.attempts, 1);
					lock.unlock(done);
				});
			});

			describe('lockWithOptions', function() {
				it('should lock a resource with additional options', function(done) {
					redlock.lockWithOptions(resourceString, 200, {retryCount:10,retryDelay:1}, function(err, lock){
						if(err) throw err;
						assert.isObject(lock);
						assert.instanceOf(lock, Redlock.Lock);
						assert.isAbove(lock.expiration, Date.now()-1);
						assert.equal(lock.attempts, 1);
						assert.equal(lock.attemptsRemaining, 9);
						lock.unlock(done);
					});
				});
				it('should be backwards compatible', function(done) {
					redlock._lock(resourceString, null, 200, function(err, lock){
						if(err) throw err;
						assert.isObject(lock);
						assert.instanceOf(lock, Redlock.Lock);
						assert.isAbove(lock.expiration, Date.now()-1);
						assert.equal(lock.attempts, 1);
						assert.equal(lock.attemptsRemaining, 1);
						lock.unlock(done);
					});
				});
			});

			after(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					clients[i].del(resourceString, cb);
				}
			});
		});

		describe('promises', function(){
			before(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					clients[i].del(resourceString, cb);
				}
			});

			var one;
			it('should lock a resource', function(done) {
				redlock.lock(resourceString, 200)
				.done(function(lock){
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.equal(lock.attempts, 1);
					one = lock;
					done();
				}, done);
			});

			var two;
			var two_expiration;
			it('should wait until a lock expires before issuing another lock', function(done) {
				assert(one, 'Could not run because a required previous test failed.');
				redlock.lock(resourceString, 800)
				.done(function(lock){
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isAbove(Date.now()+1, one.expiration);
					assert.isAbove(lock.attempts, 1);
					two = lock;
					two_expiration = lock.expiration;
					done();
				}, done);
			});

			it('should unlock a resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.unlock().done(done, done);
			});

			it('should unlock an already-unlocked resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.unlock().done(function(result) {
					done(new Error('Expected an error.'));
				}, function(err) {
					done();
				});
			});

			it('should error when unable to fully release a resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				var failingTwo = Object.create(two);
				failingTwo.resource = error;
				failingTwo.unlock().done(done, function(err) {
					assert.isNotNull(err);
					done();
				});
			});

			it('should fail to extend a lock on an already-unlocked resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.extend(200)
				.done(function(){
					done(new Error('Should have failed with a LockError'));
				}, function(err){
					assert.instanceOf(err, Redlock.LockError);
					assert.equal(err.attempts, 0);
					done();
				});
			});

			var three;
			it('should issue another lock immediately after a resource is unlocked', function(done) {
				assert(two_expiration, 'Could not run because a required previous test failed.');
				redlock.lock(resourceString, 800)
				.done(function(lock){
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isBelow(Date.now()-1, two_expiration);
					assert.equal(lock.attempts, 1);
					three = lock;
					done();
				}, done);
			});

			var four;
			it('should extend an unexpired lock', function(done) {
				assert(three, 'Could not run because a required previous test failed.');
				three.extend(800)
				.done(function(lock){
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isAbove(lock.expiration, three.expiration-1);
					assert.equal(lock.attempts, 1);
					assert.equal(three, lock);
					four = lock;
					done();
				}, done);
			});

			it('should fail after the maximum retry count is exceeded', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				redlock.lock(resourceString, 200)
				.done(function(){
					done(new Error('Should have failed with a LockError'));
				}, function(err){
					assert.instanceOf(err, Redlock.LockError);
					assert.equal(err.attempts, 3);
					done();
				});
			});

			it('should fail to extend an expired lock', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				setTimeout(function(){
					three.extend(800)
					.done(function(){
						done(new Error('Should have failed with a LockError'));
					}, function(err){
						assert.instanceOf(err, Redlock.LockError);
						assert.equal(err.attempts, 0);
						done();
					});
				}, four.expiration - Date.now() + 100);
			});

			after(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					clients[i].del(resourceString, cb);
				}
			});
		});

		describe('disposer', function(){
			before(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					clients[i].del(resourceString, cb);
				}
			});

			var one;
			var one_expiration;
			it('should automatically release a lock after the using block', function(done) {
				Promise.using(
					redlock.disposer(resourceString, 200),
					function(lock){
						assert.isObject(lock);
						assert.isAbove(lock.expiration, Date.now()-1);
						assert.equal(lock.attempts, 1);
						one = lock;
						one_expiration = lock.expiration;
					}
				).done(done, done);
			});

			var two;
			var two_expiration;
			it('should issue another lock immediately after a resource is unlocked', function(done) {
				assert(one_expiration, 'Could not run because a required previous test failed.');
				Promise.using(
					redlock.disposer(resourceString, 800),
					function(lock){
						assert.isObject(lock);
						assert.isAbove(lock.expiration, Date.now()-1);
						assert.isBelow(Date.now()-1, one_expiration);
						assert.equal(lock.attempts, 1);
						two = lock;
						two_expiration = lock.expiration;
					}
				).done(done, done);
			});

			it('should call unlockErrorHandler when unable to fully release a resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				var errs = 0;
				var lock;
				Promise.using(
					redlock.disposer(resourceString, 800, function(err) {
						errs++;
					}),
					function(l){
						lock = l;
						lock.resource = error;
					}
				).done(function() {
					assert.equal(errs, 1);
					lock.resource = resourceString;
					lock.unlock().done(done, done);
				}, done);
			});

			var three_original, three_extended;
			var three_original_expiration;
			var three_extended_expiration;
			it('should automatically release an extended lock', function(done) {
				assert(two_expiration, 'Could not run because a required previous test failed.');
				Promise.using(
					redlock.disposer(resourceString, 200),
					function(lock){
						assert.isObject(lock);
						assert.isAbove(lock.expiration, Date.now()-1);
						assert.isBelow(Date.now()-1, two_expiration);
						three_original = lock;
						three_original_expiration = lock.expiration;

						return Promise.delay(100)
						.then(function(){ return lock.extend(200); })
						.then(function(extended) {
							assert.isObject(extended);
							assert.isAbove(extended.expiration, Date.now()-1);
							assert.isBelow(Date.now()-1, three_original_expiration);
							assert.isAbove(extended.expiration, three_original_expiration);
							assert.equal(lock.attempts, 1);
							assert.equal(extended, lock);
							three_extended = extended;
							three_extended_expiration = extended.expiration;
						});
					}
				)
				.then(function(){
					assert.equal(three_original.expiration, 0);
					assert.equal(three_extended.expiration, 0);
				}).done(done, done);
			});

			after(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					clients[i].del(resourceString, cb);
				}
			});
		});
		
		describe('callbacks - multi', function(){
			before(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					for (var j = resourceArray.length - 1; j >= 0; j--) {
						clients[i].del(resourceArray[j], cb);
					}
				}
			});

			var one;
			it('should lock a multivalue resource', function(done) {
				redlock.lock(resourceArray, 200, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.instanceOf(lock, Redlock.Lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.equal(lock.attempts, 1);
					one = lock;
					done();
				});
			});

			var two;
			var two_expiration;
			it('should wait until a lock expires before issuing another lock', function(done) {
				assert(one, 'Could not run because a required previous test failed.');
				redlock.lock(resourceArray, 800, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isAbove(Date.now()+1, one.expiration);
					assert.isAbove(lock.attempts, 1);
					two = lock;
					two_expiration = lock.expiration;
					done();
				});
			});

			it('should unlock a multivalue resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.unlock(done);
				assert.equal(two.expiration, 0, 'Failed to immediately invalidate the lock.');
			});

			it('should unlock an already-unlocked multivalue resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.unlock(function(err) {
					assert.isNotNull(err)
					done();
				});
			});

			it('should error when unable to fully release a multivalue resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				var failingTwo = Object.create(two);
				failingTwo.resource = error;
				failingTwo.unlock(function(err) {
					assert.isNotNull(err);
					done();
				});
			});

			it('should fail to extend a lock on an already-unlocked multivalue resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.extend(200, function(err, lock){
					assert.isNotNull(err);
					assert.instanceOf(err, Redlock.LockError);
					assert.equal(err.attempts, 0);
					done();
				});
			});

			var three;
			it('should issue another lock immediately after a multivalue resource is unlocked', function(done) {
				assert(two_expiration, 'Could not run because a required previous test failed.');
				redlock.lock(resourceArray, 800, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isBelow(Date.now()-1, two_expiration);
					assert.equal(lock.attempts, 1);
					three = lock;
					done();
				});
			});

			var four;
			it('should extend an unexpired multivalue lock', function(done) {
				assert(three, 'Could not run because a required previous test failed.');
				three.extend(800, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isAbove(lock.expiration, three.expiration-1);
					assert.equal(lock.attempts, 1);
					assert.equal(three, lock);
					four = lock;
					done();
				});
			});

			it('should fail after the maximum retry count is exceeded', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				redlock.lock(resourceArray, 200, function(err, lock){
					assert.isNotNull(err);
					assert.instanceOf(err, Redlock.LockError);
					assert.equal(err.attempts, 3);
					done();
				});
			});

			it('should fail to extend an expired lock', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				setTimeout(function(){
					three.extend(800, function(err, lock){
						assert.isNotNull(err);
						assert.instanceOf(err, Redlock.LockError);
						assert.equal(err.attempts, 0);
						done();
					});
				}, four.expiration - Date.now() + 100);
			});

			it('should issue another lock immediately after a resource is expired', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				redlock.lock(resourceArray, 800, function(err, lock){
					if(err) throw err;
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.equal(lock.attempts, 1);
					done();
				});
			});

			after(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					for (var j = resourceArray.length - 1; j >= 0; j--) {
						clients[i].del(resourceArray[j], cb);
					}
				}
			});
		});
		
		describe('promises - multi', function(){
			before(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					for (var j = resourceArray.length - 1; j >= 0; j--) {
						clients[i].del(resourceArray[j], cb);
					}
				}
			});

			var one;
			it('should lock a multivalue resource', function(done) {
				redlock.lock(resourceArray, 200)
				.done(function(lock){
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.equal(lock.attempts, 1);
					one = lock;
					done();
				}, done);
			});

			var two;
			var two_expiration;
			it('should wait until a multivalue lock expires before issuing another lock', function(done) {
				assert(one, 'Could not run because a required previous test failed.');
				redlock.lock(resourceArray, 800)
				.done(function(lock){
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isAbove(Date.now()+1, one.expiration);
					assert.isAbove(lock.attempts, 1);
					two = lock;
					two_expiration = lock.expiration;
					done();
				}, done);
			});

			it('should unlock a multivalue resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.unlock().done(done, done);
			});

			it('should unlock an already-unlocked multivalue resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.unlock().done(function(result) {
					done(new Error('Expected an error.'));
				}, function(err) {
					done();
				});
			});

			it('should error when unable to fully release a multivalue resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				var failingTwo = Object.create(two);
				failingTwo.resource = error;
				failingTwo.unlock().done(done, function(err) {
					assert.isNotNull(err);
					done();
				});
			});

			it('should fail to extend a lock on an already-unlocked multivalue resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				two.extend(200)
				.done(function(){
					done(new Error('Should have failed with a LockError'));
				}, function(err){
					assert.instanceOf(err, Redlock.LockError);
					assert.equal(err.attempts, 0);
					done();
				});
			});

			var three;
			it('should issue another lock immediately after a multivalue resource is unlocked', function(done) {
				assert(two_expiration, 'Could not run because a required previous test failed.');
				redlock.lock(resourceArray, 800)
				.done(function(lock){
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isBelow(Date.now()-1, two_expiration);
					assert.equal(lock.attempts, 1);
					three = lock;
					done();
				}, done);
			});

			var four;
			it('should extend an unexpired lock', function(done) {
				assert(three, 'Could not run because a required previous test failed.');
				three.extend(800)
				.done(function(lock){
					assert.isObject(lock);
					assert.isAbove(lock.expiration, Date.now()-1);
					assert.isAbove(lock.expiration, three.expiration-1);
					assert.equal(lock.attempts, 1);
					assert.equal(three, lock);
					four = lock;
					done();
				}, done);
			});

			it('should fail after the maximum retry count is exceeded', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				redlock.lock(resourceArray, 200)
				.done(function(){
					done(new Error('Should have failed with a LockError'));
				}, function(err){
					assert.instanceOf(err, Redlock.LockError);
					assert.equal(err.attempts, 3);
					done();
				});
			});

			it('should fail to extend an expired lock', function(done) {
				assert(four, 'Could not run because a required previous test failed.');
				setTimeout(function(){
					three.extend(800)
					.done(function(){
						done(new Error('Should have failed with a LockError'));
					}, function(err){
						assert.instanceOf(err, Redlock.LockError);
						assert.equal(err.attempts, 0);
						done();
					});
				}, four.expiration - Date.now() + 100);
			});

			after(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					for (var j = resourceArray.length - 1; j >= 0; j--) {
						clients[i].del(resourceArray[j], cb);
					}
				}
			});
		});
		
		describe('disposer - multi', function(){
			before(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					for (var j = resourceArray.length - 1; j >= 0; j--) {
						clients[i].del(resourceArray[j], cb);
					}
				}
			});

			var one;
			var one_expiration;
			it('should automatically release a lock after the using block', function(done) {
				Promise.using(
					redlock.disposer(resourceArray, 200),
					function(lock){
						assert.isObject(lock);
						assert.isAbove(lock.expiration, Date.now()-1);
						assert.equal(lock.attempts, 1);
						one = lock;
						one_expiration = lock.expiration;
					}
				).done(done, done);
			});

			var two;
			var two_expiration;
			it('should issue another lock immediately after a resource is unlocked', function(done) {
				assert(one_expiration, 'Could not run because a required previous test failed.');
				Promise.using(
					redlock.disposer(resourceArray, 800),
					function(lock){
						assert.isObject(lock);
						assert.isAbove(lock.expiration, Date.now()-1);
						assert.isBelow(Date.now()-1, one_expiration);
						assert.equal(lock.attempts, 1);
						two = lock;
						two_expiration = lock.expiration;
					}
				).done(done, done);
			});

			it('should call unlockErrorHandler when unable to fully release a resource', function(done) {
				assert(two, 'Could not run because a required previous test failed.');
				var errs = 0;
				var lock;
				Promise.using(
					redlock.disposer(resourceArray, 800, function(err) {
						errs++;
					}),
					function(l){
						lock = l;
						lock.resource = error;
					}
				).done(function() {
					assert.equal(errs, 1);
					lock.resource = resourceArray;
					lock.unlock().done(done, done);
				}, done);
			});

			var three_original, three_extended;
			var three_original_expiration;
			var three_extended_expiration;
			it('should automatically release an extended lock', function(done) {
				assert(two_expiration, 'Could not run because a required previous test failed.');
				Promise.using(
					redlock.disposer(resourceArray, 200),
					function(lock){
						assert.isObject(lock);
						assert.isAbove(lock.expiration, Date.now()-1);
						assert.isBelow(Date.now()-1, two_expiration);
						three_original = lock;
						three_original_expiration = lock.expiration;
						return Promise.delay(100)
						.then(function(){ return lock.extend(200); })
						.then(function(extended) {
							assert.isObject(extended);
							assert.isAbove(extended.expiration, Date.now()-1);
							assert.isBelow(Date.now()-1, three_original_expiration);
							assert.isAbove(extended.expiration, three_original_expiration);
							assert.equal(lock.attempts, 1);
							assert.equal(extended, lock);
							three_extended = extended;
							three_extended_expiration = extended.expiration;
						});
					}
				)
				.then(function(){
					assert.equal(three_original.expiration, 0);
					assert.equal(three_extended.expiration, 0);
				}).done(done, done);
			});

			after(function(done) {
				var err;
				var l = clients.length; function cb(e){ if(e) err = e; l--; if(l === 0) done(err); }
				for (var i = clients.length - 1; i >= 0; i--) {
					for (var j = resourceArray.length - 1; j >= 0; j--) {
						clients[i].del(resourceArray[j], cb);
					}
				}
			});
		});

		describe('quit', function() {
			it('should quit all clients', function(done){
				redlock.quit()
				.done(function(results) {
					assert.isArray(results);
					done();
				}, done);
			});
		})

	});
}
