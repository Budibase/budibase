import { createMockContext, createMockCookies } from "@shopify/jest-koa-mocks"
import { Ctx } from "@budibase/types"

export const newContext = (): Ctx => {
  const ctx = createMockContext() as Ctx
  return {
    ...ctx,
    path: "/",
    cookies: createMockCookies(),
    request: {
      ...ctx.request,
      headers: {},
      body: {},
    },
  }
}
