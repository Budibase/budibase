import {
  SourceName,
  type FunctionQueryCapability,
  type FunctionQueryCatalogEntry,
} from "@budibase/types"
import { describe, expect, it } from "vitest"
import {
  getFunctionDatasourceCompletions,
  getFunctionQueryCompletions,
  getFunctionEditorCapabilities,
} from "./functionCompletions"

const capabilities: FunctionQueryCapability[] = [
  {
    capabilityId: "cap_customer",
    queryId: "query_customer",
    datasourceAlias: "crm",
    queryAlias: "findCustomer",
    parameterNames: ["customerId"],
  },
  {
    capabilityId: "cap_order",
    queryId: "query_order",
    datasourceAlias: "crm",
    queryAlias: "findOrder",
    parameterNames: [],
  },
  {
    capabilityId: "cap_event",
    queryId: "query_event",
    datasourceAlias: "events",
    queryAlias: "send",
    parameterNames: ["body"],
  },
]

describe("Function completions", () => {
  it("uses live catalog response types instead of the persisted Function schema", () => {
    const persisted: FunctionQueryCapability = {
      ...capabilities[0],
      responseSchema: { fields: [{ name: "old", type: "string" }] },
    }
    const query: FunctionQueryCatalogEntry = {
      queryId: persisted.queryId,
      queryName: "Customer query",
      datasourceId: "datasource_customer",
      datasourceName: "Customers",
      source: SourceName.MONGODB,
      kind: "data",
      parameters: [{ name: "newParameter" }],
      responseSchema: { fields: [{ name: "current", type: "number" }] },
    }
    expect(
      getFunctionEditorCapabilities({
        capabilities: [persisted],
        catalog: [query],
      })
    ).toEqual([
      {
        ...persisted,
        parameterNames: ["newParameter"],
        responseSchema: query.responseSchema,
      },
    ])
    expect(
      getFunctionEditorCapabilities({
        capabilities: [persisted],
        catalog: [{ ...query, responseSchema: undefined }],
      })
    ).toEqual([
      {
        ...persisted,
        parameterNames: ["newParameter"],
        responseSchema: undefined,
      },
    ])
  })

  it("includes each explicitly linked datasource once", () => {
    expect(getFunctionDatasourceCompletions(capabilities)).toEqual([
      "crm",
      "events",
    ])
  })

  it("includes saved response field types in query completions", () => {
    const typed: FunctionQueryCapability = {
      ...capabilities[0],
      responseSchema: {
        fields: [
          { name: "name", type: "string" },
          { name: "values", type: "array" },
        ],
      },
    }
    expect(getFunctionQueryCompletions([typed], "crm")).toEqual([
      {
        label: "findCustomer",
        parameterNames: ["customerId"],
        info: 'Returns rows under data with optional, nullable fields:\n"name"?: string | null\n"values"?: JsonValue[] | null',
      },
    ])
  })

  it("only includes queries linked beneath the selected datasource", () => {
    expect(getFunctionQueryCompletions(capabilities, "crm")).toEqual([
      { label: "findCustomer", parameterNames: ["customerId"] },
      { label: "findOrder", parameterNames: [] },
    ])
    expect(getFunctionQueryCompletions(capabilities, "missing")).toEqual([])
  })
})
