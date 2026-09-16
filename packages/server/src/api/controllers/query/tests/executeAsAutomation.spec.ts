import { context } from "@budibase/backend-core"
import type { Datasource, Query, QueryResponse } from "@budibase/types"
import { executeV2AsAutomation } from ".."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
} from "../../../../tests/utilities/structures"
import { Thread } from "../../../../threads"
import type { QueryEvent } from "../../../../threads/definitions"

describe("legacy automation query execution", () => {
  const config = new TestConfiguration()

  beforeAll(() => config.init())
  afterAll(() => config.end())
  afterEach(() => jest.restoreAllMocks())

  it("normalizes datasource config and forwards pagination to the query runner", async () => {
    const datasource: Datasource = {
      ...basicDatasource().datasource,
      _id: "datasource_automation",
      config: { port: "5432" },
    }
    const query: Query = {
      ...basicQuery(datasource._id!),
      _id: "query_automation",
    }
    await config.doInContext(undefined, async () => {
      const db = context.getWorkspaceDB()
      await db.put(datasource)
      await db.put(query)
    })
    jest.spyOn(Thread.prototype, "run").mockImplementation(async inputs => {
      const event = inputs as QueryEvent
      const response: QueryResponse = {
        rows: [{ port: event.datasource.config?.port, page: event.pagination }],
        keys: ["port", "page"],
        info: {},
        extra: {},
        pagination: undefined,
      }
      return response
    })

    const response = await config._req(
      executeV2AsAutomation,
      { pagination: { page: 3, limit: 20 } },
      { queryId: query._id }
    )

    expect(response).toEqual({
      data: [{ port: 5432, page: { page: 3, limit: 20 } }],
    })
  })
})
