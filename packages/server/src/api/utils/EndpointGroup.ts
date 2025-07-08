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

  addGroupMiddleware(middleware: CtxFn) {
    this.middlewares.push(middleware)
    return this
  }

  addGroupMiddlewareOutput(middleware: CtxFn) {
    this.outputMiddlewares.push(middleware)
    return this
  }

  private addEndpoint(
    method: Method,
    url: string,
    ...fns: ArrayOneOrMore<CtxFn>
  ) {
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

  post(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("post", url, fns[0], ...fns)
  }

  patch(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("patch", url, fns[0], ...fns)
  }

  put(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("put", url, fns[0], ...fns)
  }

  get(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("get", url, fns[0], ...fns)
  }

  delete(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("delete", url, fns[0], ...fns)
  }

  head(url: string, ...fns: ArrayOneOrMore<CtxFn>) {
    return this.addEndpoint("head", url, fns[0], ...fns)
  }

  apply(router: Router) {
    if (this.applied) {
      throw new Error("Already applied to router")
    }
    this.applied = true
    for (const endpoint of this.endpoints) {
      this.middlewares.forEach(middleware => endpoint.addMiddleware(middleware))
      this.outputMiddlewares.forEach(middleware =>
        endpoint.addOutputMiddleware(middleware)
      )
      endpoint.apply(router)
    }
  }
}
