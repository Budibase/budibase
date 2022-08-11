'use strict'

/**
 * Module dependencies.
 */
const passport = require('passport')

/**
 * Passport's default/connect middleware.
 */
const _initialize   = require('passport/lib/middleware/initialize')
const _authenticate = require('passport/lib/middleware/authenticate')
const createReqMock = require('./request').create

/**
 * Passport's initialization middleware for Koa.
 *
 * @return {GeneratorFunction}
 * @api private
 */
function initialize(passport) {
  const middleware = promisify(_initialize(passport))
  return function passportInitialize(ctx, next) {
    // koa <-> connect compatibility:
    const userProperty = passport._userProperty || 'user'
    // check ctx.req has the userProperty
    if (!ctx.req.hasOwnProperty(userProperty)) {
      Object.defineProperty(ctx.req, userProperty, {
        enumerable: true,
        get: function() {
          return ctx.state[userProperty]
        },
        set: function(val) {
          ctx.state[userProperty] = val
        }
      })
    }

    // create mock object for express' req object
    const req = createReqMock(ctx, userProperty)


    // add Promise-based login method
    const login  = req.login
    ctx.login = ctx.logIn = function(user, options) {
      return new Promise((resolve, reject) => {
        login.call(req, user, options, err => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    // add aliases for passport's request extensions to Koa's context
    ctx.logout = ctx.logOut = req.logout.bind(req)
    ctx.isAuthenticated     = req.isAuthenticated.bind(req)
    ctx.isUnauthenticated   = req.isUnauthenticated.bind(req)

    return middleware(req, ctx).then(function() {
      return next()
    })
  }
}

/**
 * Passport's authenticate middleware for Koa.
 *
 * @param {String|Array} name
 * @param {Object} options
 * @param {GeneratorFunction} callback
 * @return {GeneratorFunction}
 * @api private
 */
function authenticate(passport, name, options, callback) {
  // normalize arguments
  if (typeof options === 'function') {
    callback = options
    options  = {}
  }
  options = options || {}

  if (callback) {
    // When the callback is set, neither `next`, `res.redirect` or `res.end`
    // are called. That is, a workaround to catch the `callback` is required.
    // The `passportAuthenticate()` method below will therefore set
    // `callback.resolve` and `callback.reject`. Then, once the authentication
    // finishes, the modified callback calls the original one and afterwards
    // triggers either `callback.resolve` or `callback.reject` to inform
    // `passportAuthenticate()` that we are ready.
    const _callback = callback
    callback = function(err, user, info, status) {
      try {
        Promise.resolve(_callback(err, user, info, status))
               .then(() => callback.resolve(false))
               .catch(err => callback.reject(err))
      } catch (err) {
        callback.reject(err)
      }
    }
  }

  const middleware = promisify(_authenticate(passport, name, options, callback))

  return function passportAuthenticate(ctx, next) {
    // this functions wraps the connect middleware
    // to catch `next`, `res.redirect` and `res.end` calls
    const p = new Promise((resolve, reject) => {
      // mock the `req` object
      const req = createReqMock(ctx, options.assignProperty || passport._userProperty || 'user')

      function setBodyAndResolve(content) {
        if (content) ctx.body = content
        resolve(false)
      }

      // mock the `res` object
      const res = {
        redirect: function(url) {
          ctx.redirect(url)
          resolve(false)
        },
        set: ctx.set.bind(ctx),
        setHeader: ctx.set.bind(ctx),
        end: setBodyAndResolve,
        send: setBodyAndResolve,
        set statusCode(status) {
          ctx.status = status
        },
        get statusCode() {
          return ctx.status
        }
      }

      req.res = res

      // update the custom callback above
      if (callback) {
        callback.resolve = resolve
        callback.reject  = reject
      }

      // call the connect middleware
      middleware(req, res).then(resolve, reject)
    })

    return p.then(cont => {
      // cont equals `false` when `res.redirect` or `res.end` got called
      // in this case, call next to continue through Koa's middleware stack
      if (cont !== false) {
        return next()
      }
    })
  }
}

/**
 * Passport's authorize middleware for Koa.
 *
 * @param {String|Array} name
 * @param {Object} options
 * @param {GeneratorFunction} callback
 * @return {GeneratorFunction}
 * @api private
 */
function authorize(passport, name, options, callback) {
  options = options || {}
  options.assignProperty = 'account'

  return authenticate(passport, name, options, callback)
}

/**
 * Framework support for Koa.
 *
 * This module provides support for using Passport with Koa. It exposes
 * middleware that conform to the `fn*(next)` signature and extends
 * Node's built-in HTTP request object with useful authentication-related
 * functions.
 *
 * @return {Object}
 * @api protected
 */
module.exports = function() {
  return {
    initialize:   initialize,
    authenticate: authenticate,
    authorize:    authorize
  }
}

function promisify(expressMiddleware) {
  return function(req, res) {
    return new Promise(function(resolve, reject) {
      expressMiddleware(req, res, function(err, result) {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }
}
