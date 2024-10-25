import * as db from "../../db"

db.init()
mockAuthWithNoCookie()
mockWorker()
mockUserGroups()

function mockWorker() {
  jest.mock("../../utilities/workerRequests", () => ({
    getGlobalSelf: () => {
      return {
        _id: "us_uuid1",
        roles: {
          app_test: "BASIC",
        },
        roleId: "BASIC",
      }
    },
  }))
}

function mockReset() {
  jest.resetModules()
  mockWorker()
}

function mockUserGroups() {
  jest.mock("@budibase/pro", () => ({
    groups: {
      getGroupRoleId: () => {
        return "BASIC"
      },
    },
  }))
}

function mockAuthWithNoCookie() {
  jest.resetModules()
  mockWorker()
  jest.mock("@budibase/backend-core", () => {
    const core = jest.requireActual("@budibase/backend-core")
    return {
      ...core,
      db: {
        ...core.db,
        dbExists: () => true,
      },
      cache: {
        user: {
          getUser: async () => {
            return {
              _id: "us_uuid1",
            }
          },
        },
      },
      utils: {
        getAppIdFromCtx: jest.fn(),
        setCookie: jest.fn(),
        getCookie: jest.fn(),
      },
    }
  })
}

function mockAuthWithCookie() {
  jest.resetModules()
  mockWorker()
  jest.mock("@budibase/backend-core", () => {
    const core = jest.requireActual("@budibase/backend-core")
    return {
      ...core,
      db: {
        ...core.db,
        dbExists: () => true,
      },
      utils: {
        getAppIdFromCtx: () => {
          return "app_test"
        },
        setCookie: jest.fn(),
        clearCookie: jest.fn(),
        getCookie: () => ({ appId: "app_different", roleId: "PUBLIC" }),
      },
      cache: {
        user: {
          getUser: async () => {
            return {
              _id: "us_uuid1",
            }
          },
        },
      },
    }
  })
}

class TestConfiguration {
  next: jest.MockedFunction<any>
  throw: jest.MockedFunction<any>
  ctx: any

  constructor() {
    this.next = jest.fn()
    this.throw = jest.fn()

    this.ctx = {
      next: this.next,
      throw: this.throw,
      request: {
        body: {},
        headers: {},
      },
      headers: {},
      path: "",
      cookies: {
        set: jest.fn(),
      },
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
    jest.resetModules()
    require("../../db").init()
    const currentAppMiddleware = require("../currentapp").default
    return currentAppMiddleware(this.ctx, this.next)
  }
}

describe("Current app middleware", () => {
  let config: TestConfiguration

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
    async function checkExpected() {
      config.setUser()
      await config.executeMiddleware()

      expect(config.ctx.roleId).toEqual("PUBLIC")
      expect(config.ctx.user.role._id).toEqual("PUBLIC")
      expect(config.ctx.appId).toEqual("app_test")
      expect(config.next).toHaveBeenCalled()
    }

    it("should be able to setup an app token on a first call", async () => {
      mockAuthWithCookie()
      await checkExpected()
    })

    it("should perform correct on a first call", async () => {
      mockReset()
      jest.mock("@budibase/backend-core", () => {
        const core = jest.requireActual("@budibase/backend-core")
        return {
          ...core,
          db: {
            ...core.db,
            dbExists: () => true,
          },
          utils: {
            getAppIdFromCtx: () => {
              return "app_test"
            },
            setCookie: jest.fn(),
            getCookie: jest.fn(),
          },
          cache: {
            user: {
              getUser: async () => {
                return {
                  _id: "us_uuid1",
                }
              },
            },
          },
        }
      })
      await checkExpected()
    })
  })
})
