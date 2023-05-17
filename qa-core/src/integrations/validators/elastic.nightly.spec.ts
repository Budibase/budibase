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

    it("test wrong connection string", async () => {
      const integration = new elastic.integration({
        url: `http://localhost:5656`,
      })
      const result = await integration.testConnection()
      expect(result).toEqual({
        connected: false,
        error: "connect ECONNREFUSED 127.0.0.1:5656",
      })
    })
  })
})
