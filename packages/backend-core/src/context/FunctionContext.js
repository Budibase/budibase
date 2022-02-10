const cls = require("cls-hooked")
const { newid } = require("../hashing")

const REQUEST_ID_KEY = "requestId"

class FunctionContext {
  static getMiddleware(updateCtxFn = null, contextName = "session") {
    const namespace = this.createNamespace(contextName)

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

  static run(callback, contextName = "session") {
    const namespace = this.createNamespace(contextName)

    return namespace.runAndReturn(callback)
  }

  static setOnContext(key, value, contextName = "session") {
    const namespace = this.createNamespace(contextName)
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

  static destroyNamespace(name = "session") {
    if (this._namespace) {
      cls.destroyNamespace(name)
      this._namespace = null
    }
  }

  static createNamespace(name = "session") {
    if (!this._namespace) {
      this._namespace = cls.createNamespace(name)
    }
    return this._namespace
  }
}

module.exports = FunctionContext
