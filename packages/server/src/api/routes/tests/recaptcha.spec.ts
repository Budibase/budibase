import * as setup from "./utilities"
import nock from "nock"
import { configs } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { App, RecaptchaConfig, ConfigType } from "@budibase/types"

const mockConfig: RecaptchaConfig = {
  type: ConfigType.RECAPTCHA,
  config: {
    secretKey: "test-secret-key",
    siteKey: "test-site-key",
  },
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
    app = await config.newTenant()
  })

  afterEach(() => {
    nock.cleanAll()
    jest.restoreAllMocks()
  })

  describe("POST /api/recaptcha/verify", () => {
    it("should return error when no token provided", async () => {
      jest.spyOn(configs, "getRecaptchaConfig").mockResolvedValue(mockConfig)

      const res = await config.api.recaptcha.verify({})
      expect(res.status).toBe(400)
    })

    it("should return error when no recaptcha config found", async () => {
      jest.spyOn(configs, "getRecaptchaConfig").mockResolvedValue(undefined)

      const res = await config.api.recaptcha.verify({ token: "test-token" })
      expect(res.status).toBe(400)
    })

    it("should verify recaptcha successfully", async () => {
      jest.spyOn(configs, "getRecaptchaConfig").mockResolvedValue(mockConfig)

      nock("https://www.google.com")
        .post("/recaptcha/api/siteverify")
        .reply(200, { success: true })

      const res = await config.api.recaptcha.verify({ token: "valid-token" })
      expect(res.status).toBe(200)
      expect(res.body.verified).toBe(true)
    })

    it("should handle invalid recaptcha token", async () => {
      jest.spyOn(configs, "getRecaptchaConfig").mockResolvedValue(mockConfig)

      nock("https://www.google.com")
        .post("/recaptcha/api/siteverify")
        .reply(200, { success: false })

      const res = await config.api.recaptcha.verify({ token: "invalid-token" })
      expect(res.status).toBe(200)
      expect(res.body.verified).toBe(false)
    })

    it("should handle google API error", async () => {
      jest.spyOn(configs, "getRecaptchaConfig").mockResolvedValue(mockConfig)

      nock("https://www.google.com")
        .post("/recaptcha/api/siteverify")
        .reply(500, "Internal Server Error")

      const res = await config.api.recaptcha.verify({ token: "test-token" })
      expect(res.status).toBe(500)
    })
  })

  describe("GET /api/recaptcha/check", () => {
    it("should return false when no cookie present", async () => {
      const res = await config.api.recaptcha.check()
      expect(res.status).toBe(200)
      expect(res.body.verified).toBe(false)
    })

    it("should return true when valid cookie present", async () => {
      jest.spyOn(configs, "getRecaptchaConfig").mockResolvedValue(mockConfig)

      nock("https://www.google.com")
        .post("/recaptcha/api/siteverify")
        .reply(200, { success: true })

      const verifyRes = await config.api.recaptcha.verify({ token: "valid-token" })
      expect(verifyRes.status).toBe(200)

      const checkRes = await config.api.recaptcha.check()
      expect(checkRes.status).toBe(200)
      expect(checkRes.body.verified).toBe(true)
    })
  })

  describe("recaptcha middleware", () => {
    it("should return 498 when recaptcha enabled but no cookie present", async () => {
      app.recaptchaEnabled = true
      await config.api.application.update(app.appId, app)

      const res = await config.api.row.search(config.table?._id!, {}, { status: 498 })
      expect(res).toEqual(undefined)
    })

    it("should allow request when recaptcha disabled", async () => {
      app.recaptchaEnabled = false
      await config.api.application.update(app.appId, app)

      const res = await config.api.row.search(config.table?._id!, {})
      expect(res).toBeDefined()
    })

    it("should allow request when recaptcha enabled and valid cookie present", async () => {
      jest.spyOn(configs, "getRecaptchaConfig").mockResolvedValue(mockConfig)

      nock("https://www.google.com")
        .post("/recaptcha/api/siteverify")
        .reply(200, { success: true })

      const verifyRes = await config.api.recaptcha.verify({ token: "valid-token" })
      expect(verifyRes.status).toBe(200)

      app.recaptchaEnabled = true
      await config.api.application.update(app.appId, app)

      const res = await config.api.row.search(config.table?._id!, {})
      expect(res).toBeDefined()
    })

    it("should return 498 when recaptcha enabled but invalid cookie", async () => {
      jest.spyOn(configs, "getRecaptchaConfig").mockResolvedValue(mockConfig)

      nock("https://www.google.com")
        .post("/recaptcha/api/siteverify")
        .reply(200, { success: false })

      const verifyRes = await config.api.recaptcha.verify({ token: "invalid-token" })
      expect(verifyRes.status).toBe(200)
      expect(verifyRes.body.verified).toBe(false)

      app.recaptchaEnabled = true
      await config.api.application.update(app.appId, app)

      const res = await config.api.row.search(config.table?._id!, {}, { status: 498 })
      expect(res).toEqual(undefined)
    })
  })
})