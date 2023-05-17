import { ElasticsearchContainer } from "testcontainers"
import elastic from "../../../../packages/server/src/integrations/elasticsearch"

jest.unmock("@elastic/elasticsearch")

describe("datasource validators", () => {
  describe("elastic search", () => {
    let url: string

    beforeAll(async () => {
      const container = await new ElasticsearchContainer().start()
      url = container.getHttpUrl()
    })

    it("test valid connection string", async () => {
      const integration = new elastic.integration({
        url,
      })
      const result = await integration.testConnection()
      expect(result).toEqual({ connected: true })
    })
  })
})
