import * as plugins from "../plugins"
import { structures } from "../../../../tests"
import { testEnv } from "../../../../tests/extra"

describe("plugins", () => {
  describe("enrichPluginURLs", () => {
    const plugin = structures.plugins.plugin()

    async function getEnrichedPluginUrls() {
      const enriched = (await plugins.enrichPluginURLs([plugin]))[0]
      return {
        jsUrl: enriched.jsUrl!,
        iconUrl: enriched.iconUrl!,
      }
    }

    describe("single tenant", () => {
      beforeAll(() => {
        testEnv.singleTenant()
      })

      it("gets url with embedded minio", async () => {
        testEnv.withMinio()
        const urls = await getEnrichedPluginUrls()
        expect(urls.jsUrl).toBe(
          `/files/signed/plugins/${plugin.name}/plugin.min.js`
        )
        expect(urls.iconUrl).toBe(
          `/files/signed/plugins/${plugin.name}/icon.svg`
        )
      })

      it("gets url with custom S3", async () => {
        testEnv.withS3()
        const urls = await getEnrichedPluginUrls()
        expect(urls.jsUrl).toBe(
          `http://s3.example.com/plugins/${plugin.name}/plugin.min.js`
        )
        expect(urls.iconUrl).toBe(
          `http://s3.example.com/plugins/${plugin.name}/icon.svg`
        )
      })

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        const urls = await getEnrichedPluginUrls()
        // omit rest of signed params
        expect(
          urls.jsUrl.includes(
            `http://cf.example.com/plugins/${plugin.name}/plugin.min.js?`
          )
        ).toBe(true)
        expect(
          urls.iconUrl.includes(
            `http://cf.example.com/plugins/${plugin.name}/icon.svg?`
          )
        ).toBe(true)
      })
    })

    describe("multi tenant", () => {
      beforeAll(() => {
        testEnv.multiTenant()
      })

      it("gets url with embedded minio", async () => {
        testEnv.withMinio()
        await testEnv.withTenant(async tenantId => {
          const urls = await getEnrichedPluginUrls()
          expect(urls.jsUrl).toBe(
            `/files/signed/plugins/${tenantId}/${plugin.name}/plugin.min.js`
          )
          expect(urls.iconUrl).toBe(
            `/files/signed/plugins/${tenantId}/${plugin.name}/icon.svg`
          )
        })
      })

      it("gets url with custom S3", async () => {
        testEnv.withS3()
        await testEnv.withTenant(async tenantId => {
          const urls = await getEnrichedPluginUrls()
          expect(urls.jsUrl).toBe(
            `http://s3.example.com/plugins/${tenantId}/${plugin.name}/plugin.min.js`
          )
          expect(urls.iconUrl).toBe(
            `http://s3.example.com/plugins/${tenantId}/${plugin.name}/icon.svg`
          )
        })
      })

      it("gets url with cloudfront + s3", async () => {
        testEnv.withCloudfront()
        await testEnv.withTenant(async tenantId => {
          const urls = await getEnrichedPluginUrls()
          // omit rest of signed params
          expect(
            urls.jsUrl.includes(
              `http://cf.example.com/plugins/${tenantId}/${plugin.name}/plugin.min.js?`
            )
          ).toBe(true)
          expect(
            urls.iconUrl.includes(
              `http://cf.example.com/plugins/${tenantId}/${plugin.name}/icon.svg?`
            )
          ).toBe(true)
        })
      })
    })
  })
})
