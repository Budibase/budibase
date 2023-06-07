import * as app from "../app"
import { getAppFileUrl } from "../app"
import { testEnv } from "../../../../tests/extra"

describe("app", () => {
  beforeEach(() => {
    testEnv.nodeJest()
  })

  describe("clientLibraryUrl", () => {
    function getClientUrl() {
      return app.clientLibraryUrl("app_123/budibase-client.js", "2.0.0")
    }

    describe("single tenant", () => {
      beforeAll(() => {
        testEnv.singleTenant()
      })

      it("gets url in dev", () => {
        testEnv.nodeDev()
        const url = getClientUrl()
        expect(url).toBe("/api/assets/client")
      })

      it("gets url with embedded minio", () => {
        testEnv.withMinio()
        const url = getClientUrl()
        expect(url).toBe(
          "/files/signed/prod-budi-app-assets/app_123/budibase-client.js/budibase-client.js"
        )
      })

      it("gets url with custom S3", () => {
        testEnv.withS3()
        const url = getClientUrl()
        expect(url).toBe(
          "http://s3.example.com/prod-budi-app-assets/app_123/budibase-client.js/budibase-client.js"
        )
      })

      it("gets url with cloudfront + s3", () => {
        testEnv.withCloudfront()
        const url = getClientUrl()
        expect(url).toBe(
          "http://cf.example.com/app_123/budibase-client.js/budibase-client.js?v=2.0.0"
        )
      })
    })

    describe("multi tenant", () => {
      beforeAll(() => {
        testEnv.multiTenant()
      })

      it("gets url in dev", async () => {
        testEnv.nodeDev()
        await testEnv.withTenant(tenantId => {
          const url = getClientUrl()
          expect(url).toBe("/api/assets/client")
        })
      })

      it("gets url with embedded minio", async () => {
        await testEnv.withTenant(tenantId => {
          testEnv.withMinio()
          const url = getClientUrl()
          expect(url).toBe(
            "/files/signed/prod-budi-app-assets/app_123/budibase-client.js/budibase-client.js"
          )
        })
      })

      it("gets url with custom S3", async () => {
        await testEnv.withTenant(tenantId => {
          testEnv.withS3()
          const url = getClientUrl()
          expect(url).toBe(
            "http://s3.example.com/prod-budi-app-assets/app_123/budibase-client.js/budibase-client.js"
          )
        })
      })

      it("gets url with cloudfront + s3", async () => {
        await testEnv.withTenant(tenantId => {
          testEnv.withCloudfront()
          const url = getClientUrl()
          expect(url).toBe(
            "http://cf.example.com/app_123/budibase-client.js/budibase-client.js?v=2.0.0"
          )
        })
      })
    })
  })

  describe("getAppFileUrl", () => {
    function getAppFileUrl() {
      return app.getAppFileUrl("app_123/attachments/image.jpeg")
    }

    describe("single tenant", () => {
      beforeAll(() => {
        testEnv.multiTenant()
      })

      it("gets url with embedded minio", () => {
        testEnv.withMinio()
        const url = getAppFileUrl()
        expect(url).toBe(
          "/files/signed/prod-budi-app-assets/app_123/attachments/image.jpeg"
        )
      })

      it("gets url with custom S3", () => {
        testEnv.withS3()
        const url = getAppFileUrl()
        expect(url).toBe(
          "http://s3.example.com/prod-budi-app-assets/app_123/attachments/image.jpeg"
        )
      })

      it("gets url with cloudfront + s3", () => {
        testEnv.withCloudfront()
        const url = getAppFileUrl()
        // omit rest of signed params
        expect(
          url.includes("http://cf.example.com/app_123/attachments/image.jpeg?")
        ).toBe(true)
      })
    })

    describe("multi tenant", () => {
      beforeAll(() => {
        testEnv.multiTenant()
      })

      it("gets url with embedded minio", async () => {
        testEnv.withMinio()
        await testEnv.withTenant(tenantId => {
          const url = getAppFileUrl()
          expect(url).toBe(
            "/files/signed/prod-budi-app-assets/app_123/attachments/image.jpeg"
          )
        })
      })

      it("gets url with custom S3", async () => {
        testEnv.withS3()
        await testEnv.withTenant(tenantId => {
          const url = getAppFileUrl()
          expect(url).toBe(
            "http://s3.example.com/prod-budi-app-assets/app_123/attachments/image.jpeg"
          )
        })
      })

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        await testEnv.withTenant(tenantId => {
          const url = getAppFileUrl()
          // omit rest of signed params
          expect(
            url.includes(
              "http://cf.example.com/app_123/attachments/image.jpeg?"
            )
          ).toBe(true)
        })
      })
    })
  })
})
