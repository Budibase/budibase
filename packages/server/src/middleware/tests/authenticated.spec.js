const { AuthTypes } = require("../../constants")
const authenticatedMiddleware  = require("../authenticated")

class TestConfiguration {
  constructor(middleware) {
    this.middleware = authenticatedMiddleware
    this.ctx = {
      auth: {},
      request: {},
      cookies: {
        set: jest.fn(),
        get: jest.fn()
      },
      headers: {},
      params: {},
      path: "",
      request: {
        headers: {}
      }
    }
    this.next = jest.fn()
  }

  setHeaders(headers) {
    this.ctx.headers = headers
  }

  executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }
}

describe("Authenticated middleware", () => {
  let config

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls next() when on the builder path", async () => {
    config.ctx.path = "/_builder"

    await config.executeMiddleware()

    expect(config.next).toHaveBeenCalled()
  })

  it("sets a new cookie when the current cookie does not match the app id from context", async () => {
    const appId = "app_123"
    config.ctx.cookies.get.mockImplementationOnce(() => "cookieAppId")
    config.setHeaders({
      "x-budibase-app-id": appId 
    })

    await config.executeMiddleware()

    expect(config.ctx.cookies.set).toHaveBeenCalledWith(
      "budibase:currentapp:local", 
      appId,
      expect.any(Object)
    )

  })

  fit("sets a BUILDER auth type when the x-budibase-type header is not 'client'", async () => {
    config.ctx.cookies.get.mockImplementationOnce(() => `budibase:builder:local`)

    await config.executeMiddleware()

    expect(config.ctx.auth.authenticated).toEqual(AuthTypes.BUILDER)
  })

  it("assigns an APP auth type when the user is not in the builder", async () => {
    config.setHeaders({
      "x-budibase-type": "client"
    })
    config.ctx.cookies.get.mockImplementationOnce(() => `budibase:builder:local`)

    await config.executeMiddleware()

    expect(config.ctx.auth.authenticated).toEqual(AuthTypes.APP)
  })

  it("marks the user as unauthenticated when a token cannot be determined from the users cookie", async () => {
    config.executeMiddleware()
    expect()
  })

  it("verifies the users JWT token and sets the user information in context when successful", async () => {
    config.executeMiddleware()
    expect()
  })

  it("clears the cookie when there is an error authenticating in the builder", async () => {
    config.executeMiddleware()
    expect()
  })
})