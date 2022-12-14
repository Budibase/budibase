"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateCookieOptions = validateCookieOptions;

function validateCookieOptions( // eslint-disable-next-line @typescript-eslint/no-explicit-any
opts, resolver = require.resolve) {
  if (!('jar' in opts)) {
    throw new TypeError('invalid cookies.jar');
  }

  if (opts.async_UNSTABLE) {
    try {
      resolver('deasync');
    } catch (_err) {
      throw new Error('you should install deasync library when cookies.async_UNSTABLE is true.');
    }
  } else {
    if (!opts.jar.store.synchronous) {
      throw new TypeError('you should set cookies.async_UNSTABLE to true for using the asynchronous cookie store.');
    }
  }
}