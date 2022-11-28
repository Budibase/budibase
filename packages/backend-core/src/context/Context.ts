import { AsyncLocalStorage } from "async_hooks"

export default class Context {
  static storage = new AsyncLocalStorage<Record<string, any>>()

  static run(context: Record<string, any>, func: any) {
    return Context.storage.run(context, () => func())
  }

  static get(): Record<string, any> {
    return Context.storage.getStore() as Record<string, any>
  }

  static set(context: Record<string, any>) {
    Context.storage.enterWith(context)
  }
}
