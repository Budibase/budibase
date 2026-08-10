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
        queryId: "query_rest_1",
      })
    ).toEqual({
      readableBinding: "api.owen_wilson_api.GET random wow",
      runtimeBinding: "rest_owen-wilson_api_get_random_wow_query_rest_1",
    })
  })

  it("builds datasource query bindings", () => {
    expect(
      getQueryToolBindings({
        sourceType: ToolType.DATASOURCE_QUERY,
        sourceLabel: "Sales Warehouse",
        queryName: "Monthly Sales",
        queryId: "query_datasource_1",
      })
    ).toEqual({
      readableBinding: "sales_warehouse.Monthly Sales",
      runtimeBinding: "ds_sales_warehouse_monthly_sales_ery_datasource_1",
    })
  })

  it("keeps the existing runtime length limits", () => {
    expect(
      getQueryToolBindings({
        sourceType: ToolType.REST_QUERY,
        sourceLabel: "A very long datasource name",
        queryName: "A very long query name that exceeds the limit",
        queryId: "query_0123456789abcdef0123456789abcdef",
      }).runtimeBinding
    ).toBe("rest_a_very_long_datasour_a_very_long_query_na_0123456789abcdef")
  })

  it("preserves readable bindings for symbol-only datasource names", () => {
    expect(
      getQueryToolBindings({
        sourceType: ToolType.REST_QUERY,
        sourceLabel: "🚀",
        queryName: "Launch",
        queryId: "query_launch",
      })
    ).toEqual({
      readableBinding: "api..Launch",
      runtimeBinding: "rest_datasource_launch_query_launch",
    })
  })

  it("keeps runtime bindings unique when readable segments collide", () => {
    const first = getQueryToolBindings({
      sourceType: ToolType.DATASOURCE_QUERY,
      sourceLabel: "Datasource name with a shared prefix one",
      queryName: "Query name with a shared prefix one",
      queryId: "query_datasource_0123456789abcdef",
    })
    const second = getQueryToolBindings({
      sourceType: ToolType.DATASOURCE_QUERY,
      sourceLabel: "Datasource name with a shared prefix two",
      queryName: "Query name with a shared prefix two",
      queryId: "query_datasource_fedcba9876543210",
    })

    expect(first.runtimeBinding).not.toBe(second.runtimeBinding)
  })
})
