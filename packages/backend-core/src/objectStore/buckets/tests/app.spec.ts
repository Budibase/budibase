import { structures } from "../../../../tests"
import { testEnv } from "../../../../tests/extra"
import * as context from "../../../context"
import * as features from "../../../features"
import * as app from "../app"

describe("app", () => {
  beforeEach(() => {
    testEnv.nodeJest()
  })

  function baseCheck(url: string, useNewBundle: boolean, tenantId?: string) {
    let expectedUrl = "/api/assets/app_123/client?version=2.0.0"
    if (tenantId) {
      expectedUrl += `&tenantId=${tenantId}`
    }
    expectedUrl += `&dynamic=${useNewBundle}`
    expect(url).toBe(expectedUrl)
  }

  describe.each([
    ["serving old bundle", false],
    ["serving new bundle", true],
  ])("clientLibraryUrl (%s)", (_, useNewBundle) => {
    async function getClientUrl() {
      return await app.clientLibraryUrl("app_123", "2.0.0")
    }

    describe("single tenant", () => {
      let cleanup: () => void

      beforeAll(() => {
        cleanup = features.testutils.setFeatureFlags("default", {
          ESM_CLIENT: useNewBundle,
        })
      })

      afterAll(() => {
        cleanup()
      })

      beforeAll(() => {
        testEnv.singleTenant()
      })

      it("gets url in dev", async () => {
        testEnv.nodeDev()
        const url = await getClientUrl()
        baseCheck(url, useNewBundle)
      })

      it("gets url with custom S3", async () => {
        testEnv.withS3()
        const url = await getClientUrl()
        baseCheck(url, useNewBundle)
      })

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        const url = await getClientUrl()
        baseCheck(url, useNewBundle)
      })
    })

    describe("multi tenant", () => {
      const tenantId = structures.tenant.id()

      let cleanup: () => void

      beforeAll(() => {
        testEnv.multiTenant()
        cleanup = features.testutils.setFeatureFlags(tenantId, {
          ESM_CLIENT: useNewBundle,
        })
      })

      afterAll(() => {
        cleanup()
      })

      it("gets url in dev", async () => {
        testEnv.nodeDev()
        await context.doInTenant(tenantId, async () => {
          const url = await getClientUrl()
          baseCheck(url, useNewBundle, tenantId)
        })
      })

      it("gets url with embedded minio", async () => {
        await context.doInTenant(tenantId, async () => {
          testEnv.withMinio()
          const url = await getClientUrl()
          baseCheck(url, useNewBundle, tenantId)
        })
      })

      it("gets url with custom S3", async () => {
        await context.doInTenant(tenantId, async () => {
          testEnv.withS3()
          const url = await getClientUrl()
          baseCheck(url, useNewBundle, tenantId)
        })
      })

      it("gets url with cloudfront + s3", async () => {
        await context.doInTenant(tenantId, async () => {
          testEnv.withCloudfront()
          const url = await getClientUrl()
          baseCheck(url, useNewBundle, tenantId)
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
