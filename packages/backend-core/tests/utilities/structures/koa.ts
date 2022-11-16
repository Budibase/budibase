import { createMockContext } from "@shopify/jest-koa-mocks"
import { BBContext } from "@budibase/types"

export const newContext = (): BBContext => {
  const ctx = createMockContext()
  return {
    ...ctx,
    request: {
      ...ctx.request,
      body: {},
    },
  }
}
