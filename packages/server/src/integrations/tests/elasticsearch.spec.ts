import { Datasource } from "@budibase/types"
import { ElasticsearchConfig, ElasticSearchIntegration } from "../elasticsearch"
import { generator } from "@budibase/backend-core/tests"
import { DatabaseName, datasourceDescribe } from "./utils"

const describes = datasourceDescribe({ only: [DatabaseName.ELASTICSEARCH] })

if (describes.length) {
  describe.each(describes)("Elasticsearch Integration", ({ dsProvider }) => {
    let datasource: Datasource
    let integration: ElasticSearchIntegration

    let index: string

    beforeAll(async () => {
      const ds = await dsProvider()
      datasource = ds.datasource!
    })

    beforeEach(() => {
      index = generator.guid()
      integration = new ElasticSearchIntegration(
        datasource.config! as ElasticsearchConfig
      )
    })

    it("can create a record", async () => {
      await integration.create({
        index,
        json: { name: "Hello" },
        extra: { refresh: "true" },
      })
      const records = await integration.read({
        index,
        json: { query: { match_all: {} } },
      })
      expect(records).toEqual([{ name: "Hello" }])
    })

    it("can update a record", async () => {
      const create = await integration.create({
        index,
        json: { name: "Hello" },
        extra: { refresh: "true" },
      })

      await integration.update({
        id: create._id,
        index,
        json: { doc: { name: "World" } },
        extra: { refresh: "true" },
      })

      const records = await integration.read({
        index,
        json: { query: { match_all: {} } },
      })
      expect(records).toEqual([{ name: "World" }])
    })

    it("can delete a record", async () => {
      const create = await integration.create({
        index,
        json: { name: "Hello" },
        extra: { refresh: "true" },
      })

      await integration.delete({
        id: create._id,
        index,
        extra: { refresh: "true" },
      })

      const records = await integration.read({
        index,
        json: { query: { match_all: {} } },
      })
      expect(records).toEqual([])
    })
  })
}
