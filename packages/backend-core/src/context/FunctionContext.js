const cls = require("../clshooked")
const { newid } = require("../hashing")

const REQUEST_ID_KEY = "requestId"
const MAIN_CTX = cls.createNamespace("main")

function getContextStorage(namespace) {
  if (namespace && namespace.active) {
    let contextData = namespace.active
    delete contextData.id
    delete contextData._ns_name
    return contextData
  }
  return {}
}

class FunctionContext {
  static run(callback) {
    return MAIN_CTX.runAndReturn(async () => {
      const namespaceId = newid()
      MAIN_CTX.set(REQUEST_ID_KEY, namespaceId)
      const namespace = cls.createNamespace(namespaceId)
      let response = await namespace.runAndReturn(callback)
      cls.destroyNamespace(namespaceId)
      return response
    })
  }

  static setOnContext(key, value) {
    const namespaceId = MAIN_CTX.get(REQUEST_ID_KEY)
    const namespace = cls.getNamespace(namespaceId)
    namespace.set(key, value)
  }

  static getFromContext(key) {
    const namespaceId = MAIN_CTX.get(REQUEST_ID_KEY)
    const namespace = cls.getNamespace(namespaceId)
    const context = getContextStorage(namespace)
    if (context) {
      return context[key]
    } else {
      return null
    }
  }
}

module.exports = FunctionContext
