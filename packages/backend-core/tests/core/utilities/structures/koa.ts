import { createMockContext, createMockCookies } from "@shopify/jest-koa-mocks"

export const newContext = () => {
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
