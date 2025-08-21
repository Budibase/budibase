import Endpoint, { CtxFn, Method } from "./Endpoint"
import Router from "@koa/router"

type ArrayOneOrMore<T> = [T, ...T[]]

export default class EndpointGroup {
  endpoints: Endpoint[] = []
  middlewares: { fn: CtxFn; first: boolean }[] = []
  outputMiddlewares: { fn: CtxFn; first: boolean }[] = []
  applied = false
  // if locked, can't add anymore middlewares
  private locked = false

  addGroupMiddleware(
    middleware: CtxFn,
    opts: { first: boolean } = { first: true }
  ) {
    if (this.locked) {
      throw new Error("Group locked, no more middleware can be added.")
    }
    this.middlewares.push({ fn: middleware, first: opts.first })
    return this
  }

  addGroupMiddlewareOutput(
    middleware: CtxFn,
    opts: { first: boolean } = { first: false }
  ) {
    if (this.locked) {
      throw new Error("Group locked, no more middleware can be added.")
    }
    this.outputMiddlewares.push({ fn: middleware, first: opts.first })
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
    const endpoints = this.endpointList()
    if (!router) {
      router = new Router()
    }
    for (const endpoint of endpoints) {
      endpoint.apply(router)
    }
    return router
  }

  endpointList(): Endpoint[] {
    if (this.applied) {
      throw new Error("Already applied to router")
    }
    this.applied = true
    for (const endpoint of this.endpoints) {
      this.middlewares.forEach(({ fn, first }) =>
        endpoint.addMiddleware(fn, { first })
      )
      this.outputMiddlewares.forEach(({ fn, first }) =>
        endpoint.addOutputMiddleware(fn, { first })
      )
    }
    return this.endpoints
  }
}
