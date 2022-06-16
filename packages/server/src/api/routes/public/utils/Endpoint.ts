import Router from "@koa/router"

export type CtxFn = (ctx: any, next?: any) => void | Promise<any>

class Endpoint {
  method: string
  url: string
  controller: CtxFn
  middlewares: CtxFn[]
  outputMiddlewares: CtxFn[]

  constructor(method: string, url: string, controller: CtxFn) {
    this.method = method
    this.url = url
    this.controller = controller
    this.middlewares = []
    this.outputMiddlewares = []
  }

  addMiddleware(middleware: CtxFn) {
    this.middlewares.push(middleware)
    return this
  }

  addOutputMiddleware(middleware: CtxFn) {
    this.outputMiddlewares.push(middleware)
    return this
  }

  apply(router: Router) {
    const method = this.method,
      url = this.url
    const middlewares = this.middlewares,
      controller = this.controller,
      outputMiddlewares = this.outputMiddlewares
    // need a function to do nothing to stop the execution at the end
    // middlewares are circular so if they always keep calling next, it'll just keep looping
    const complete = () => {}
    const params = [
      url,
      ...middlewares,
      controller,
      ...outputMiddlewares,
      complete,
    ]
    // @ts-ignore
    router[method](...params)
  }
}

export default Endpoint
