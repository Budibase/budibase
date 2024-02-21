export default class Helper {
  private name
  private fn
  private useValueFallback

  constructor(name, fn, useValueFallback = true) {
    this.name = name
    this.fn = fn
    this.useValueFallback = useValueFallback
  }

  register(handlebars) {
    // wrap the function so that no helper can cause handlebars to break
    handlebars.registerHelper(this.name, (value, info) => {
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
    })
  }

  unregister(handlebars) {
    handlebars.unregisterHelper(this.name)
  }
}
