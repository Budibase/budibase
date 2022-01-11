const cls = require("cls-hooked")
const { newid } = require("../hashing")

const REQUEST_ID_KEY = "requestId"

class FunctionContext {
  static getMiddleware(updateCtxFn = null) {
    const namespace = this.createNamespace()

    return async function (ctx, next) {
      await new Promise(
        namespace.bind(function (resolve, reject) {
          // store a contextual request ID that can be used anywhere (audit logs)
          namespace.set(REQUEST_ID_KEY, newid())
          namespace.bindEmitter(ctx.req)
          namespace.bindEmitter(ctx.res)

          if (updateCtxFn) {
            updateCtxFn(ctx)
          }
          next().then(resolve).catch(reject)
        })
      )
    }
  }

  static run(callback) {
    const namespace = this.createNamespace()

    return namespace.runAndReturn(callback)
  }

  static setOnContext(key, value) {
    const namespace = this.createNamespace()
    namespace.set(key, value)
  }

  static getContextStorage() {
    if (this._namespace && this._namespace.active) {
      let contextData = this._namespace.active
      delete contextData.id
      delete contextData._ns_name
      return contextData
    }

    return {}
  }

  static getFromContext(key) {
    const context = this.getContextStorage()
    if (context) {
      return context[key]
    } else {
      return null
    }
  }

  static destroyNamespace() {
    if (this._namespace) {
      cls.destroyNamespace("session")
      this._namespace = null
    }
  }

  static createNamespace() {
    if (!this._namespace) {
      this._namespace = cls.createNamespace("session")
    }
    return this._namespace
  }
}

module.exports = FunctionContext
