var test                 = require('tape')
  , sinon                = require('sinon')
  , util                 = require('util')
  , testCommon           = require('./testCommon')
  , AbstractLevelDOWN    = require('./').AbstractLevelDOWN
  , AbstractIterator     = require('./').AbstractIterator
  , AbstractChainedBatch = require('./').AbstractChainedBatch
  , isLevelDOWN          = require('./').isLevelDOWN

function factory (location, opts) {
  return new AbstractLevelDOWN(location, opts)
}

/*** compatibility with basic LevelDOWN API ***/

require('./abstract/leveldown-test').args(factory, test, testCommon)

require('./abstract/open-test').args(factory, test, testCommon)

require('./abstract/del-test').setUp(factory, test, testCommon)
require('./abstract/del-test').args(test)

require('./abstract/get-test').setUp(factory, test, testCommon)
require('./abstract/get-test').args(test)

require('./abstract/put-test').setUp(factory, test, testCommon)
require('./abstract/put-test').args(test)

require('./abstract/put-get-del-test').setUp(factory, test, testCommon)
require('./abstract/put-get-del-test').errorKeys(test)
//require('./abstract/put-get-del-test').nonErrorKeys(test, testCommon)
require('./abstract/put-get-del-test').errorValues(test)
//require('./abstract/test/put-get-del-test').nonErrorKeys(test, testCommon)
require('./abstract/put-get-del-test').tearDown(test, testCommon)

require('./abstract/approximate-size-test').setUp(factory, test, testCommon)
require('./abstract/approximate-size-test').args(test)

require('./abstract/batch-test').setUp(factory, test, testCommon)
require('./abstract/batch-test').args(test)

require('./abstract/chained-batch-test').setUp(factory, test, testCommon)
require('./abstract/chained-batch-test').args(test)

require('./abstract/close-test').close(factory, test, testCommon)

require('./abstract/iterator-test').setUp(factory, test, testCommon)
require('./abstract/iterator-test').args(test)
require('./abstract/iterator-test').sequence(test)

/*** extensibility ***/

test('test core extensibility', function (t) {
  function Test (location) {
    AbstractLevelDOWN.call(this, location)
    t.equal(this.location, location, 'location set on `this`')
    t.end()
  }

  util.inherits(Test, AbstractLevelDOWN)

  ;new Test('foobar')
})

test('test key/value serialization', function (t) {
  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  var buffer = new Buffer(0)
  var test = new Test('foobar')

  t.equal(test._serializeKey(1), '1', '_serializeKey converts to string')
  t.ok(test._serializeKey(buffer) === buffer, '_serializeKey returns Buffer as is')

  t.equal(test._serializeValue(null), '', '_serializeValue converts null to empty string')
  t.equal(test._serializeValue(undefined), '', '_serializeValue converts undefined to empty string')

  var browser = !! process.browser
  process.browser = false

  t.equal(test._serializeValue(1), '1', '_serializeValue converts to string')
  t.ok(test._serializeValue(buffer) === buffer, '_serializeValue returns Buffer as is')

  process.browser = true
  t.equal(test._serializeValue(1), 1, '_serializeValue returns value as is when process.browser')

  process.browser = browser

  t.end()
})

test('test open() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedCb = function () {}
    , expectedOptions = { createIfMissing: true, errorIfExists: false }
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._open = spy

  test = new Test('foobar')
  test.open(expectedCb)

  t.equal(spy.callCount, 1, 'got _open() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _open() was correct')
  t.equal(spy.getCall(0).args.length, 2, 'got two arguments')
  t.deepEqual(spy.getCall(0).args[0], expectedOptions, 'got default options argument')

  test.open({ options: 1 }, expectedCb)

  expectedOptions.options = 1

  t.equal(spy.callCount, 2, 'got _open() call')
  t.equal(spy.getCall(1).thisValue, test, '`this` on _open() was correct')
  t.equal(spy.getCall(1).args.length, 2, 'got two arguments')
  t.deepEqual(spy.getCall(1).args[0], expectedOptions, 'got expected options argument')
  t.end()
})

test('test close() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedCb = function () {}
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._close = spy

  test = new Test('foobar')
  test.close(expectedCb)

  t.equal(spy.callCount, 1, 'got _close() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _close() was correct')
  t.equal(spy.getCall(0).args.length, 1, 'got one arguments')
  t.end()
})

