import { FUNCTION_QUERY_RESPONSE_LIMITS } from "@budibase/shared-core"
import {
  SourceName,
  type FunctionQueryCapability,
  type FunctionQueryCatalogEntry,
  type FunctionQueryResponseSchema,
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
  it("preserves resolved query metadata when its catalog entry is missing", () => {
    const persisted: FunctionQueryCapability = {
      ...capabilities[0],
      responseSchema: { fields: [{ name: "name", type: "string" }] },
    }
    expect(
      getFunctionEditorCapabilities({
        capabilities: [persisted],
        catalog: [],
      })
    ).toEqual([persisted])
  })

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

  it("uses the compiler fallback for unsupported response field types", () => {
    const schema: FunctionQueryResponseSchema = {
      fields: [{ name: "value", type: "string" }],
    }
    Object.assign(schema.fields[0], { type: "unsupported" })
    expect(
      getFunctionQueryCompletions(
        [{ ...capabilities[0], responseSchema: schema }],
        "crm"
      )
    ).toEqual([
      {
        label: "findCustomer",
        parameterNames: ["customerId"],
        info: "Returns JsonValue",
      },
    ])
  })

  it("uses the compiler fallback for oversized response schemas", () => {
    const schema: FunctionQueryResponseSchema = {
      fields: Array.from(
        { length: FUNCTION_QUERY_RESPONSE_LIMITS.maxFields + 1 },
        (_, i) => ({ name: `field${i}`, type: "string" })
      ),
    }
    expect(
      getFunctionQueryCompletions(
        [{ ...capabilities[0], responseSchema: schema }],
        "crm"
      )
    ).toEqual([
      {
        label: "findCustomer",
        parameterNames: ["customerId"],
        info: "Returns JsonValue",
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
