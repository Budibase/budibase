class Helper {
  constructor(name, fn) {
    this.name = name
    this.fn = fn
  }

  register(handlebars) {
    // wrap the function so that no helper can cause handlebars to break
    handlebars.registerHelper(this.name, value => {
      return this.fn(value) || value
    })
  }

  unregister(handlebars) {
    handlebars.unregisterHelper(this.name)
  }
}

module.exports = Helper
