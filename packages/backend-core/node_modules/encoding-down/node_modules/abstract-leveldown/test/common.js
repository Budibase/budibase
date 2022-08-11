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
    clear: !!options.clear,

    // Allow skipping 'start' and 'end' tests
    // TODO (next major): drop legacy range options
    legacyRange: options.legacyRange !== false,

    // Support running test suite on a levelup db. All options below this line
    // are undocumented and should not be used by abstract-leveldown db's (yet).
    promises: !!options.promises,
    status: options.status !== false,
    serialize: options.serialize !== false,

    // If true, the test suite assumes a default encoding of utf8 (like levelup)
    // and that operations return strings rather than buffers by default.
    encodings: !!options.encodings,

    // Not yet used, only here for symmetry with levelup's test suite.
    deferredOpen: !!options.deferredOpen,
    streams: !!options.streams
  }
}

function noopTest () {
  return function (t) {
    t.end()
  }
}

module.exports = testCommon
