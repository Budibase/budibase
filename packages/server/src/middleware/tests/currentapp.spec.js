mockAuthWithNoCookie()
mockWorker()

function mockWorker() {
  jest.mock("../../utilities/workerRequests", () => ({
    getGlobalSelf: () => {
      return {
        _id: "us_uuid1",
        roles: {
          "app_test": "BASIC",
        },
        roleId: "BASIC",
      }
    }
  }))
}

function mockReset() {
  jest.resetModules()
  mockWorker()
}

function mockAuthWithNoCookie() {
  jest.resetModules()
  mockWorker()
  jest.mock("@budibase/auth/cache", () => ({
    user: {
      getUser: () => {
        return {
          _id: "us_uuid1",
        }
      },
    },
  }))
  jest.mock("@budibase/auth", () => ({
    utils: {
      getAppId: jest.fn(),
      setCookie: jest.fn(),
      getCookie: jest.fn(),
    },
    constants: {
      Cookies: {},
    },
  }))
}

function mockAuthWithCookie() {
  jest.resetModules()
  mockWorker()
  jest.mock("@budibase/auth", () => ({
    utils: {
      getAppId: () => {
        return "app_test"
      },
      setCookie: jest.fn(),
      getCookie: () => ({appId: "app_different", roleId: "PUBLIC"}),
    },
    constants: {
      Cookies: {
        Auth: "auth",
        CurrentApp: "currentapp",
      },
    },
  }))
}

class TestConfiguration {
  constructor() {
    this.next = jest.fn()
    this.throw = jest.fn()

    this.ctx = {
      next: this.next,
      throw: this.throw
    }
  }

  setUser() {
    this.ctx.user = {
      userId: "us_uuid1",
      _id: "us_uuid1",
    }
  }

  executeMiddleware() {
    // import as late as possible for mocks
    const currentAppMiddleware = require("../currentapp")
    return currentAppMiddleware(this.ctx, this.next)
  }
}

describe("Current app middleware", () => {
  let config

  beforeEach(() => {
    config = new TestConfiguration()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("test having no cookies or app ID", () => {
    it("should be able to proceed with nothing setup", async () => {
      await config.executeMiddleware()
      expect(config.next).toHaveBeenCalled()
    })
  })

  describe("check get public for app when not logged in", () => {
    it("should be able to proceed with no login, but cookies configured", async () => {
      mockAuthWithCookie()
      await config.executeMiddleware()
      expect(config.ctx.roleId).toEqual("PUBLIC")
      expect(config.ctx.appId).toEqual("app_test")
      expect(config.next).toHaveBeenCalled()
    })
  })

  describe("check functionality when logged in", () => {
    async function checkExpected(setCookie) {
      config.setUser()
      await config.executeMiddleware()
      const cookieFn = require("@budibase/auth").utils.setCookie
      if (setCookie) {
        expect(cookieFn).toHaveBeenCalled()
      } else {
        expect(cookieFn).not.toHaveBeenCalled()
      }
      expect(config.ctx.roleId).toEqual("BASIC")
      expect(config.ctx.user.role._id).toEqual("BASIC")
      expect(config.ctx.appId).toEqual("app_test")
      expect(config.next).toHaveBeenCalled()
    }

    it("should be able to setup an app token when cookie not setup", async () => {
      mockAuthWithCookie()
      await checkExpected(true)
    })

    it("should perform correct when no cookie exists", async () => {
      mockReset()
      jest.mock("@budibase/auth", () => ({
        utils: {
          getAppId: () => {
            return "app_test"
          },
          setCookie: jest.fn(),
          getCookie: jest.fn(),
        },
        constants: {
          Cookies: {},
        },
      }))
      await checkExpected(true)
    })

    it("lastly check what occurs when cookie doesn't need updated", async () => {
      mockReset()
      jest.mock("@budibase/auth", () => ({
        utils: {
          getAppId: () => {
            return "app_test"
          },
          setCookie: jest.fn(),
          getCookie: () => ({appId: "app_test", roleId: "BASIC"}),
        },
        constants: { Cookies: {} },
      }))
      await checkExpected(false)
    })
  })
})
