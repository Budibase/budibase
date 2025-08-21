import Router from "@koa/router"
import { UserCtx, Ctx } from "@budibase/types"
import { Next } from "koa"

export type Method = "post" | "put" | "patch" | "get" | "delete" | "head"

export type UserCtxWithNextFn = (
  ctx: UserCtx,
  next: Next
) => void | Promise<unknown>
export type CtxWithNextFn = (ctx: Ctx, next: Next) => void | Promise<unknown>
export type UserCtxWithoutNextFn = (ctx: UserCtx) => void | Promise<unknown>
export type CtxWithoutNextFn = (ctx: Ctx) => void | Promise<unknown>
export type CtxFn =
  | UserCtxWithNextFn
  | UserCtxWithoutNextFn
  | CtxWithNextFn
  | CtxWithoutNextFn

class Endpoint {
  method: Method
  url: string
  controller: CtxFn
  middlewares: CtxFn[]
  outputMiddlewares: CtxFn[]

  constructor(method: Method, url: string, controller: CtxFn) {
    this.method = method
    this.url = url
    this.controller = controller
    this.middlewares = []
    this.outputMiddlewares = []
  }

  addMiddleware(middleware: CtxFn, opts?: { first?: boolean }) {
    if (opts?.first) {
      this.middlewares.unshift(middleware)
    } else {
      this.middlewares.push(middleware)
    }
    return this
  }

  addOutputMiddleware(middleware: CtxFn, opts?: { first?: boolean }) {
    if (opts?.first) {
      this.outputMiddlewares.unshift(middleware)
    } else {
      this.outputMiddlewares.push(middleware)
    }
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
