import * as setup from "./utilities"
import nock from "nock"
import { mocks } from "@budibase/backend-core/tests"
import { App, RecaptchaConfig, ConfigType } from "@budibase/types"
import { basicTable } from "../../../tests/utilities/structures"

// need to mock the config, this is setup in the worker service
// we don't have a nice way to do this properly, it will always be mock
const mockConfig: RecaptchaConfig = {
  type: ConfigType.RECAPTCHA,
  config: {
    secretKey: "test-secret-key",
    siteKey: "test-site-key",
  },
}

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    configs: {
      ...actual.configs,
      getRecaptchaConfig: () => mockConfig,
    },
  }
})

function recaptchaSucceed() {
  return nock("https://www.google.com")
    .post("/recaptcha/api/siteverify")
    .reply(200, { success: true })
}

function recaptchaFailed() {
  return nock("https://www.google.com")
    .post("/recaptcha/api/siteverify")
    .reply(200, { success: false })
}

function recaptchaError() {
  return nock("https://www.google.com")
    .post("/recaptcha/api/siteverify")
    .reply(500, "Internal Server Error")
}

describe("/recaptcha", () => {
  let config = setup.getConfig()
  let app: App

  beforeAll(async () => {
    await config.init()
  })

  afterAll(async () => {
    setup.afterAll()
  })

  beforeEach(async () => {
    mocks.licenses.useCloudFree()
    mocks.licenses.useRecaptcha()
    app = await config.newTenant()
  })

  afterEach(() => {
    nock.cleanAll()
    jest.restoreAllMocks()
  })

  describe("POST /api/recaptcha/verify", () => {
    it("should return error when no token provided", async () => {
      await config.api.recaptcha.verify({}, { status: 400 })
    })

    it("should verify recaptcha successfully", async () => {
      const scope = recaptchaSucceed()

      const res = await config.api.recaptcha.verify(
        { token: "valid-token" },
        { status: 200 }
      )
      expect(res.body.verified).toBe(true)

      // Check if the nock interceptor was called
      expect(scope.isDone()).toBe(true)
    })

    it("should handle invalid recaptcha token", async () => {
      recaptchaFailed()
      const res = await config.api.recaptcha.verify(
        { token: "invalid-token" },
        { status: 200 }
      )
      expect(res.body.verified).toBe(false)
    })

    it("should handle google API error", async () => {
      recaptchaError()
      await config.api.recaptcha.verify(
        { token: "test-token" },
        { status: 500 }
      )
    })
  })

  describe("GET /api/recaptcha/check", () => {
    it("should return false when no cookie present", async () => {
      const res = await config.api.recaptcha.check("", { status: 200 })
      expect(res.verified).toBe(false)
    })

    it("should return true when valid cookie present", async () => {
      recaptchaSucceed()
      const verifyRes = await config.api.recaptcha.verify(
        {
          token: "valid-token",
        },
        { status: 200 }
      )

      // Extract cookie from verify response
      const cookie = verifyRes.headers["set-cookie"]
      expect(cookie).toBeDefined()

      // Pass cookie to check request
      const checkRes = await config.api.recaptcha.check(cookie, { status: 200 })
      expect(checkRes.verified).toBe(true)
    })
  })

  describe("recaptcha middleware", () => {
    let tableId: string

    beforeEach(async () => {
      const table = await config.api.table.save(basicTable())
      tableId = table._id!
    })

    async function setRecaptchaEnabled(value: boolean) {
      app.recaptchaEnabled = value
      await config.api.application.update(app.appId, app)
      await config.api.application.publish(app.appId)
    }

    it("should return 498 when recaptcha enabled but no cookie present", async () => {
      await setRecaptchaEnabled(true)
      await config.withProdApp(async () => {
        await config.api.table.get(tableId, {
          status: 498,
        })
      })
    })

    it("should allow request when recaptcha disabled", async () => {
      await setRecaptchaEnabled(false)
      await config.withProdApp(async () => {
        await config.api.table.get(tableId, {
          status: 200,
        })
      })
    })

    it("should allow request when recaptcha enabled and valid cookie present", async () => {
      await setRecaptchaEnabled(true)
      recaptchaSucceed()
      const verifyRes = await config.api.recaptcha.verify(
        {
          token: "valid-token",
        },
        { status: 200 }
      )
      const cookie = verifyRes.headers["set-cookie"]

      await config.withProdApp(async () => {
        await config.withHeaders({ Cookie: cookie }, async () => {
          await config.api.table.get(tableId, {
            status: 200,
          })
        })
      })
    })

    it("should return 498 when recaptcha enabled but invalid cookie", async () => {
      await setRecaptchaEnabled(true)
      recaptchaFailed()
      const verifyRes = await config.api.recaptcha.verify(
        {
          token: "invalid-token",
        },
        { status: 200 }
      )
      expect(verifyRes.body.verified).toBe(false)

      await config.withProdApp(async () => {
        await config.api.table.get(tableId, {
          status: 498,
        })
      })
    })
  })
})
