import { createMockContext, createMockCookies } from "@shopify/jest-koa-mocks"
import { BBContext } from "@budibase/types"

export const newContext = (): BBContext => {
  const ctx = createMockContext()
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
