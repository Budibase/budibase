const { AuthTypes } = require("../../constants")
const authenticatedMiddleware = require("../authenticated")
const jwt = require("jsonwebtoken")
jest.mock("jsonwebtoken")

class TestConfiguration {
  constructor(middleware) {
    this.middleware = authenticatedMiddleware
    this.ctx = {
      config: {},
      auth: {},
      cookies: {
        set: jest.fn(),
        get: jest.fn(),
      },
      headers: {},
      params: {},
      path: "",
      request: {
        headers: {},
      },
      throw: jest.fn(),
    }
    this.next = jest.fn()
  }

  setHeaders(headers) {
    this.ctx.headers = headers
  }

  executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }

  afterEach() {
    jest.resetAllMocks()
  }
}

describe("Authenticated middleware", () => {
  let config

  beforeEach(() => {
    config = new TestConfiguration()
  })

  afterEach(() => {
    config.afterEach()
  })

  it("calls next() when on the builder path", async () => {
    config.ctx.path = "/builder"

    await config.executeMiddleware()

    expect(config.next).toHaveBeenCalled()
  })

  it("sets a new cookie when the current cookie does not match the app id from context", async () => {
    const appId = "app_123"
    config.setHeaders({
      "x-budibase-app-id": appId,
    })
    config.ctx.cookies.get.mockImplementation(() => "cookieAppId")

    await config.executeMiddleware()

    expect(config.ctx.cookies.set).toHaveBeenCalledWith(
      "budibase:currentapp:local",
      appId,
      expect.any(Object)
    )
  })

  it("sets the correct BUILDER auth type information when the x-budibase-type header is not 'client'", async () => {
    config.ctx.cookies.get.mockImplementation(() => "budibase:builder:local")
    jwt.verify.mockImplementationOnce(() => ({
      apiKey: "1234",
      roleId: "BUILDER",
    }))

    await config.executeMiddleware()

    expect(config.ctx.auth.authenticated).toEqual(AuthTypes.BUILDER)
    expect(config.ctx.user).toMatchSnapshot()
  })

  it("sets the correct APP auth type information when the user is not in the builder", async () => {
    config.setHeaders({
      "x-budibase-type": "client",
    })
    config.ctx.cookies.get.mockImplementation(() => `budibase:app:local`)
    jwt.verify.mockImplementationOnce(() => ({
      apiKey: "1234",
      roleId: "ADMIN",
    }))

    await config.executeMiddleware()

    expect(config.ctx.auth.authenticated).toEqual(AuthTypes.APP)
    expect(config.ctx.user).toMatchSnapshot()
  })

  it("marks the user as unauthenticated when a token cannot be determined from the users cookie", async () => {
    config.executeMiddleware()
    expect(config.ctx.auth.authenticated).toBe(false)
    expect(config.ctx.user.role).toEqual({
      _id: "PUBLIC",
      name: "Public",
      permissionId: "public",
    })
  })

  it("clears the cookie when there is an error authenticating in the builder", async () => {
    config.ctx.cookies.get.mockImplementation(() => "budibase:builder:local")
    jwt.verify.mockImplementationOnce(() => {
      throw new Error()
    })

    await config.executeMiddleware()

    expect(config.ctx.cookies.set).toBeCalledWith("budibase:builder:local")
  })
})