test('test get() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedCb = function () {}
    , expectedOptions = { asBuffer: true }
    , expectedKey = 'a key'
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._get = spy

  test = new Test('foobar')
  test.get(expectedKey, expectedCb)

  t.equal(spy.callCount, 1, 'got _get() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _get() was correct')
  t.equal(spy.getCall(0).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(0).args[0], expectedKey, 'got expected key argument')
  t.deepEqual(spy.getCall(0).args[1], expectedOptions, 'got default options argument')
  t.equal(spy.getCall(0).args[2], expectedCb, 'got expected cb argument')

  test.get(expectedKey, { options: 1 }, expectedCb)

  expectedOptions.options = 1

  t.equal(spy.callCount, 2, 'got _get() call')
  t.equal(spy.getCall(1).thisValue, test, '`this` on _get() was correct')
  t.equal(spy.getCall(1).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(1).args[0], expectedKey, 'got expected key argument')
  t.deepEqual(spy.getCall(1).args[1], expectedOptions, 'got expected options argument')
  t.equal(spy.getCall(1).args[2], expectedCb, 'got expected cb argument')
  t.end()
})

test('test del() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedCb = function () {}
    , expectedOptions = { options: 1 }
    , expectedKey = 'a key'
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._del = spy

  test = new Test('foobar')
  test.del(expectedKey, expectedCb)

  t.equal(spy.callCount, 1, 'got _del() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _del() was correct')
  t.equal(spy.getCall(0).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(0).args[0], expectedKey, 'got expected key argument')
  t.deepEqual(spy.getCall(0).args[1], {}, 'got blank options argument')
  t.equal(spy.getCall(0).args[2], expectedCb, 'got expected cb argument')

  test.del(expectedKey, expectedOptions, expectedCb)

  t.equal(spy.callCount, 2, 'got _del() call')
  t.equal(spy.getCall(1).thisValue, test, '`this` on _del() was correct')
  t.equal(spy.getCall(1).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(1).args[0], expectedKey, 'got expected key argument')
  t.deepEqual(spy.getCall(1).args[1], expectedOptions, 'got expected options argument')
  t.equal(spy.getCall(1).args[2], expectedCb, 'got expected cb argument')
  t.end()
})

test('test put() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedCb = function () {}
    , expectedOptions = { options: 1 }
    , expectedKey = 'a key'
    , expectedValue = 'a value'
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._put = spy

  test = new Test('foobar')
  test.put(expectedKey, expectedValue, expectedCb)

  t.equal(spy.callCount, 1, 'got _put() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _put() was correct')
  t.equal(spy.getCall(0).args.length, 4, 'got four arguments')
  t.equal(spy.getCall(0).args[0], expectedKey, 'got expected key argument')
  t.equal(spy.getCall(0).args[1], expectedValue, 'got expected value argument')
  t.deepEqual(spy.getCall(0).args[2], {}, 'got blank options argument')
  t.equal(spy.getCall(0).args[3], expectedCb, 'got expected cb argument')

  test.put(expectedKey, expectedValue, expectedOptions, expectedCb)

  t.equal(spy.callCount, 2, 'got _put() call')
  t.equal(spy.getCall(1).thisValue, test, '`this` on _put() was correct')
  t.equal(spy.getCall(1).args.length, 4, 'got four arguments')
  t.equal(spy.getCall(1).args[0], expectedKey, 'got expected key argument')
  t.equal(spy.getCall(1).args[1], expectedValue, 'got expected value argument')
  t.deepEqual(spy.getCall(1).args[2], expectedOptions, 'got blank options argument')
  t.equal(spy.getCall(1).args[3], expectedCb, 'got expected cb argument')
  t.end()
})

test('test approximateSize() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedCb = function () {}
    , expectedStart = 'a start'
    , expectedEnd = 'an end'
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._approximateSize = spy

  test = new Test('foobar')
  test.approximateSize(expectedStart, expectedEnd, expectedCb)

  t.equal(spy.callCount, 1, 'got _approximateSize() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _approximateSize() was correct')
  t.equal(spy.getCall(0).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(0).args[0], expectedStart, 'got expected start argument')
  t.equal(spy.getCall(0).args[1], expectedEnd, 'got expected end argument')
  t.equal(spy.getCall(0).args[2], expectedCb, 'got expected cb argument')
  t.end()
})

