# koa-passport

[Passport](https://github.com/jaredhanson/passport) middleware for Koa

[![NPM][npm]](https://npmjs.org/package/koa-passport)
[![Dependency Status][dependencies]](https://david-dm.org/rkusa/koa-passport)
[![Build Status][travis]](https://travis-ci.org/rkusa/koa-passport)

koa-passport version  | koa version | branch
--------------------- | ------------| ------
1.x                   | 1.x         | v1.x
2.x                   | 2.x         | v2.x
4.x                   | 2.x         | master

## Migration to `v3`

- change `ctx.passport.*` to `ctx.state.*` (e.g. `ctx.passport.user` to `ctx.state.user`)
- don't call passport methods on `ctx.req` (e.g. use `ctx.login` instead of `ctx.req.login`)
- update custom authentication callback arguments to `err, user, info, status` (e.g. `passport.authenticate('local', function(err, user, info, status) { ... })(ctx, next)`)

## Usage

```js
// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// Sessions
const session = require('koa-session')
app.keys = ['secret']
app.use(session({}, app))

const passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())
```

[Example Application](https://github.com/rkusa/koa-passport-example)

Passport's values and methods are exposed as follows:

```js
app.use(async ctx => {
  ctx.isAuthenticated()
  ctx.isUnauthenticated()
  await ctx.login()
  ctx.logout()
  ctx.state.user
})
```

## License

  [MIT](LICENSE)

[npm]: http://img.shields.io/npm/v/koa-passport.svg
[dependencies]: http://img.shields.io/david/rkusa/koa-passport.svg
[travis]: https://travis-ci.org/rkusa/koa-passport.svg?branch=master
