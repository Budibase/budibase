import * as global from "../global"
import * as helpers from "./helpers"

describe("global", () => {
  describe("getGlobalFileUrl", () => {
    function getGlobalFileUrl() {
      return global.getGlobalFileUrl("settings", "logoUrl", "etag")
    }

    it("gets url with embedded minio", () => {
      helpers.withMinio()
      const url = getGlobalFileUrl()
      expect(url).toBe("/files/signed/global/settings/logoUrl")
    })

    it("gets url with custom S3", () => {
      helpers.withS3()
      const url = getGlobalFileUrl()
      expect(url).toBe("http://s3.example.com/global/settings/logoUrl")
    })

    it("gets url with cloudfront + s3", () => {
      helpers.withCloudfront()
      const url = getGlobalFileUrl()
      // omit rest of signed params
      expect(
        url.includes("http://cf.example.com/settings/logoUrl?etag=etag&")
      ).toBe(true)
    })
  })
})
