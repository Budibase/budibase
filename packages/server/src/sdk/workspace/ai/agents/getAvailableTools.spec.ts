import { Datasource, Query, SourceName, ToolType } from "@budibase/types"
import sdk from "../../.."
import { getAvailableToolsMetadata } from "./utils"

const makeDatasource = (overrides: Partial<Datasource>): Datasource => ({
  _id: "datasource_1",
  type: "datasource",
  source: SourceName.REST,
  name: "Datasource",
  ...overrides,
})

const makeQuery = (overrides: Partial<Query>): Query => ({
  _id: "query_1",
  datasourceId: "datasource_1",
  name: "My Query",
  parameters: [],
  fields: {},
  transformer: null,
  schema: {},
  readable: true,
  queryVerb: "read",
  ...overrides,
})

describe("getAvailableToolsMetadata", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.spyOn(sdk.tables, "getAllTables").mockResolvedValue([])
    jest.spyOn(sdk.automations, "fetch").mockResolvedValue([])
  })

  it("does not expose helper tools in metadata", async () => {
    jest.spyOn(sdk.datasources, "fetch").mockResolvedValue([])
    jest.spyOn(sdk.queries, "fetch").mockResolvedValue([])

    const tools = await getAvailableToolsMetadata()
    const helperTools = tools.filter(tool =>
      [
        "list_tables",
        "get_table",
        "list_automations",
        "get_automation",
      ].includes(tool.name)
    )

    expect(helperTools).toHaveLength(0)
  })

  it("keeps REST queries as REST_QUERY tools", async () => {
    jest.spyOn(sdk.datasources, "fetch").mockResolvedValue([
      makeDatasource({
        _id: "datasource_rest",
        source: SourceName.REST,
        name: "REST API",
      }),
    ])
    jest.spyOn(sdk.queries, "fetch").mockResolvedValue([
      makeQuery({
        _id: "query_rest",
        datasourceId: "datasource_rest",
        name: "Get Pokemon",
      }),
    ])

    const tools = await getAvailableToolsMetadata()
    const restQueryTool = tools.find(
      tool =>
        tool.sourceType === ToolType.REST_QUERY &&
        tool.readableName === "Get Pokemon"
    )

    expect(restQueryTool).toMatchObject({
      name: "rest_rest_api_get_pokemon",
      readableName: "Get Pokemon",
      sourceType: ToolType.REST_QUERY,
      sourceLabel: "REST API",
    })
  })

  it("adds non-REST datasource queries as DATASOURCE_QUERY tools", async () => {
    jest.spyOn(sdk.datasources, "fetch").mockResolvedValue([
      makeDatasource({
        _id: "datasource_snowflake",
        source: SourceName.SNOWFLAKE,
        name: "Warehouse",
      }),
    ])
    jest.spyOn(sdk.queries, "fetch").mockResolvedValue([
      makeQuery({
        _id: "query_warehouse",
        datasourceId: "datasource_snowflake",
        name: "Monthly Sales",
      }),
    ])

    const tools = await getAvailableToolsMetadata()
    const datasourceQueryTool = tools.find(
      tool =>
        tool.sourceType === ToolType.DATASOURCE_QUERY &&
        tool.readableName === "Monthly Sales"
    )

    expect(datasourceQueryTool).toMatchObject({
      name: "ds_warehouse_monthly_sales",
      readableName: "Monthly Sales",
      sourceType: ToolType.DATASOURCE_QUERY,
      sourceLabel: "Warehouse",
      sourceIconType: SourceName.SNOWFLAKE,
    })
  })

  it("ignores queries without a matching datasource", async () => {
    jest.spyOn(sdk.datasources, "fetch").mockResolvedValue([
      makeDatasource({
        _id: "datasource_rest",
        source: SourceName.REST,
        name: "REST API",
      }),
    ])
    jest.spyOn(sdk.queries, "fetch").mockResolvedValue([
      makeQuery({
        _id: "query_missing",
        datasourceId: "missing_datasource",
        name: "Missing Query",
      }),
    ])

    const tools = await getAvailableToolsMetadata()
    const missingQueryTool = tools.find(
      tool => tool.readableName === "Missing Query"
    )

    expect(missingQueryTool).toBeUndefined()
  })

  it("generates unique runtime names for identical query names across datasources", async () => {
    jest.spyOn(sdk.datasources, "fetch").mockResolvedValue([
      makeDatasource({
        _id: "datasource_rest",
        source: SourceName.REST,
        name: "REST API",
      }),
      makeDatasource({
        _id: "datasource_snowflake",
        source: SourceName.SNOWFLAKE,
        name: "Warehouse",
      }),
    ])
    jest.spyOn(sdk.queries, "fetch").mockResolvedValue([
      makeQuery({
        _id: "query_rest",
        datasourceId: "datasource_rest",
        name: "Get Data",
      }),
      makeQuery({
        _id: "query_snowflake",
        datasourceId: "datasource_snowflake",
        name: "Get Data",
      }),
    ])

    const tools = await getAvailableToolsMetadata()
    const queryTools = tools.filter(
      tool =>
        tool.readableName === "Get Data" &&
        (tool.sourceType === ToolType.REST_QUERY ||
          tool.sourceType === ToolType.DATASOURCE_QUERY)
    )

    expect(queryTools).toHaveLength(2)
    expect(new Set(queryTools.map(tool => tool.name)).size).toBe(2)
  })
})
