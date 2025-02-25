import { Datasource } from "@budibase/types"
import { ElasticsearchConfig, ElasticSearchIntegration } from "../elasticsearch"
import * as elasticsearch from "../tests/utils/elasticsearch"
import { generator } from "@budibase/backend-core/tests"

describe("Elasticsearch Integration", () => {
  let datasource: Datasource
  let integration: ElasticSearchIntegration

  let index: string

  beforeAll(async () => {
    datasource = await elasticsearch.getDatasource()
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
