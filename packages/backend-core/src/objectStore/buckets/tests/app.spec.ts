import * as app from "../app"
import * as helpers from "./helpers"
import env from "../../../environment"
import { getAppFileUrl } from "../app"

describe("app", () => {
  describe("clientLibraryUrl", () => {
    function getClientUrl() {
      return app.clientLibraryUrl("app_123/budibase-client.js", "2.0.0")
    }

    it("gets url in dev", () => {
      env._set("NODE_ENV", "dev")
      const url = getClientUrl()
      expect(url).toBe("/api/assets/client")
    })

    it("gets url with embedded minio", () => {
      helpers.withMinio()
      const url = getClientUrl()
      expect(url).toBe(
        "/files/signed/prod-budi-app-assets/app_123/budibase-client.js/budibase-client.js"
      )
    })

    it("gets url with custom S3", () => {
      helpers.withS3()
      const url = getClientUrl()
      expect(url).toBe(
        "http://s3.example.com/prod-budi-app-assets/app_123/budibase-client.js/budibase-client.js"
      )
    })

    it("gets url with cloudfront + s3", () => {
      helpers.withCloudfront()
      const url = getClientUrl()
      expect(url).toBe(
        "http://cf.example.com/app_123/budibase-client.js/budibase-client.js?v=2.0.0"
      )
    })
  })

  describe("getAppFileUrl", () => {
    function getAppFileUrl() {
      return app.getAppFileUrl("app_123/attachments/image.jpeg")
    }

    it("gets url with embedded minio", () => {
      helpers.withMinio()
      const url = getAppFileUrl()
      expect(url).toBe(
        "/files/signed/prod-budi-app-assets/app_123/attachments/image.jpeg"
      )
    })

    it("gets url with custom S3", () => {
      helpers.withS3()
      const url = getAppFileUrl()
      expect(url).toBe(
        "http://s3.example.com/prod-budi-app-assets/app_123/attachments/image.jpeg"
      )
    })

    it("gets url with cloudfront + s3", () => {
      helpers.withCloudfront()
      const url = getAppFileUrl()
      // omit rest of signed params
      expect(
        url.includes("http://cf.example.com/app_123/attachments/image.jpeg?")
      ).toBe(true)
    })
  })
})
