import type { FunctionQueryCapability } from "@budibase/types"
import { describe, expect, it } from "vitest"
import {
  getFunctionDatasourceCompletions,
  getFunctionQueryCompletions,
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
  it("includes each explicitly linked datasource once", () => {
    expect(getFunctionDatasourceCompletions(capabilities)).toEqual([
      "crm",
      "events",
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
