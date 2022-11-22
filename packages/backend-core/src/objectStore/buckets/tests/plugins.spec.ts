import * as plugins from "../plugins"
import * as helpers from "./helpers"
import { structures } from "../../../../tests"

describe("plugins", () => {
  describe("enrichPluginURLs", () => {
    const plugin = structures.plugins.plugin()

    function getEnrichedPluginUrls() {
      const enriched = plugins.enrichPluginURLs([plugin])[0]
      return {
        jsUrl: enriched.jsUrl!,
        iconUrl: enriched.iconUrl!,
      }
    }

    it("gets url with embedded minio", () => {
      helpers.withMinio()
      const urls = getEnrichedPluginUrls()
      expect(urls.jsUrl).toBe(
        `/files/signed/plugins/${plugin.name}/plugin.min.js`
      )
      expect(urls.iconUrl).toBe(`/files/signed/plugins/${plugin.name}/icon.svg`)
    })

    it("gets url with custom S3", () => {
      helpers.withS3()
      const urls = getEnrichedPluginUrls()
      expect(urls.jsUrl).toBe(
        `http://s3.example.com/plugins/${plugin.name}/plugin.min.js`
      )
      expect(urls.iconUrl).toBe(
        `http://s3.example.com/plugins/${plugin.name}/icon.svg`
      )
    })

    it("gets url with cloudfront + s3", () => {
      helpers.withCloudfront()
      const urls = getEnrichedPluginUrls()
      // omit rest of signed params
      expect(
        urls.jsUrl.includes(
          `http://cf.example.com/plugins/${plugin.name}/plugin.min.js?`
        )
      ).toBe(true)
      expect(
        urls.iconUrl.includes(
          `http://s3.example.com/plugins/${plugin.name}/icon.svg`
        )
      ).toBe(true)
    })
  })
})
