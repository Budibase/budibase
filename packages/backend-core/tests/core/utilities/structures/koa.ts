import { createMockContext, createMockCookies } from "@shopify/jest-koa-mocks"
import { createUserAgent } from "../../../src/middleware/userAgent"
import { Ctx } from "@budibase/types"

export const newContext = (): Ctx => {
  const ctx = createMockContext({
    throw: jest.fn().mockImplementation(() => {
      throw new Error()
    }),
  }) as unknown as Ctx

  ctx.back = jest.fn()
  ctx.path = "/"
  ctx.params = (ctx.params ?? {}) as Ctx["params"]
  ctx.state = (ctx.state ?? {}) as Ctx["state"]
  ctx.cookies = createMockCookies()
  ctx.request = {
    ...ctx.request,
    headers: ctx.request.headers ?? {},
    body: ctx.request.body ?? {},
  }
  ctx.userAgent = createUserAgent()
  ctx.body = ctx.body ?? {}

  return ctx
}
