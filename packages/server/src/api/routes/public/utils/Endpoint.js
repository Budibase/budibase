class Endpoint {
  constructor(method, url, controller) {
    this.method = method
    this.url = url
    this.controller = controller
    this.middlewares = []
  }

  addMiddleware(middleware) {
    this.middlewares.push(middleware)
    return this
  }

  apply(router) {
    const method = this.method,
      url = this.url
    const middlewares = this.middlewares,
      controller = this.controller
    const params = [url, ...middlewares, controller]
    router[method](...params)
  }
}

module.exports = Endpoint
