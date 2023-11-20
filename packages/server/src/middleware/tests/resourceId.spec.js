const {
  paramResource,
  paramSubResource,
  bodyResource,
  bodySubResource,
  ResourceIdGetter,
} = require("../resourceId")

class TestConfiguration {
  constructor(middleware) {
    this.middleware = middleware
    this.ctx = {
      request: {},
    }
    this.next = jest.fn()
  }

  setParams(params) {
    this.ctx.params = params
  }

  setBody(body) {
    this.ctx.body = body
  }

  executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }
}

describe("resourceId middleware", () => {
  it("calls next() when there is no request object to parse", () => {
    const config = new TestConfiguration(paramResource("main"))

    config.executeMiddleware()

    expect(config.next).toHaveBeenCalled()
    expect(config.ctx.resourceId).toBeUndefined()
  })

  it("generates a resourceId middleware for context query parameters", () => {
    const config = new TestConfiguration(paramResource("main"))
    config.setParams({
      main: "test",
    })

    config.executeMiddleware()

    expect(config.ctx.resourceId).toEqual("test")
  })

  it("generates a resourceId middleware for context query sub parameters", () => {
    const config = new TestConfiguration(paramSubResource("main", "sub"))
    config.setParams({
      main: "main",
      sub: "test",
    })

    config.executeMiddleware()

    expect(config.ctx.resourceId).toEqual("main")
    expect(config.ctx.subResourceId).toEqual("test")
  })

  it("generates a resourceId middleware for context request body", () => {
    const config = new TestConfiguration(bodyResource("main"))
    config.setBody({
      main: "test",
    })

    config.executeMiddleware()

    expect(config.ctx.resourceId).toEqual("test")
  })

  it("generates a resourceId middleware for context request body sub fields", () => {
    const config = new TestConfiguration(bodySubResource("main", "sub"))
    config.setBody({
      main: "main",
      sub: "test",
    })

    config.executeMiddleware()

    expect(config.ctx.resourceId).toEqual("main")
    expect(config.ctx.subResourceId).toEqual("test")
  })

  it("parses resourceIds correctly for custom middlewares", () => {
    const middleware = new ResourceIdGetter("body")
      .mainResource("custom")
      .subResource("customSub")
      .build()
    let config = new TestConfiguration(middleware)
    config.setBody({
      custom: "test",
      customSub: "subtest",
    })

    config.executeMiddleware()

    expect(config.ctx.resourceId).toEqual("test")
    expect(config.ctx.subResourceId).toEqual("subtest")
  })
})
