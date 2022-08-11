var test = require('tape')
var leveldown = require('leveldown')
var iteratorStream = require('./')
var through2 = require('through2')
var tempy = require('tempy')
var addSecretListener = require('secret-event-listener')

var db
var data = [
  { type: 'put', key: 'foobatch1', value: 'bar1' },
  { type: 'put', key: 'foobatch2', value: 'bar2' },
  { type: 'put', key: 'foobatch3', value: 'bar3' }
]

test('setup', function (t) {
  db = leveldown(tempy.directory())
  db.open(function (err) {
    t.error(err, 'no error')
    db.batch(data, function (err) {
      t.error(err, 'no error')
      t.end()
    })
  })
})

test('keys and values', function (t) {
  var idx = 0
  var stream = iteratorStream(db.iterator())
  stream.pipe(through2.obj(function (kv, _, done) {
    t.ok(Buffer.isBuffer(kv.key))
    t.ok(Buffer.isBuffer(kv.value))
    t.equal(kv.key.toString(), data[idx].key)
    t.equal(kv.value.toString(), data[idx].value)
    idx++
    done()
  }, function () {
    t.equal(idx, data.length)
    stream.on('close', function () {
      t.end()
    })
  }))
})

test('normal event order', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order.filter(withoutDataEvents), ['_end', 'end', 'close'])
    t.end()
  })

  stream.resume()
})

test('error from iterator.next', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order, ['_end', 'error: next', 'close'], 'event order')
    t.end()
  })

  iterator.next = function (cb) {
    process.nextTick(cb, new Error('next'))
  }

  stream.resume()
})

test('error from iterator end', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)
  var _end = iterator._end

  var order = monitor(iterator, stream, function () {
    t.same(order.filter(withoutDataEvents), ['_end', 'end', 'error: end', 'close'])
    t.end()
  })

  iterator._end = function (cb) {
    order.push('_end')
    _end.call(this, function (err) {
      t.ifError(err)
      cb(new Error('end'))
    })
  }

  stream.resume()
})

test('.destroy', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order, ['_end', 'close'])
    t.end()
  })

  stream.destroy()
})

test('.destroy(err)', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order, ['_end', 'error: user', 'close'])
    t.end()
  })

  stream.destroy(new Error('user'))
})

test('.destroy(err, callback)', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order, ['_end', 'callback', 'close'])
    t.end()
  })

  stream.destroy(new Error('user'), function (err) {
    order.push('callback')
    t.is(err.message, 'user', 'got error')
  })
})

test('.destroy(null, callback)', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order, ['_end', 'callback', 'close'])
    t.end()
  })

  stream.destroy(null, function (err) {
    order.push('callback')
    t.ifError(err, 'no error')
  })
})

test('.destroy() during iterator.next', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order, ['_end', 'close'], 'event order')
    t.end()
  })

  iterator.next = function () {
    stream.destroy()
  }

  stream.resume()
})

test('.destroy(err) during iterator.next', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order, ['_end', 'error: user', 'close'], 'event order')
    t.end()
  })

  iterator.next = function (cb) {
    stream.destroy(new Error('user'))
  }

  stream.resume()
})

test('.destroy(err, callback) during iterator.next', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order, ['_end', 'callback', 'close'], 'event order')
    t.end()
  })

  iterator.next = function (cb) {
    stream.destroy(new Error('user'), function (err) {
      order.push('callback')
      t.is(err.message, 'user', 'got error')
    })
  }

  stream.resume()
})

test('.destroy(null, callback) during iterator.next', function (t) {
  var iterator = db.iterator()
  var stream = iteratorStream(iterator)

  var order = monitor(iterator, stream, function () {
    t.same(order, ['_end', 'callback', 'close'], 'event order')
    t.end()
  })

  iterator.next = function (cb) {
    stream.destroy(null, function (err) {
      order.push('callback')
      t.ifError(err, 'no error')
    })
  }

  stream.resume()
})

