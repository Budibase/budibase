// Koa and Express are fundamental different in how they deal with extensions
// to the incoming request.
// Express pollutes Node's IncomingRequest directly, while Koa keeps Node's
// IncomingRequest untouched and adds is own high-level request object.
// These both approaches are not directly compatible with each other, since
// properties/methods found in Express' `req` object are now spread between
// Koa's context, Koa's request object and the original incoming request.
// This makes moking the Express `req` object an ugly task. With ES6 we could
// simply use a Proxy, e.g.:
//
// function createReqMock(ctx) {
//   // Use a proxy that forwards `req` reads to either `ctx.passport`,
//   // Node's request, Koa's request or Koa's context. Writes are persistet
//   // into `ctx.passport`.
//   return Proxy.create(handler(ctx.passport, {
//     get: function(receiver, key) {
//       return ctx.passport[key] || ctx.req[key] || ctx.request[key] || ctx[key]
//     }
//   }))
// }
//
// However, the current Proxy implementation does not allow debugging.
// See: https://github.com/rkusa/koa-passport/issues/17
//
// Until this is fixed, koa-passport tries to properly delegate every possible
// used property/method.

'use strict'

// Property/Method names to be delegated
let keys = [
  // passport
  '_passport',
  'authInfo',

  // http.IncomingMessage
  'httpVersion',
  'headers',
  'trailers',
  'setTimeout',
  'method',
  'url',
  'statusCode',
  'socket',
  'connection',
  'protocol',

  // Koa's context
  'cookies',
  'throw',
  'ip',

  // Others. Are not supported directly - require proper plugins/middlewares.
  'param',
  'params',
  'route',
  'xhr',
  'baseUrl',
  'session',
  'body',
  'flash'
]

// remove duplicates
keys = keys.filter(function(key, i, self) {
  return self.indexOf(key) === i
})

// create a delegate for each key
const properties = {
  // mock express' .get('trust proxy')
  app: {
    // getter returning a mock for `req.app` containing
    // the `.get()` method
    get: function() {
      const ctx = this.ctx
      return {
        get: function(key) {
          if (key === 'trust proxy') {
            return ctx.app.proxy
          }

          return undefined
        }
      }
    }
  }
}

keys.forEach(function(key) {
  properties[key] = {
    get: function() {
      const obj = getObject(this.ctx, key)
      if (!obj) return undefined

      // if its a function, call with the proper context
      if (typeof obj[key] === 'function') {
        return function() {
          return obj[key].apply(obj, arguments)
        }
      }

      // otherwise, simply return it
      return obj[key]
    },
    set: function(value) {
      const obj = getObject(this.ctx, key) || this.ctx.state
      obj[key] = value
    }
  }
})

// test where the key is available, either in `ctx.state`, Node's request,
// Koa's request or Koa's context
function getObject(ctx, key) {
  if (ctx.state && (key in ctx.state)) {
    return ctx.state
  }

  if (key in ctx.request) {
    return ctx.request
  }

  if (key in ctx.req) {
    return ctx.req
  }

  if (key in ctx) {
    return ctx
  }

  return undefined
}

const IncomingMessageExt = require('passport/lib/http/request')

exports.create = function(ctx, userProperty) {
  const req = Object.create(ctx.request, properties)

  Object.defineProperty(req, userProperty, {
    enumerable: true,
    get: function() {
      return ctx.state[userProperty]
    },
    set: function(val) {
      ctx.state[userProperty] = val
    }
  })

  Object.defineProperty(req, 'ctx', {
    enumerable: true,
    get: function() {
      return ctx
    }
  })

  // add passport http.IncomingMessage extensions
  req.login = IncomingMessageExt.logIn
  req.logIn = IncomingMessageExt.logIn
  req.logout = IncomingMessageExt.logOut
  req.logOut = IncomingMessageExt.logOut
  req.isAuthenticated = IncomingMessageExt.isAuthenticated
  req.isUnauthenticated = IncomingMessageExt.isUnauthenticated

  return req
}
