describe("public api rate limiting", () => {
  const emptyEndpoints = { read: [], write: [] }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    jest.doMock("../applications", () => ({
      __esModule: true,
      default: emptyEndpoints,
    }))
    jest.doMock("../metrics", () => ({
      __esModule: true,
      default: emptyEndpoints,
    }))
    jest.doMock("../queries", () => ({
      __esModule: true,
      default: emptyEndpoints,
    }))
    jest.doMock("../roles", () => ({
      __esModule: true,
      default: emptyEndpoints,
    }))
    jest.doMock("../rows", () => ({
      __esModule: true,
      default: emptyEndpoints,
    }))
    jest.doMock("../tables", () => ({
      __esModule: true,
      default: emptyEndpoints,
    }))
    jest.doMock("../users", () => ({
      __esModule: true,
      default: emptyEndpoints,
    }))
    jest.doMock("../views", () => ({
      __esModule: true,
      default: emptyEndpoints,
    }))
    jest.doMock("../workspaces", () => ({
      __esModule: true,
      default: emptyEndpoints,
    }))
    jest.doMock("../../../../middleware/authorized", () => ({
      authorizedMiddleware: jest.fn(() => jest.fn()),
    }))
    jest.doMock("../../../../middleware/publicApi", () => ({
      publicApiMiddleware: jest.fn(() => jest.fn()),
    }))
    jest.doMock("../../../../middleware/resourceId", () => ({
      paramResource: jest.fn(() => jest.fn()),
      paramSubResource: jest.fn(() => jest.fn()),
    }))
    jest.doMock("../middleware/mapper", () => ({
      __esModule: true,
      default: jest.fn(),
    }))
    jest.doMock("../middleware/testErrorHandling", () => ({
      __esModule: true,
      default: jest.fn(() => jest.fn()),
    }))
  })

  it("initialises the Redis-backed rate limit store", () => {
    jest.doMock("../../../../environment", () => ({
      __esModule: true,
      default: {
        isTest: () => false,
        isDev: () => false,
        DISABLE_RATE_LIMITING: undefined,
        REDIS_CLUSTERED: undefined,
        TOP_LEVEL_PATH: "/tmp",
      },
    }))

    const { shutdown } = require("../index")

    shutdown()
  })
})
