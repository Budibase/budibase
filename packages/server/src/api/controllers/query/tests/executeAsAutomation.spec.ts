import { context, HTTPError } from "@budibase/backend-core"
import type { Datasource, Query, QueryResponse } from "@budibase/types"
import { executeV2AsAutomation } from ".."
import { executeQueryAsAutomation } from "../executeAsAutomation"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
} from "../../../../tests/utilities/structures"
import { Thread } from "../../../../threads"
import type { QueryEvent } from "../../../../threads/definitions"

describe("automation query adapters", () => {
  const config = new TestConfiguration()

  beforeAll(() => config.init())
  afterAll(() => config.end())
  afterEach(() => jest.restoreAllMocks())

  it("executeV2AsAutomation normalizes datasource config and forwards pagination to the query runner", async () => {
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

  it("executeQueryAsAutomation forwards runtime parameters and defaults for Run Function queries", async () => {
    const datasource: Datasource = {
      ...basicDatasource().datasource,
      _id: "datasource_function",
    }
    const query: Query = {
      ...basicQuery(datasource._id!),
      _id: "query_function",
      parameters: [
        { name: "name", default: "default name" },
        { name: "limit", default: "20" },
      ],
    }
    await config.doInContext(undefined, async () => {
      const db = context.getWorkspaceDB()
      await db.put(datasource)
      await db.put(query)
    })
    jest.spyOn(Thread.prototype, "run").mockImplementation(async inputs => {
      const event = inputs as QueryEvent
      const response: QueryResponse = {
        rows: [event.parameters],
        keys: ["name", "limit"],
        info: {},
        extra: { raw: "hidden query result" },
        pagination: undefined,
      }
      return response
    })

    const response = await config._req(
      executeQueryAsAutomation,
      { parameters: { name: "runtime name" } },
      { queryId: query._id }
    )

    expect(response).toEqual({
      data: [{ name: "runtime name", limit: "20" }],
    })
  })

  it.each([
    { error: new HTTPError("Query timed out", 504), status: 504 },
    { error: new Error("Query failed"), status: 400 },
  ])(
    "executeV2AsAutomation returns status $status for $error",
    async ({ error, status }) => {
      const datasource: Datasource = {
        ...basicDatasource().datasource,
        _id: `datasource_error_${status}`,
      }
      const query: Query = {
        ...basicQuery(datasource._id!),
        _id: `query_error_${status}`,
      }
      await config.doInContext(undefined, async () => {
        const db = context.getWorkspaceDB()
        await db.put(datasource)
        await db.put(query)
      })
      jest.spyOn(Thread.prototype, "run").mockRejectedValue(error)

      await expect(
        config._req(executeV2AsAutomation, {}, { queryId: query._id })
      ).rejects.toThrow(`Error ${status} - ${error}`)
    }
  )
})
