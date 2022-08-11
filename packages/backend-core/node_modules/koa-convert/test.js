/* global describe, it */

'use strict'

const co = require('co')
const Koa = require('koa')
const KoaV1 = require('koa-v1')
const assert = require('assert')
const convert = require('./index')
const request = require('supertest')

describe('convert()', () => {
  it('should work', () => {
    let call = []
    let ctx = {}
    let mw = convert(function * (next) {
      assert.ok(ctx === this)
      call.push(1)
    })

    return mw(ctx, function () {
      call.push(2)
    }).then(function () {
      assert.deepEqual(call, [1])
    })
  })

  it('should inherit the original middleware name', () => {
    let mw = convert(function * testing (next) {})
    assert.strictEqual(mw._name, 'testing')
  })

  it('should work with `yield next`', () => {
    let call = []
    let ctx = {}
    let mw = convert(function * (next) {
      assert.ok(ctx === this)
      call.push(1)
      yield next
      call.push(3)
    })

    return mw(ctx, function () {
      call.push(2)
      return Promise.resolve()
    }).then(function () {
      assert.deepEqual(call, [1, 2, 3])
    })
  })

  it('should work with `yield* next`', () => {
    let call = []
    let ctx = {}
    let mw = convert(function * (next) {
      assert.ok(ctx === this)
      call.push(1)
      yield* next
      call.push(3)
    })

    return mw(ctx, function () {
      call.push(2)
      return Promise.resolve()
    }).then(function () {
      assert.deepEqual(call, [1, 2, 3])
    })
  })
})

describe('convert.compose()', () => {
  it('should work', () => {
    let call = []
    let context = {}
    let _context
    let mw = convert.compose([
      function * name (next) {
        call.push(1)
        yield next
        call.push(11)
      },
      (ctx, next) => {
        call.push(2)
        return next().then(() => {
          call.push(10)
        })
      },
      function * (next) {
        call.push(3)
        yield* next
        call.push(9)
      },
      co.wrap(function * (ctx, next) {
        call.push(4)
        yield next()
        call.push(8)
      }),
      function * (next) {
        try {
          call.push(5)
          yield next
        } catch (e) {
          call.push(7)
        }
      },
      (ctx, next) => {
        _context = ctx
        call.push(6)
        throw new Error()
      }
    ])

    return mw(context).then(() => {
      assert.equal(context, _context)
      assert.deepEqual(call, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    })
  })

  it('should work too', () => {
    let call = []
    let context = {}
    let _context
    let mw = convert.compose(
      (ctx, next) => {
        call.push(1)
        return next().catch(() => {
          call.push(4)
        })
      },
      function * (next) {
        call.push(2)
        yield next
        call.push(-1) // should not call this
      },
      function * (next) {
        call.push(3)
        yield* next
        call.push(-1) // should not call this
      },
      (ctx, next) => {
        _context = ctx
        return Promise.reject(new Error())
      }
    )

    return mw(context).then(() => {
      assert.equal(context, _context)
      assert.deepEqual(call, [1, 2, 3, 4])
    })
  })
})

describe('convert.back()', () => {
  it('should work with koa 1', done => {
    let app = new KoaV1()

    app.use(function * (next) {
      this.body = [1]
      yield next
      this.body.push(6)
    })

    app.use(convert.back((ctx, next) => {
      ctx.body.push(2)
      return next().then(() => {
        ctx.body.push(5)
      })
    }))

    app.use(convert.back(co.wrap(function * (ctx, next) {
      ctx.body.push(3)
      yield next()
      ctx.body.push(4)
    })))

    request(app.callback())
      .get('/')
      .expect(200, [1, 2, 3, 4, 5, 6])
      .end(done)
  })

  it('should guard multiple calls', done => {
    let app = new KoaV1()

    app.use(function * (next) {
      try {
        this.body = [1]
        yield next
      } catch (e) {
        this.body.push(e.message)
      }
    })

    app.use(convert.back(co.wrap(function * (ctx, next) {
      ctx.body.push(2)
      yield next()
      yield next() // this should throw new Error('next() called multiple times')
    })))

    request(app.callback())
      .get('/')
      .expect(200, [1, 2, 'next() called multiple times'])
      .end(done)
  })

  it('should inherit the original middleware name', () => {
    let mw = convert.back(function testing (ctx, next) {})
    assert.strictEqual(mw._name, 'testing')
  })
})

describe('migration snippet', () => {
  let app = new Koa()

  // snippet
  const _use = app.use
  app.use = x => _use.call(app, convert(x))
  // end

  app.use((ctx, next) => {
    ctx.body = [1]
    return next().then(() => {
      ctx.body.push(9)
    })
  })

  app.use(function * (next) {
    this.body.push(2)
    yield next
    this.body.push(8)
  })

  app.use(function * (next) {
    this.body.push(3)
    yield* next
    this.body.push(7)
  })

  app.use(co.wrap(function * (ctx, next) {
    ctx.body.push(4)
    yield next()
    ctx.body.push(6)
  }))

  app.use(ctx => {
    ctx.body.push(5)
  })

  it('should work', done => {
    request(app.callback())
      .get('/')
      .expect(200, [1, 2, 3, 4, 5, 6, 7, 8, 9])
      .end(done)
  })
})
