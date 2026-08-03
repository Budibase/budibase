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
  validateFunctionQueryAliases(capabilities, catalog)

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

    expect(hasFunctionQueryAliasErrors(errors)).toBe(false)
  })
})
