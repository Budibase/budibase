import Endpoint, { CtxFn, Method } from "./Endpoint"
import Router from "@koa/router"

type ArrayOneOrMore<T> = {
  0: T
} & Array<T>

export default class EndpointGroup {
  endpoints: Endpoint[] = []
  middlewares: CtxFn[] = []
  outputMiddlewares: CtxFn[] = []
  applied = false
  // if locked, can't add anymore middlewares
  private locked = false

  addGroupMiddleware(middleware: CtxFn) {
    if (this.locked) {
      throw new Error("Group locked, no more middleware can be added.")
    }
    this.middlewares.push(middleware)
    return this
  }

  addGroupMiddlewareOutput(middleware: CtxFn) {
    if (this.locked) {
      throw new Error("Group locked, no more middleware can be added.")
    }
    this.outputMiddlewares.push(middleware)
    return this
  }

  private addEndpoint(method: Method, url: string, ...fns: CtxFn[]) {
    let controller = fns.pop()!
    const endpoint = new Endpoint(method, url, controller)
    if (fns.length !== 0) {
      for (const fn of fns) {
        endpoint.addMiddleware(fn)
      }
    }
    this.endpoints.push(endpoint)
    return this
  }

  lockMiddleware() {
    this.locked = true
  }

  post(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("post", url, ...fns)
  }

  patch(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("patch", url, ...fns)
  }

  put(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("put", url, ...fns)
  }

  get(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("get", url, ...fns)
  }

  delete(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("delete", url, ...fns)
  }

  head(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("head", url, ...fns)
  }

  apply(router?: Router): Router {
    if (this.applied) {
      throw new Error("Already applied to router")
    }
    if (!router) {
      router = new Router()
    }
    this.applied = true
    for (const endpoint of this.endpoints) {
      this.middlewares.forEach(middleware => endpoint.addMiddleware(middleware))
      this.outputMiddlewares.forEach(middleware =>
        endpoint.addOutputMiddleware(middleware)
      )
      endpoint.apply(router)
    }
    return router
  }
}
