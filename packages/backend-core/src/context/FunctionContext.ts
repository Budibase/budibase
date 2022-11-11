import cls from "../clshooked"
import { newid } from "../hashing"

const REQUEST_ID_KEY = "requestId"
const MAIN_CTX = cls.createNamespace("main")

function getContextStorage(namespace: any) {
  if (namespace && namespace.active) {
    let contextData = namespace.active
    delete contextData.id
    delete contextData._ns_name
    return contextData
  }
  return {}
}

class FunctionContext {
  static run(callback: any) {
    return MAIN_CTX.runAndReturn(async () => {
      const namespaceId = newid()
      MAIN_CTX.set(REQUEST_ID_KEY, namespaceId)
      const namespace = cls.createNamespace(namespaceId)
      let response = await namespace.runAndReturn(callback)
      cls.destroyNamespace(namespaceId)
      return response
    })
  }

  static setOnContext(key: string, value: any) {
    const namespaceId = MAIN_CTX.get(REQUEST_ID_KEY)
    const namespace = cls.getNamespace(namespaceId)
    namespace.set(key, value)
  }

  static getFromContext(key: string) {
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

export = FunctionContext
