import * as global from "../global"
import { testEnv } from "../../../../tests/extra"

describe("global", () => {
  describe("getGlobalFileUrl", () => {
    async function getGlobalFileUrl() {
      return global.getGlobalFileUrl("settings", "logoUrl", "etag")
    }

    describe("single tenant", () => {
      beforeAll(() => {
        testEnv.singleTenant()
      })

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        const url = await getGlobalFileUrl()
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

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        await testEnv.withTenant(async tenantId => {
          const url = await getGlobalFileUrl()
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
