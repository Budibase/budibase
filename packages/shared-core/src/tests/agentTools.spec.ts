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

  it("prevents collisions by appending query ID suffix", () => {
    const binding1 = getQueryToolBindings({
      sourceType: ToolType.REST_QUERY,
      sourceLabel: "A very long datasource name",
      queryName: "A very long query name that exceeds the limit",
      queryId: "query_abc123",
    })
    const binding2 = getQueryToolBindings({
      sourceType: ToolType.REST_QUERY,
      sourceLabel: "A very long datasource name",
      queryName: "A very long query name that exceeds the limit",
      queryId: "query_xyz789",
    })

    expect(binding1.runtimeBinding).toBe(
      "rest_a_very_long_datasour_a_very_long_query_name_t_abc123"
    )
    expect(binding2.runtimeBinding).toBe(
      "rest_a_very_long_datasour_a_very_long_query_name_t_xyz789"
    )
    expect(binding1.runtimeBinding).not.toBe(binding2.runtimeBinding)
  })

  it("prevents datasource name collisions with query ID", () => {
    const binding1 = getQueryToolBindings({
      sourceType: ToolType.DATASOURCE_QUERY,
      sourceLabel: "Sales Warehouse 2024",
      queryName: "Monthly Sales",
      queryId: "query_001",
    })
    const binding2 = getQueryToolBindings({
      sourceType: ToolType.DATASOURCE_QUERY,
      sourceLabel: "Sales Warehouse 2025",
      queryName: "Monthly Sales",
      queryId: "query_002",
    })

    expect(binding1.runtimeBinding).toBe("ds_sales_warehouse_2024_monthly_sales_001")
    expect(binding2.runtimeBinding).toBe("ds_sales_warehouse_2025_monthly_sales_002")
    expect(binding1.runtimeBinding).not.toBe(binding2.runtimeBinding)
  })

  it("prevents query name collisions with query ID", () => {
    const binding1 = getQueryToolBindings({
      sourceType: ToolType.REST_QUERY,
      sourceLabel: "API",
      queryName: "Get users from database and filter by role",
      queryId: "query_user1",
    })
    const binding2 = getQueryToolBindings({
      sourceType: ToolType.REST_QUERY,
      sourceLabel: "API",
      queryName: "Get users from database and filter by status",
      queryId: "query_user2",
    })

    expect(binding1.runtimeBinding).toBe("rest_api_get_users_from_databas_user1")
    expect(binding2.runtimeBinding).toBe("rest_api_get_users_from_databas_user2")
    expect(binding1.runtimeBinding).not.toBe(binding2.runtimeBinding)
  })

  it("handles query IDs without underscore", () => {
    const binding = getQueryToolBindings({
      sourceType: ToolType.REST_QUERY,
      sourceLabel: "API",
      queryName: "Test",
      queryId: "abc123",
    })

    expect(binding.runtimeBinding).toBe("rest_api_test_abc123")
  })

  it("maintains backward compatibility without queryId", () => {
    const bindingWithout = getQueryToolBindings({
      sourceType: ToolType.REST_QUERY,
      sourceLabel: "Owen-Wilson API",
      queryName: "GET random wow",
    })
    const bindingWith = getQueryToolBindings({
      sourceType: ToolType.REST_QUERY,
      sourceLabel: "Owen-Wilson API",
      queryName: "GET random wow",
      queryId: undefined,
    })

    expect(bindingWithout.runtimeBinding).toBe("rest_owen-wilson_api_get_random_wow")
    expect(bindingWith.runtimeBinding).toBe("rest_owen-wilson_api_get_random_wow")
  })
})
