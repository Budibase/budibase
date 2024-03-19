import { TestConfiguration, mocks, structures } from "../../../../tests"

const licensing = mocks.pro.licensing
const quotas = mocks.pro.quotas

describe("/api/global/license", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("POST /api/global/license/refresh", () => {
    it("returns 200", async () => {
      const res = await config.api.license.refresh()
      expect(res.status).toBe(200)
      expect(licensing.cache.refresh).toHaveBeenCalledTimes(1)
    })
  })

  describe("GET /api/global/license/usage", () => {
    it("returns 200 + usage", async () => {
      const usage = structures.quotas.usage()
      quotas.getQuotaUsage.mockResolvedValue(usage)
      const res = await config.api.license.getUsage()
      expect(res.status).toBe(200)
      expect(res.body).toEqual(usage)
    })
  })

  describe("POST /api/global/license/key", () => {
    it("returns 200", async () => {
      const res = await config.api.license.activateLicenseKey({
        licenseKey: "licenseKey",
      })
      expect(res.status).toBe(200)
      expect(licensing.keys.activateLicenseKey).toHaveBeenCalledWith(
        "licenseKey"
      )
    })
  })

  describe("GET /api/global/license/key", () => {
    it("returns 404 when not found", async () => {
      const res = await config.api.license.getLicenseKey()
      expect(res.status).toBe(404)
    })
    it("returns 200 + license key", async () => {
      licensing.keys.getLicenseKey.mockResolvedValue("licenseKey")
      const res = await config.api.license.getLicenseKey()
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        licenseKey: "*",
      })
    })
  })

  describe("DELETE /api/global/license/key", () => {
    it("returns 204", async () => {
      const res = await config.api.license.deleteLicenseKey()
      expect(licensing.keys.deleteLicenseKey).toHaveBeenCalledTimes(1)
      expect(res.status).toBe(204)
    })
  })

  describe("POST /api/global/license/offline", () => {
    it("activates offline license", async () => {
      const res = await config.api.license.activateOfflineLicense({
        offlineLicenseToken: "offlineLicenseToken",
      })
      expect(
        licensing.offline.activateOfflineLicenseToken
      ).toHaveBeenCalledWith("offlineLicenseToken")
      expect(res.status).toBe(200)
    })
  })

  describe("GET /api/global/license/offline", () => {
    it("returns 404 when not found", async () => {
      const res = await config.api.license.getOfflineLicense()
      expect(res.status).toBe(404)
    })
    it("returns 200 + offline license token", async () => {
      licensing.offline.getOfflineLicenseToken.mockResolvedValue(
        "offlineLicenseToken"
      )
      const res = await config.api.license.getOfflineLicense()
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        offlineLicenseToken: "*",
      })
    })
  })

  describe("DELETE /api/global/license/offline", () => {
    it("returns 204", async () => {
      const res = await config.api.license.deleteOfflineLicense()
      expect(res.status).toBe(204)
      expect(licensing.offline.deleteOfflineLicenseToken).toHaveBeenCalledTimes(
        1
      )
    })
  })

  describe("GET /api/global/license/offline/identifier", () => {
    it("returns 200 + identifier base64", async () => {
      licensing.offline.getIdentifierBase64.mockResolvedValue("base64")
      const res = await config.api.license.getOfflineLicenseIdentifier()
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        identifierBase64: "base64",
      })
    })
  })
})
