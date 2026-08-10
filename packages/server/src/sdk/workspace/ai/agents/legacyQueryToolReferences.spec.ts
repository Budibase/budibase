import { getQueryToolBindings } from "@budibase/shared-core"
import { SourceName, ToolExecutionPrincipal, ToolType } from "@budibase/types"
import type { Agent, Datasource, Query } from "@budibase/types"
import {
  getLegacyQueryToolBindingReplacements,
  getLegacyQueryToolRuntimeBinding,
  replaceLegacyQueryToolReferences,
} from "./legacyQueryToolReferences"

const makeDatasource = ({
  id,
  name,
  source,
}: {
  id: string
  name: string
  source: SourceName
}): Datasource => ({
  _id: id,
  name,
  type: "datasource",
  source,
  config: {},
})

const makeQuery = ({
  id,
  datasourceId,
  name,
}: {
  id: string
  datasourceId: string
  name: string
}): Query => ({
  _id: id,
  datasourceId,
  fields: {},
  name,
  parameters: [],
  queryVerb: "read",
  readable: true,
  schema: {},
  transformer: "return data",
})

const getCurrentBinding = ({
  datasource,
  query,
}: {
  datasource: Datasource
  query: Query
}) =>
  getQueryToolBindings({
    sourceType:
      datasource.source === SourceName.REST
        ? ToolType.REST_QUERY
        : ToolType.DATASOURCE_QUERY,
    sourceLabel:
      datasource.name ||
      (datasource.source === SourceName.REST ? "API" : "Datasource"),
    queryName: query.name,
    queryId: query._id!,
  }).runtimeBinding

const makeAgent = (toolNames: string[]): Agent => ({
  _id: "agent_1",
  _rev: "1-agent",
  name: "Agent",
  aiconfig: "config_1",
  operations: [
    {
      id: "operation_1",
      name: "Main",
      live: true,
      enabledTools: toolNames.map((toolName, index) => ({
        toolName,
        executionPrincipal:
          index === 0
            ? ToolExecutionPrincipal.REQUESTER
            : ToolExecutionPrincipal.ADMIN,
      })),
      allowKnowledgeSourceDownload: true,
    },
  ],
})

describe("legacy agent query tool references", () => {
  it("maps unique REST and datasource bindings and preserves order", () => {
    const restDatasource = makeDatasource({
      id: "datasource_rest",
      name: "GitHub API",
      source: SourceName.REST,
    })
    const sqlDatasource = makeDatasource({
      id: "datasource_sql",
      name: "Sales Warehouse",
      source: SourceName.POSTGRES,
    })
    const restQuery = makeQuery({
      id: "query_rest_unique_identifier",
      datasourceId: restDatasource._id!,
      name: "Get repository",
    })
    const sqlQuery = makeQuery({
      id: "query_sql_unique_identifier",
      datasourceId: sqlDatasource._id!,
      name: "Monthly sales",
    })
    const legacyRest = getLegacyQueryToolRuntimeBinding({
      datasource: restDatasource,
      query: restQuery,
    })
    const legacySql = getLegacyQueryToolRuntimeBinding({
      datasource: sqlDatasource,
      query: sqlQuery,
    })
    const currentRest = getCurrentBinding({
      datasource: restDatasource,
      query: restQuery,
    })
    const currentSql = getCurrentBinding({
      datasource: sqlDatasource,
      query: sqlQuery,
    })
    const replacements = getLegacyQueryToolBindingReplacements({
      datasources: [restDatasource, sqlDatasource],
      queries: [restQuery, sqlQuery],
    })
    const agent = makeAgent([legacyRest, "other_tool", currentRest, legacySql])

    const resolved = replaceLegacyQueryToolReferences({ agent, replacements })

    expect(resolved.operations?.[0].enabledTools).toEqual([
      {
        toolName: currentRest,
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
      {
        toolName: "other_tool",
        executionPrincipal: ToolExecutionPrincipal.ADMIN,
      },
      {
        toolName: currentSql,
        executionPrincipal: ToolExecutionPrincipal.ADMIN,
      },
    ])
  })

  it("leaves ambiguous and deleted query bindings unresolved", () => {
    const firstDatasource = makeDatasource({
      id: "datasource_first",
      name: "Datasource shared prefix one",
      source: SourceName.POSTGRES,
    })
    const secondDatasource = makeDatasource({
      id: "datasource_second",
      name: "Datasource shared prefix two",
      source: SourceName.POSTGRES,
    })
    const firstQuery = makeQuery({
      id: "query_first_unique_identifier",
      datasourceId: firstDatasource._id!,
      name: "Query name with shared prefix one",
    })
    const secondQuery = makeQuery({
      id: "query_second_unique_identifier",
      datasourceId: secondDatasource._id!,
      name: "Query name with shared prefix two",
    })
    const ambiguousBinding = getLegacyQueryToolRuntimeBinding({
      datasource: firstDatasource,
      query: firstQuery,
    })
    const deletedBinding = "rest_deleted_api_deleted_query"
    const agent = makeAgent([ambiguousBinding, deletedBinding])
    const replacements = getLegacyQueryToolBindingReplacements({
      datasources: [firstDatasource, secondDatasource],
      queries: [firstQuery, secondQuery],
    })

    const resolved = replaceLegacyQueryToolReferences({ agent, replacements })

    expect(resolved).toBe(agent)
    expect(resolved.operations?.[0].enabledTools).toEqual([
      {
        toolName: ambiguousBinding,
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
      {
        toolName: deletedBinding,
        executionPrincipal: ToolExecutionPrincipal.ADMIN,
      },
    ])
  })

  it("does not replace a current binding that is also a legacy binding", () => {
    const datasource = makeDatasource({
      id: "datasource_1",
      name: "D",
      source: SourceName.REST,
    })
    const currentQuery = makeQuery({
      id: "query_current_unique_identifier",
      datasourceId: datasource._id!,
      name: "get",
    })
    const currentBinding = getCurrentBinding({
      datasource,
      query: currentQuery,
    })
    const collidingLegacyQuery = makeQuery({
      id: "query_legacy_unique_identifier",
      datasourceId: datasource._id!,
      name: currentBinding.replace("rest_d_", ""),
    })
    expect(
      getLegacyQueryToolRuntimeBinding({
        datasource,
        query: collidingLegacyQuery,
      })
    ).toBe(currentBinding)
    const agent = makeAgent([currentBinding])
    const replacements = getLegacyQueryToolBindingReplacements({
      datasources: [datasource],
      queries: [currentQuery, collidingLegacyQuery],
    })

    const resolved = replaceLegacyQueryToolReferences({ agent, replacements })

    expect(resolved).toBe(agent)
    expect(resolved.operations?.[0].enabledTools).toEqual([
      {
        toolName: currentBinding,
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
    ])
  })

  it("reconstructs the legacy truncation and sanitisation", () => {
    const datasource = makeDatasource({
      id: "datasource_1",
      name: "A very long datasource name",
      source: SourceName.REST,
    })
    const query = makeQuery({
      id: "query_1",
      datasourceId: datasource._id!,
      name: "A very long query name that exceeds the limit",
    })

    expect(getLegacyQueryToolRuntimeBinding({ datasource, query })).toBe(
      "rest_a_very_long_datasour_a_very_long_query_name_t"
    )
  })
})