test('test batch() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedCb = function () {}
    , expectedOptions = { options: 1 }
    , expectedArray = [ 1, 2 ]
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._batch = spy

  test = new Test('foobar')

  test.batch(expectedArray, expectedCb)

  t.equal(spy.callCount, 1, 'got _batch() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _batch() was correct')
  t.equal(spy.getCall(0).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(0).args[0], expectedArray, 'got expected array argument')
  t.deepEqual(spy.getCall(0).args[1], {}, 'got expected options argument')
  t.equal(spy.getCall(0).args[2], expectedCb, 'got expected callback argument')

  test.batch(expectedArray, expectedOptions, expectedCb)

  t.equal(spy.callCount, 2, 'got _batch() call')
  t.equal(spy.getCall(1).thisValue, test, '`this` on _batch() was correct')
  t.equal(spy.getCall(1).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(1).args[0], expectedArray, 'got expected array argument')
  t.deepEqual(spy.getCall(1).args[1], expectedOptions, 'got expected options argument')
  t.equal(spy.getCall(1).args[2], expectedCb, 'got expected callback argument')

  test.batch(expectedArray, null, expectedCb)

  t.equal(spy.callCount, 3, 'got _batch() call')
  t.equal(spy.getCall(2).thisValue, test, '`this` on _batch() was correct')
  t.equal(spy.getCall(2).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(2).args[0], expectedArray, 'got expected array argument')
  t.ok(spy.getCall(2).args[1], 'options should not be null')
  t.equal(spy.getCall(2).args[2], expectedCb, 'got expected callback argument')
  t.end()
})

test('test chained batch() (array) extensibility', function (t) {
  var spy = sinon.spy()
    , expectedCb = function () {}
    , expectedOptions = { options: 1 }
    , expectedArray = [ 1, 2 ]
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._batch = spy

  test = new Test('foobar')

  test.batch().put('foo', 'bar').del('bang').write(expectedCb)

  t.equal(spy.callCount, 1, 'got _batch() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _batch() was correct')
  t.equal(spy.getCall(0).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(0).args[0].length, 2, 'got expected array argument')
  t.deepEqual(spy.getCall(0).args[0][0], { type: 'put', key: 'foo', value: 'bar' }, 'got expected array argument[0]')
  t.deepEqual(spy.getCall(0).args[0][1], { type: 'del', key: 'bang' }, 'got expected array argument[1]')
  t.deepEqual(spy.getCall(0).args[1], {}, 'got expected options argument')
  t.equal(spy.getCall(0).args[2], expectedCb, 'got expected callback argument')

  test.batch().put('foo', 'bar').del('bang').write(expectedOptions, expectedCb)

  t.equal(spy.callCount, 2, 'got _batch() call')
  t.equal(spy.getCall(1).thisValue, test, '`this` on _batch() was correct')
  t.equal(spy.getCall(1).args.length, 3, 'got three arguments')
  t.equal(spy.getCall(1).args[0].length, 2, 'got expected array argument')
  t.deepEqual(spy.getCall(1).args[0][0], { type: 'put', key: 'foo', value: 'bar' }, 'got expected array argument[0]')
  t.deepEqual(spy.getCall(1).args[0][1], { type: 'del', key: 'bang' }, 'got expected array argument[1]')
  t.deepEqual(spy.getCall(1).args[1], expectedOptions, 'got expected options argument')
  t.equal(spy.getCall(1).args[2], expectedCb, 'got expected callback argument')

  t.end()
})

test('test chained batch() (custom _chainedBatch) extensibility', function (t) {
  var spy = sinon.spy()
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._chainedBatch = spy

  test = new Test('foobar')

  test.batch()

  t.equal(spy.callCount, 1, 'got _chainedBatch() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _chainedBatch() was correct')

  test.batch()

  t.equal(spy.callCount, 2, 'got _chainedBatch() call')
  t.equal(spy.getCall(1).thisValue, test, '`this` on _chainedBatch() was correct')

  t.end()
})

test('test AbstractChainedBatch extensibility', function (t) {
  function Test (db) {
    AbstractChainedBatch.call(this, db)
    t.equal(this._db, db, 'db set on `this`')
    t.end()
  }

  util.inherits(Test, AbstractChainedBatch)

  new Test('foobar')
})

