const usageQuotaMiddleware = require("../usageQuota")
const usageQuota = require("../../utilities/usageQuota")
const CouchDB = require("../../db")
const env = require("../../environment")

jest.mock("../../db");
jest.mock("../../utilities/usageQuota")
jest.mock("../../environment")

class TestConfiguration {
  constructor() {
    this.throw = jest.fn()
    this.next = jest.fn()
    this.middleware = usageQuotaMiddleware
    this.ctx = {
      throw: this.throw,
      next: this.next,
      user: {
        appId: "test"
      },
      request: {
        body: {}
      },
      req: {
        method: "POST",
        url: "/rows"
      }
    }
  }

  executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }

  cloudHosted(bool) {
    if (bool) {
      env.CLOUD = 1
      this.ctx.auth = { apiKey: "test" }
    } else {
      env.CLOUD = 0
    }
  }

  setMethod(method) {
    this.ctx.req.method = method
  }

  setUrl(url) {
    this.ctx.req.url = url
  }

  setBody(body) {
    this.ctx.request.body = body
  }

  setFiles(files) {
    this.ctx.request.files = { file: files }
  }
}

describe("usageQuota middleware", () => {
  let config

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("skips the middleware if there is no usage property or method", async () => {
    await config.executeMiddleware()
    expect(config.next).toHaveBeenCalled()
  })

  it("passes through to next middleware if document already exists", async () => {
    config.setBody({
      _id: "test"
    })

    CouchDB.mockImplementationOnce(() => ({ 
      get: async () => true
    }))

    await config.executeMiddleware()

    expect(config.next).toHaveBeenCalled()
    expect(config.ctx.preExisting).toBe(true)
  })

  it("throws if request has _id, but the document no longer exists", async () => {
    config.setBody({
      _id: "123"
    })

    CouchDB.mockImplementationOnce(() => ({ 
      get: async () => {
        throw new Error()
      } 
    }))

    await config.executeMiddleware()
    expect(config.throw).toHaveBeenCalledWith(404, `${config.ctx.request.body._id} does not exist`)
  })

  it("calculates and persists the correct usage quota for the relevant action", async () => {
    config.setUrl("/rows")
    config.cloudHosted(true)

    await config.executeMiddleware()

    expect(usageQuota.update).toHaveBeenCalledWith("test", "rows", 1)
    expect(config.next).toHaveBeenCalled()
  })

  it("calculates the correct file size from a file upload call and adds it to quota", async () => {
    config.setUrl("/upload")
    config.cloudHosted(true)
    config.setFiles([
      {
        size: 100
      },
      {
        size: 10000
      },
    ])
    await config.executeMiddleware()

    expect(usageQuota.update).toHaveBeenCalledWith("test", "storage", 10100)
    expect(config.next).toHaveBeenCalled()
  })
})