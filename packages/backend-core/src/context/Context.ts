import { AsyncLocalStorage } from "async_hooks"
import { ContextMap } from "./types"

export default class Context {
  static storage = new AsyncLocalStorage<ContextMap>()

  static run<T>(context: ContextMap, func: () => T) {
    return Context.storage.run(context, () => func())
  }

  static get(): ContextMap {
    return Context.storage.getStore() as ContextMap
  }
}
