jest.mock("../client")
jest.mock("../../../../db")
jest.mock("../../cache")

import * as keys from "../keys"
import * as _client from "../client"
import * as _db from "../../../../db"
import * as _cache from "../../cache"

const client = jest.mocked(_client, { shallow: false })
const db = jest.mocked(_db, { shallow: false })
const cache = jest.mocked(_cache, { shallow: false })

describe("keys", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe("activateLicenseKey", () => {
    it("activates license key", async () => {
      await keys.activateLicenseKey("licenseKey")
      expect(client.activateLicenseKey).toHaveBeenCalledWith("licenseKey")
      expect(db.licenseInfo.save).toHaveBeenCalledWith({
        licenseKey: "licenseKey",
      })
      expect(cache.refresh).toHaveBeenCalledTimes(1)
    })
  })
  describe("getLicenseKey", () => {
    it("returns license key", async () => {
      db.licenseInfo.get.mockResolvedValue({ licenseKey: "licenseKey" })
      const key = await keys.getLicenseKey()
      expect(key).toBe("licenseKey")
    })
  })
  describe("deleteLicenseKey", () => {
    it("deletes license key", async () => {
      await keys.deleteLicenseKey()
      expect(db.licenseInfo.save).toHaveBeenCalledWith({
        licenseKey: undefined,
      })
      expect(cache.refresh).toHaveBeenCalledTimes(1)
    })
  })
})
