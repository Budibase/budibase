import { ToolType } from "@budibase/types"
import { getQueryToolBindings, isQueryToolType } from "../agentTools"

describe("isQueryToolType", () => {
  it("identifies query tool types", () => {
    expect(isQueryToolType(ToolType.REST_QUERY)).toBe(true)
    expect(isQueryToolType(ToolType.DATASOURCE_QUERY)).toBe(true)
    expect(isQueryToolType(ToolType.AUTOMATION)).toBe(false)
    expect(isQueryToolType(undefined)).toBe(false)
  })
})

describe("getQueryToolBindings", () => {
  it("builds REST query bindings", () => {
    expect(
      getQueryToolBindings({
        sourceType: ToolType.REST_QUERY,
        sourceLabel: "Owen-Wilson API",
        queryName: "GET random wow",
      })
    ).toEqual({
      readableBinding: "api.owen_wilson_api.GET random wow",
      runtimeBinding: "rest_owen-wilson_api_get_random_wow",
    })
  })

  it("builds datasource query bindings", () => {
    expect(
      getQueryToolBindings({
        sourceType: ToolType.DATASOURCE_QUERY,
        sourceLabel: "Sales Warehouse",
        queryName: "Monthly Sales",
      })
    ).toEqual({
      readableBinding: "sales_warehouse.Monthly Sales",
      runtimeBinding: "ds_sales_warehouse_monthly_sales",
    })
  })

  it("keeps the existing runtime length limits", () => {
    expect(
      getQueryToolBindings({
        sourceType: ToolType.REST_QUERY,
        sourceLabel: "A very long datasource name",
        queryName: "A very long query name that exceeds the limit",
      }).runtimeBinding
    ).toBe("rest_a_very_long_datasour_a_very_long_query_name_t")
  })

  it("preserves readable bindings for symbol-only datasource names", () => {
    expect(
      getQueryToolBindings({
        sourceType: ToolType.REST_QUERY,
        sourceLabel: "🚀",
        queryName: "Launch",
      })
    ).toEqual({
      readableBinding: "api..Launch",
      runtimeBinding: "rest_datasource_launch",
    })
  })
})
