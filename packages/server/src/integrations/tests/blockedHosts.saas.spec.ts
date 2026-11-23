jest.unmock("airtable")

import nock from "nock"
import airtable from "../airtable"

describe("SaaS connectors and their vendor hosts", () => {
  describe("Airtable", () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it("ignores an endpoint URL in the config", async () => {
      const vendor = nock("https://api.airtable.com")
        .get(/\/v0\/base\/.*/)
        .reply(200, {})
      const override = nock("http://example.com").get(/.*/).reply(200, {})
      const integration = new airtable.integration({
        apiKey: "key",
        base: "base",
        ...{ endpointUrl: "http://example.com" },
      })

      await integration.testConnection()

      expect(vendor.isDone()).toBe(true)
      expect(override.isDone()).toBe(false)
    })
  })
})
