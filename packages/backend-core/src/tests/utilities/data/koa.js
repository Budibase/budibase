const { createMockContext } = require("@shopify/jest-koa-mocks")

exports.newContext = () => {
  return createMockContext()
}
