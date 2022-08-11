function testCommon (options) {
  var factory = options.factory
  var test = options.test

  if (typeof factory !== 'function') {
    throw new TypeError('factory must be a function')
  }

  if (typeof test !== 'function') {
    throw new TypeError('test must be a function')
  }

  return {
    test: test,
    factory: factory,

    // TODO (next major): remove
    setUp: options.setUp || noopTest(),
    tearDown: options.tearDown || noopTest(),

    // TODO (next major): use db.supports instead
    bufferKeys: options.bufferKeys !== false,
    createIfMissing: options.createIfMissing !== false,
    errorIfExists: options.errorIfExists !== false,
    snapshots: options.snapshots !== false,
    seek: options.seek !== false,
    clear: !!options.clear
  }
}

function noopTest () {
  return function (t) {
    t.end()
  }
}

module.exports = testCommon
