import { checkBuilderEndpoint } from "../utilities/TestFunctions"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { Datasource, Query, SourceName } from "@budibase/types"

describe("query permissions", () => {
  const config = new TestConfiguration()
  let datasource: Datasource
  let query: Query

  beforeAll(async () => {
    await config.init()
    datasource = await config.api.datasource.create({
      name: "test datasource",
      type: "test",
      source: SourceName.REST,
      config: {},
    })
    query = await config.api.query.save({
      name: "test query",
      datasourceId: datasource._id!,
      parameters: [],
      fields: {},
      transformer: "",
      schema: {},
      readable: true,
      queryVerb: "read",
    })
  })

  afterAll(() => {
    config.end()
  })

  it("delete should require builder", async () => {
    await checkBuilderEndpoint({
      config,
      method: "DELETE",
      url: `/api/queries/${query._id}/${query._rev}`,
    })
  })

  it("preview should require builder", async () => {
    await checkBuilderEndpoint({
      config,
      method: "POST",
      url: `/api/queries/preview`,
    })
  })
})