test('test write() extensibility', function (t) {
  var spy = sinon.spy()
    , spycb = sinon.spy()
    , test

  function Test (db) {
    AbstractChainedBatch.call(this, db)
  }

  util.inherits(Test, AbstractChainedBatch)

  Test.prototype._write = spy

  test = new Test('foobar')
  test.write(spycb)

  t.equal(spy.callCount, 1, 'got _write() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _write() was correct')
  t.equal(spy.getCall(0).args.length, 1, 'got one argument')
  // awkward here cause of nextTick & an internal wrapped cb
  t.equal(typeof spy.getCall(0).args[0], 'function', 'got a callback function')
  t.equal(spycb.callCount, 0, 'spycb not called')
  spy.getCall(0).args[0]()
  t.equal(spycb.callCount, 1, 'spycb called, i.e. was our cb argument')
  t.end()
})

test('test put() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedKey = 'key'
    , expectedValue = 'value'
    , returnValue
    , test

  function Test (db) {
    AbstractChainedBatch.call(this, db)
  }

  util.inherits(Test, AbstractChainedBatch)

  Test.prototype._put = spy

  test = new Test(factory('foobar'))
  returnValue = test.put(expectedKey, expectedValue)
  t.equal(spy.callCount, 1, 'got _put call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _put() was correct')
  t.equal(spy.getCall(0).args.length, 2, 'got two arguments')
  t.equal(spy.getCall(0).args[0], expectedKey, 'got expected key argument')
  t.equal(spy.getCall(0).args[1], expectedValue, 'got expected value argument')
  t.equal(returnValue, test, 'get expected return value')
  t.end()
})

test('test del() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedKey = 'key'
    , returnValue
    , test

  function Test (db) {
    AbstractChainedBatch.call(this, db)
  }

  util.inherits(Test, AbstractChainedBatch)

  Test.prototype._del = spy

  test = new Test(factory('foobar'))
  returnValue = test.del(expectedKey)
  t.equal(spy.callCount, 1, 'got _del call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _del() was correct')
  t.equal(spy.getCall(0).args.length, 1, 'got one argument')
  t.equal(spy.getCall(0).args[0], expectedKey, 'got expected key argument')
  t.equal(returnValue, test, 'get expected return value')
  t.end()
})

test('test clear() extensibility', function (t) {
  var spy = sinon.spy()
    , returnValue
    , test

  function Test (db) {
    AbstractChainedBatch.call(this, db)
  }

  util.inherits(Test, AbstractChainedBatch)

  Test.prototype._clear = spy

  test = new Test(factory('foobar'))
  returnValue = test.clear()
  t.equal(spy.callCount, 1, 'got _clear call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _clear() was correct')
  t.equal(spy.getCall(0).args.length, 0, 'got zero arguments')
  t.equal(returnValue, test, 'get expected return value')
  t.end()
})

test('test iterator() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedOptions = { options: 1, reverse: false, keys: true, values: true, limit: -1, keyAsBuffer: true, valueAsBuffer: true }
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._iterator = spy

  test = new Test('foobar')
  test.iterator({ options: 1 })

  t.equal(spy.callCount, 1, 'got _close() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _close() was correct')
  t.equal(spy.getCall(0).args.length, 1, 'got one arguments')
  t.deepEqual(spy.getCall(0).args[0], expectedOptions, 'got expected options argument')
  t.end()
})

test('test AbstractIterator extensibility', function (t) {
  function Test (db) {
    AbstractIterator.call(this, db)
    t.equal(this.db, db, 'db set on `this`')
    t.end()
  }

  util.inherits(Test, AbstractIterator)

  ;new Test('foobar')
})

test('test next() extensibility', function (t) {
  var spy = sinon.spy()
    , spycb = sinon.spy()
    , test

  function Test (db) {
    AbstractIterator.call(this, db)
  }

  util.inherits(Test, AbstractIterator)

  Test.prototype._next = spy

  test = new Test('foobar')
  test.next(spycb)

  t.equal(spy.callCount, 1, 'got _next() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _next() was correct')
  t.equal(spy.getCall(0).args.length, 1, 'got one arguments')
  // awkward here cause of nextTick & an internal wrapped cb
  t.equal(typeof spy.getCall(0).args[0], 'function', 'got a callback function')
  t.equal(spycb.callCount, 0, 'spycb not called')
  spy.getCall(0).args[0]()
  t.equal(spycb.callCount, 1, 'spycb called, i.e. was our cb argument')
  t.end()
})

