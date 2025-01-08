import * as global from "../global"
import { testEnv } from "../../../../tests/extra"

describe("global", () => {
  describe("getGlobalFileUrl", () => {
    function getGlobalFileUrl() {
      return global.getGlobalFileUrl("settings", "logoUrl", "etag")
    }

    describe("single tenant", () => {
      beforeAll(() => {
        testEnv.singleTenant()
      })

      it("gets url with embedded minio", () => {
        testEnv.withMinio()
        const url = getGlobalFileUrl()
        expect(url).toBe("/files/signed/global/settings/logoUrl")
      })

      it("gets url with custom S3", () => {
        testEnv.withS3()
        const url = getGlobalFileUrl()
        expect(url).toBe("http://s3.example.com/global/settings/logoUrl")
      })

      it("gets url with cloudfront + s3", () => {
        testEnv.withCloudfront()
        const url = getGlobalFileUrl()
        // omit rest of signed params
        expect(
          url.includes("http://cf.example.com/settings/logoUrl?etag=etag&")
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
          const url = getGlobalFileUrl()
          expect(url).toBe(`/files/signed/global/${tenantId}/settings/logoUrl`)
        })
      })

      it("gets url with custom S3", async () => {
        testEnv.withS3()
        await testEnv.withTenant(tenantId => {
          const url = getGlobalFileUrl()
          expect(url).toBe(
            `http://s3.example.com/global/${tenantId}/settings/logoUrl`
          )
        })
      })

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        await testEnv.withTenant(tenantId => {
          const url = getGlobalFileUrl()
          // omit rest of signed params
          expect(
            url.includes(
              `http://cf.example.com/${tenantId}/settings/logoUrl?etag=etag&`
            )
          ).toBe(true)
        })
      })
    })
  })
})
