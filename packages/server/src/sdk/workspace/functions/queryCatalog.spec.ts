const mockDbAllDocs = jest.fn()
const mockDbTryGet = jest.fn()
const mockGetWorkspaceDB = jest.fn(() => ({
  allDocs: (...args: unknown[]) => mockDbAllDocs(...args),
  tryGet: (...args: unknown[]) => mockDbTryGet(...args),
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: (...args: Parameters<typeof mockGetWorkspaceDB>) =>
        mockGetWorkspaceDB(...args),
    },
  }
})

import { SourceName } from "@budibase/types"
import { buildCapabilities, getQueryCatalog } from "./queryCatalog"
import { basicQuery } from "../../../tests/utilities/structures"

describe("getQueryCatalog", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("does not retry missing datasource lookups", async () => {
    mockDbAllDocs.mockResolvedValue({
      rows: [
        {
          doc: {
            _id: "query_1",
            datasourceId: "datasource_missing",
            queryVerb: "read",
          },
        },
        {
          doc: {
            _id: "query_2",
            datasourceId: "datasource_missing",
            queryVerb: "read",
          },
        },
      ],
    })
    mockDbTryGet.mockResolvedValue(undefined)

    await expect(getQueryCatalog()).resolves.toEqual([])

    expect(mockDbTryGet).toHaveBeenCalledTimes(1)
  })

  it("shares datasource lookups across queries", async () => {
    mockDbAllDocs.mockResolvedValue({
      rows: [
        {
          doc: {
            _id: "query_1",
            datasourceId: "datasource_1",
            name: "Find rooms",
            parameters: [],
            queryVerb: "read",
          },
        },
        {
          doc: {
            _id: "query_2",
            datasourceId: "datasource_1",
            name: "Find floors",
            parameters: [],
            queryVerb: "read",
          },
        },
      ],
    })
    mockDbTryGet.mockResolvedValue({
      _id: "datasource_1",
      name: "Inventory",
      source: "POSTGRES",
    })

    const entries = await getQueryCatalog()

    expect(entries.map(entry => entry.queryId)).toEqual(["query_2", "query_1"])
    expect(mockDbTryGet).toHaveBeenCalledTimes(1)
    expect(mockDbTryGet).toHaveBeenCalledWith("datasource_1")
  })

  it("includes saved MongoDB aggregate queries", async () => {
    mockDbAllDocs.mockResolvedValue({
      rows: [
        {
          doc: {
            _id: "query_mongo",
            datasourceId: "datasource_mongo",
            name: "Read query",
            parameters: [],
            queryVerb: "aggregate",
          },
        },
      ],
    })
    mockDbTryGet.mockResolvedValue({
      _id: "datasource_mongo",
      name: "MongoDB",
      source: SourceName.MONGODB,
    })

    await expect(getQueryCatalog()).resolves.toEqual([
      {
        queryId: "query_mongo",
        queryName: "Read query",
        datasourceId: "datasource_mongo",
        datasourceName: "MongoDB",
        source: SourceName.MONGODB,
        kind: "data",
        parameters: [],
      },
    ])
  })

  it.each([SourceName.POSTGRES, SourceName.REST])(
    "uses the same effective response schema for catalog and linked %s queries",
    async source => {
      const query = {
        ...basicQuery("datasource_1"),
        _id: "query_1",
        schema: {
          name: { name: "Display name", type: "string" },
          count: "number",
        },
      }
      const datasource = { _id: "datasource_1", name: "Inventory", source }
      mockDbAllDocs.mockResolvedValue({ rows: [{ doc: query }] })
      mockDbTryGet.mockImplementation(async id =>
        id === query._id ? query : datasource
      )
      const catalog = await getQueryCatalog()
      const capabilities = await buildCapabilities([
        {
          queryId: query._id,
          datasourceAlias: "Inventory",
          queryAlias: "find",
        },
      ])
      const responseSchema = {
        fields: [
          { name: "count", type: "number" },
          { name: "name", type: "string" },
        ],
      }
      expect(catalog).toEqual([expect.objectContaining({ responseSchema })])
      expect(capabilities).toEqual([
        expect.objectContaining({ responseSchema }),
      ])
    }
  )
})
