import type {
  FunctionQueryCapabilityInput,
  FunctionQueryCatalogEntry,
} from "@budibase/types"
import { SourceName } from "@budibase/types"
import { describe, expect, it } from "vitest"
import {
  hasFunctionQueryAliasErrors,
  toFunctionQueryAlias,
  validateFunctionQueryAliases,
} from "./queryAliases"

const catalog: FunctionQueryCatalogEntry[] = [
  {
    queryId: "query_customers",
    queryName: "Find customer",
    datasourceId: "datasource_crm",
    datasourceName: "Customer CRM",
    source: SourceName.POSTGRES,
    kind: "data",
    parameters: [{ name: "id" }],
  },
  {
    queryId: "query_orders",
    queryName: "Find orders",
    datasourceId: "datasource_crm",
    datasourceName: "Customer CRM",
    source: SourceName.POSTGRES,
    kind: "data",
    parameters: [],
  },
  {
    queryId: "query_events",
    queryName: "Send event",
    datasourceId: "datasource_api",
    datasourceName: "Events API",
    source: SourceName.REST,
    kind: "api",
    parameters: [],
  },
]

const validate = (capabilities: FunctionQueryCapabilityInput[]) =>
  validateFunctionQueryAliases({ capabilities, catalog, catalogLoaded: true })

describe("Function query aliases", () => {
  it("generates stable JavaScript identifiers from display names", () => {
    expect(toFunctionQueryAlias("Customer CRM", "datasource")).toBe(
      "customerCRM"
    )
    expect(toFunctionQueryAlias("123", "query")).toBe("query")
    expect(toFunctionQueryAlias("default", "query")).toBe("default")
  })

  it("rejects invalid identifiers", () => {
    const errors = validate([
      {
        queryId: "query_customers",
        datasourceAlias: "customer data",
        queryAlias: "invalid-alias",
      },
    ])

    expect(errors[0]).toEqual({
      datasourceAlias: "Use a JavaScript identifier, for example customerData.",
      queryAlias: "Use a JavaScript identifier, for example customerData.",
    })
    expect(hasFunctionQueryAliasErrors(errors)).toBe(true)
  })

  it("allows reserved words as property aliases", () => {
    const errors = validate([
      {
        queryId: "query_customers",
        datasourceAlias: "default",
        queryAlias: "class",
      },
    ])

    expect(hasFunctionQueryAliasErrors(errors)).toBe(false)
  })

  it("rejects datasource and query alias collisions", () => {
    const errors = validate([
      {
        queryId: "query_customers",
        datasourceAlias: "data",
        queryAlias: "find",
      },
      {
        queryId: "query_events",
        datasourceAlias: "data",
        queryAlias: "find",
      },
    ])

    expect(errors[1].datasourceAlias).toBe(
      "This alias is already used by another datasource."
    )
    expect(errors[0].queryAlias).toBe(
      "This query alias is already linked for this datasource."
    )
    expect(errors[1].queryAlias).toBe(
      "This query alias is already linked for this datasource."
    )
  })

  it("requires one stable alias for queries from the same datasource", () => {
    const errors = validate([
      {
        queryId: "query_customers",
        datasourceAlias: "crm",
        queryAlias: "customer",
      },
      {
        queryId: "query_orders",
        datasourceAlias: "customerData",
        queryAlias: "orders",
      },
    ])

    expect(errors[1].datasourceAlias).toBe(
      "Use the same alias for every query from this datasource."
    )
  })

  it("preserves the first error when both datasource alias rules fail", () => {
    const errors = validate([
      {
        queryId: "query_customers",
        datasourceAlias: "a",
        queryAlias: "customers",
      },
      {
        queryId: "query_events",
        datasourceAlias: "b",
        queryAlias: "events",
      },
      {
        queryId: "query_orders",
        datasourceAlias: "b",
        queryAlias: "orders",
      },
    ])

    expect(errors[2].datasourceAlias).toBe(
      "This alias is already used by another datasource."
    )
  })

  it("blocks missing queries only after the catalog loads", () => {
    const capabilities = [
      {
        queryId: "query_missing_one",
        datasourceAlias: "legacyDatasource",
        queryAlias: "first",
      },
    ]

    const pendingErrors = validateFunctionQueryAliases({
      capabilities,
      catalog,
      catalogLoaded: false,
    })
    expect(hasFunctionQueryAliasErrors(pendingErrors)).toBe(false)

    const loadedErrors = validate(capabilities)
    expect(loadedErrors[0].missingQuery).toBe(
      "Remove this link before saving, or restore the saved query."
    )
    expect(hasFunctionQueryAliasErrors(loadedErrors)).toBe(true)
  })

  it("does not infer datasource collisions for missing catalog entries", () => {
    const errors = validate([
      {
        queryId: "query_missing_one",
        datasourceAlias: "legacyDatasource",
        queryAlias: "first",
      },
      {
        queryId: "query_missing_two",
        datasourceAlias: "legacyDatasource",
        queryAlias: "second",
      },
    ])

    expect(errors[0].datasourceAlias).toBeUndefined()
    expect(errors[1].datasourceAlias).toBeUndefined()
  })
})
