import Router from "koa-router"

export type CtxFn = (ctx: any) => void

class Endpoint {
  method: string
  url: string
  controller: CtxFn
  middlewares: CtxFn[]

  constructor(method: string, url: string, controller: CtxFn) {
    this.method = method
    this.url = url
    this.controller = controller
    this.middlewares = []
  }

  addMiddleware(middleware: CtxFn) {
    this.middlewares.push(middleware)
    return this
  }

  apply(router: Router) {
    const method = this.method,
      url = this.url
    const middlewares = this.middlewares,
      controller = this.controller
    const params = [url, ...middlewares, controller]
    // @ts-ignore
    router[method](...params)
  }
}

export default Endpoint
