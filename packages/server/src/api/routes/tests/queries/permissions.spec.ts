import * as setup from "../utilities"
import { checkBuilderEndpoint } from "../utilities/TestFunctions"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { Datasource, Query, SourceName } from "@budibase/types"

describe("query permissions", () => {
  let config: TestConfiguration
  let datasource: Datasource
  let query: Query

  beforeAll(async () => {
    config = setup.getConfig()
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
