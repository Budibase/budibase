const authorizedMiddleware = require("../authorized")
const env = require("../../environment")
const apiKey = require("../../utilities/security/apikey")
const { AuthTypes } = require("../../constants")
const { PermissionTypes, PermissionLevels } = require("../../utilities/security/permissions")
const { Test } = require("supertest")
jest.mock("../../environment")
jest.mock("../../utilities/security/apikey")

class TestConfiguration {
  constructor(role) {
    this.middleware = authorizedMiddleware(role)
    this.next = jest.fn()
    this.throw = jest.fn()
    this.ctx = {
      headers: {},
      request: {
        url: ""
      },
      auth: {},
      next: this.next,
      throw: this.throw
    }
  }

  executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }

  setUser(user) {
    this.ctx.user = user
  }

  setMiddlewareRequiredPermission(...perms) {
    this.middleware = authorizedMiddleware(...perms)
  }

  setResourceId(id) {
    this.ctx.resourceId = id
  }

  setAuthenticated(isAuthed) {
    this.ctx.auth = { authenticated: isAuthed }
  }

  setRequestUrl(url) {
    this.ctx.request.url = url
  }

  setCloudEnv(isCloud) {
    env.CLOUD = isCloud
  }

  setRequestHeaders(headers) {
    this.ctx.headers = headers 
  }

  afterEach() {
    jest.clearAllMocks()
  }
}


describe("Authorization middleware", () => {
  const next = jest.fn()
  let config

  afterEach(() => {
    config.afterEach()
  })

  beforeEach(() => {
    config = new TestConfiguration()
  }) 

  it("passes the middleware for local webhooks", async () => {
    config.setRequestUrl("https://something/webhooks/trigger")
    await config.executeMiddleware()
    expect(config.next).toHaveBeenCalled()
  })

  describe("external web hook call", () => {
    let ctx = {}
    let middleware

    beforeEach(() => {
      config = new TestConfiguration()
      config.setCloudEnv(true)
      config.setRequestHeaders({
        "x-api-key": "abc123",
        "x-instanceid": "instance123",
      })
    })

    it("passes to next() if api key is valid", async () => {
      apiKey.isAPIKeyValid.mockResolvedValueOnce(true)

      await config.executeMiddleware()

      expect(config.next).toHaveBeenCalled()
      expect(config.ctx.auth).toEqual({
        authenticated: AuthTypes.EXTERNAL,
        apiKey: config.ctx.headers["x-api-key"],
      })
      expect(config.ctx.user).toEqual({
        appId: config.ctx.headers["x-instanceid"],
      })
    })

    it("throws if api key is invalid", async () => {
      apiKey.isAPIKeyValid.mockResolvedValueOnce(false)

      await config.executeMiddleware()

      expect(config.throw).toHaveBeenCalledWith(403, "API key invalid")
    })
  })

  describe("non-webhook call", () => {
    let config

    beforeEach(() => {
      config = new TestConfiguration()
      config.setCloudEnv(true)
      config.setAuthenticated(true)
    })

    it("throws when no user data is present in context", async () => {
      await config.executeMiddleware()

      expect(config.throw).toHaveBeenCalledWith(403, "No user info found")
    })

    it("passes on to next() middleware if user is an admin", async () => {
      config.setUser({
        role: {
          _id: "ADMIN",
        }
      })

      await config.executeMiddleware()

      expect(config.next).toHaveBeenCalled()
    })

    it("throws if the user has only builder permissions", async () => {
      config.setCloudEnv(false)
      config.setMiddlewareRequiredPermission(PermissionTypes.BUILDER)
      config.setUser({
        role: {
          _id: ""
        }
      })
      await config.executeMiddleware()

      expect(config.throw).toHaveBeenCalledWith(403, "Not Authorized")
    })

    it("passes on to next() middleware if the user has resource permission", async () => {
      config.setResourceId(PermissionTypes.QUERY)
      config.setUser({
        role: {
          _id: ""
        }
      })
      config.setMiddlewareRequiredPermission(PermissionTypes.QUERY)

      await config.executeMiddleware()
      expect(config.next).toHaveBeenCalled()
    })

    it("throws if the user session is not authenticated after permission checks", async () => {
      config.setUser({
        role: {
          _id: ""
        },
      })
      config.setAuthenticated(false)

      await config.executeMiddleware()
      expect(config.throw).toHaveBeenCalledWith(403, "Session not authenticated")
    })

    it("throws if the user does not have base permissions to perform the operation", async () => {
      config.setUser({
        role: {
          _id: ""
        },
      })
      config.setMiddlewareRequiredPermission(PermissionTypes.ADMIN, PermissionLevels.BASIC)
      
      await config.executeMiddleware()
      expect(config.throw).toHaveBeenCalledWith(403, "User does not have permission")
    })
  })
})