test('test end() extensibility', function (t) {
  var spy = sinon.spy()
    , expectedCb = function () {}
    , test

  function Test (db) {
    AbstractIterator.call(this, db)
  }

  util.inherits(Test, AbstractIterator)

  Test.prototype._end = spy

  test = new Test('foobar')
  test.end(expectedCb)

  t.equal(spy.callCount, 1, 'got _end() call')
  t.equal(spy.getCall(0).thisValue, test, '`this` on _end() was correct')
  t.equal(spy.getCall(0).args.length, 1, 'got one arguments')
  t.equal(spy.getCall(0).args[0], expectedCb, 'got expected cb argument')
  t.end()
})

test('test serialization extensibility', function (t) {
  var spy = sinon.spy()
    , test

  function Test (location) {
    AbstractLevelDOWN.call(this, location)
  }

  util.inherits(Test, AbstractLevelDOWN)

  Test.prototype._serializeKey = function (key) {
    t.equal(key, 'no')
    return 'foo'
  }

  Test.prototype._serializeValue = function (value) {
    t.equal(value, 'nope')
    return 'bar'
  }

  Test.prototype._put = spy

  test = new Test('foobar')
  test.put('no', 'nope', function () {})

  t.equal(spy.callCount, 1, 'got _put() call')
  t.equal(spy.getCall(0).args[0], 'foo', 'got expected key argument')
  t.equal(spy.getCall(0).args[1], 'bar', 'got expected value argument')

  t.end()
})

test('isLevelDOWN', function (t) {
  t.notOk(isLevelDOWN(), 'is not a leveldown')
  t.notOk(isLevelDOWN(''), 'is not a leveldown')
  t.notOk(isLevelDOWN({}), 'is not a leveldown')
  t.notOk(isLevelDOWN({ put: function () {} }), 'is not a leveldown')
  t.ok(isLevelDOWN(new AbstractLevelDOWN('location')), 'IS a leveldown')
  t.ok(isLevelDOWN({
    open: function () {},
    close: function () {},
    get: function () {},
    put: function () {},
    del: function () {},
    batch: function () {},
    iterator: function () {}
  }), 'IS a leveldown')
  t.ok(isLevelDOWN({
    open: function () {},
    close: function () {},
    get: function () {},
    put: function () {},
    del: function () {},
    batch: function () {},
    approximateSize: function () {},
    iterator: function () {}
  }), 'IS also a leveldown')
  t.end()
})

test('.status', function (t) {
  t.test('empty prototype', function (t) {
    var test

    function Test (location) {
      AbstractLevelDOWN.call(this, location)
    }

    util.inherits(Test, AbstractLevelDOWN)

    test = new Test('foobar')
    t.equal(test.status, 'new')

    test.open(function (err) {
      t.error(err)
      t.equal(test.status, 'open')

      test.close(function (err) {
        t.error(err)
        t.equal(test.status, 'closed')
        t.end()
      })
    })
  })

  t.test('open error', function (t) {
    var test

    function Test (location) {
      AbstractLevelDOWN.call(this, location)
    }

    util.inherits(Test, AbstractLevelDOWN)

    Test.prototype._open = function (options, cb) {
      cb(new Error)
    }

    test = new Test('foobar')
    test.open(function (err) {
      t.ok(err)
      t.equal(test.status, 'new')
      t.end()
    })
  })

  t.test('close error', function (t) {
    var test

    function Test (location) {
      AbstractLevelDOWN.call(this, location)
    }

    util.inherits(Test, AbstractLevelDOWN)

    Test.prototype._close = function (cb) {
      cb(new Error)
    }

    test = new Test('foobar')
    test.open(function () {
      test.close(function (err) {
        t.ok(err)
        t.equal(test.status, 'open')
        t.end()
      })
    })
  })

  t.test('open', function (t) {
    var test

    function Test (location) {
      AbstractLevelDOWN.call(this, location)
    }

    util.inherits(Test, AbstractLevelDOWN)

    Test.prototype._open = function (options, cb) {
      process.nextTick(cb)
    }

    test = new Test('foobar')
    test.open(function (err) {
      t.error(err)
      t.equal(test.status, 'open')
      t.end()
    })
    t.equal(test.status, 'opening')
  })

  t.test('close', function (t) {
    var test

    function Test (location) {
      AbstractLevelDOWN.call(this, location)
    }

    util.inherits(Test, AbstractLevelDOWN)

    Test.prototype._close = function (cb) {
      process.nextTick(cb)
    }

    test = new Test('foobar')
    test.open(function (err) {
      t.error(err)
      test.close(function (err) {
        t.error(err)
        t.equal(test.status, 'closed')
        t.end()
      })
      t.equal(test.status, 'closing')
    })
  })
})