test('.destroy during iterator.next 1', function (t) {
  var stream
  var iterator = db.iterator()
  var next = iterator.next.bind(iterator)
  iterator.next = function (cb) {
    t.pass('should be called once')
    next(cb)
    stream.destroy()
  }
  stream = iteratorStream(iterator)
  stream.on('data', function (data) {
    t.fail('should not be called')
  })
  stream.on('close', t.end.bind(t))
})

test('.destroy during iterator.next 2', function (t) {
  var stream
  var iterator = db.iterator()
  var next = iterator.next.bind(iterator)
  var count = 0
  iterator.next = function (cb) {
    t.pass('should be called')
    next(cb)
    if (++count === 2) {
      stream.destroy()
    }
  }
  stream = iteratorStream(iterator)
  stream.on('data', function (data) {
    t.pass('should be called')
  })
  stream.on('close', t.end.bind(t))
})

test('.destroy after iterator.next 1', function (t) {
  var stream
  var iterator = db.iterator()
  var next = iterator.next.bind(iterator)
  iterator.next = function (cb) {
    next(function (err, key, value) {
      stream.destroy()
      cb(err, key, value)
      t.pass('should be called')
    })
  }
  stream = iteratorStream(iterator)
  stream.on('data', function (data) {
    t.fail('should not be called')
  })
  stream.on('close', t.end.bind(t))
})

test('.destroy after iterator.next 2', function (t) {
  var stream
  var iterator = db.iterator()
  var next = iterator.next.bind(iterator)
  var count = 0
  iterator.next = function (cb) {
    next(function (err, key, value) {
      if (++count === 2) {
        stream.destroy()
      }
      cb(err, key, value)
      t.pass('should be called')
    })
  }
  stream = iteratorStream(iterator)
  stream.on('data', function (data) {
    t.pass('should be called')
  })
  stream.on('close', t.end.bind(t))
})

test('keys=false', function (t) {
  var stream = iteratorStream(db.iterator(), { keys: false })
  stream.once('data', function (value) {
    stream.destroy()
    t.equal(value.toString(), 'bar1')
    t.end()
  })
})

test('values=false', function (t) {
  var stream = iteratorStream(db.iterator(), { values: false })
  stream.once('data', function (key) {
    stream.destroy()
    t.equal(key.toString(), 'foobatch1')
    t.end()
  })
})

// It's important to keep a reference to the iterator at least until we end,
// to prevent GC of the iterator and therefor its db (esp. for native addons).
test('keeps a reference to the iterator', function (t) {
  var it = db.iterator()
  var stream = iteratorStream(it)

  stream.on('close', function () {
    t.is(stream._iterator, it, 'has reference')
    t.end()
  })

  stream.resume()
})

// Note: also serves as teardown of above tests
test('it is safe to close db on end of stream', function (t) {
  // Set highWaterMark to 0 so that we don't preemptively fetch.
  var it = db.iterator({ highWaterMark: 0 })
  var stream = iteratorStream(it)

  stream.on('end', function () {
    // Although the underlying iterator is still alive at this point (before
    // the 'close' event has been emitted) it's safe to close the db because
    // leveldown (v5) ends any open iterators before closing.
    db.close(function (err) {
      t.ifError(err, 'no error')
      t.end()
    })
  })

  stream.resume()
})

function monitor (iterator, stream, onClose) {
  var order = []

  ;['_next', '_end'].forEach(function (method) {
    var original = iterator[method]

    iterator[method] = function () {
      order.push(method)
      original.apply(this, arguments)
    }
  })

  ;['data', 'end', 'error', 'close'].forEach(function (event) {
    // Add listener without side effects (like triggering flowing mode)
    addSecretListener(stream, event, function (err) {
      if (event === 'error') order.push('error: ' + err.message)
      else order.push(event)
    })
  })

  if (onClose) {
    addSecretListener(stream, 'close', onClose)
  }

  return order
}

function withoutDataEvents (event) {
  return event !== '_next' && event !== 'data'
}
