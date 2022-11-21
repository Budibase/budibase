import { AsyncLocalStorage } from "async_hooks"
import { ContextMap } from "./constants"

export default class Context {
  static storage = new AsyncLocalStorage<ContextMap>()

  static run(context: ContextMap, func: any) {
    return Context.storage.run(context, () => func())
  }

  static get(): ContextMap {
    return Context.storage.getStore() as ContextMap
  }

  static set(context: ContextMap) {
    Context.storage.enterWith(context)
  }
}
