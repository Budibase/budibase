import { testEnv } from "../../../../tests/extra"
import * as app from "../app"

describe("app", () => {
  beforeEach(() => {
    testEnv.nodeJest()
  })

  function baseCheck(url: string, tenantId?: string) {
    expect(url).toContain("/api/assets/client")
    if (tenantId) {
      expect(url).toContain(`tenantId=${tenantId}`)
    }
    expect(url).toContain("appId=app_123")
    expect(url).toContain("version=2.0.0")
  }

  describe("clientLibraryUrl", () => {
    async function getClientUrl() {
      return await app.clientLibraryUrl("app_123/budibase-client.js", "2.0.0")
    }

    describe("single tenant", () => {
      beforeAll(() => {
        testEnv.singleTenant()
      })

      it("gets url in dev", async () => {
        testEnv.nodeDev()
        const url = await getClientUrl()
        baseCheck(url)
      })

      it("gets url with custom S3", async () => {
        testEnv.withS3()
        const url = await getClientUrl()
        baseCheck(url)
      })

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        const url = await getClientUrl()
        baseCheck(url)
      })
    })

    describe("multi tenant", () => {
      beforeAll(() => {
        testEnv.multiTenant()
      })

      it("gets url in dev", async () => {
        testEnv.nodeDev()
        await testEnv.withTenant(async tenantId => {
          const url = await getClientUrl()
          baseCheck(url, tenantId)
        })
      })

      it("gets url with embedded minio", async () => {
        await testEnv.withTenant(async tenantId => {
          testEnv.withMinio()
          const url = await getClientUrl()
          baseCheck(url, tenantId)
        })
      })

      it("gets url with custom S3", async () => {
        await testEnv.withTenant(async tenantId => {
          testEnv.withS3()
          const url = await getClientUrl()
          baseCheck(url, tenantId)
        })
      })

      it("gets url with cloudfront + s3", async () => {
        await testEnv.withTenant(async tenantId => {
          testEnv.withCloudfront()
          const url = await getClientUrl()
          baseCheck(url, tenantId)
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

      it("gets url with embedded minio", async () => {
        testEnv.withMinio()
        const url = await getAppFileUrl()
        expect(url).toBe(
          "/files/signed/prod-budi-app-assets/app_123/attachments/image.jpeg"
        )
      })

      it("gets url with custom S3", async () => {
        testEnv.withS3()
        const url = await getAppFileUrl()
        expect(url).toBe(
          "http://s3.example.com/prod-budi-app-assets/app_123/attachments/image.jpeg"
        )
      })

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        const url = await getAppFileUrl()
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
        await testEnv.withTenant(async () => {
          const url = await getAppFileUrl()
          expect(url).toBe(
            "/files/signed/prod-budi-app-assets/app_123/attachments/image.jpeg"
          )
        })
      })

      it("gets url with custom S3", async () => {
        testEnv.withS3()
        await testEnv.withTenant(async () => {
          const url = await getAppFileUrl()
          expect(url).toBe(
            "http://s3.example.com/prod-budi-app-assets/app_123/attachments/image.jpeg"
          )
        })
      })

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        await testEnv.withTenant(async () => {
          const url = await getAppFileUrl()
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
