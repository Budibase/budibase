import Handlebars from "handlebars"

export default class Helper {
  private name: any
  private fn: any
  private useValueFallback: boolean

  constructor(name: string, fn: any, useValueFallback = true) {
    this.name = name
    this.fn = fn
    this.useValueFallback = useValueFallback
  }

  register(handlebars: typeof Handlebars) {
    // wrap the function so that no helper can cause handlebars to break
    handlebars.registerHelper(
      this.name,
      (value: any, info: { data: { root: {} } }) => {
        let context = {}
        if (info && info.data && info.data.root) {
          context = info.data.root
        }
        const result = this.fn(value, context)
        if (result == null) {
          return this.useValueFallback ? value : null
        } else {
          return result
        }
      }
    )
  }

  unregister(handlebars: { unregisterHelper: any }) {
    handlebars.unregisterHelper(this.name)
  }
}
