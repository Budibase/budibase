// @vitest-environment jsdom

import { describe, expect, it } from "vitest"
import type { APIClient } from "../api/types"
import type { Row, SearchFilters } from "@budibase/types"
import { SortOrder } from "@budibase/types"
import BaseDataFetch from "./DataFetch"

interface TestDatasource {
  type: "viewV2"
}

interface TestDefinition {
  schema: Record<string, { type: string }>
}

class TestDataFetch extends BaseDataFetch<
  TestDatasource,
  TestDefinition,
  SearchFilters
> {
  async getDefinition() {
    return {
      schema: {
        name: {
          type: "string",
        },
      },
    }
  }

  async getData(): Promise<{ rows: Row[] }> {
    return { rows: [] }
  }

  getDefaultSortColumn() {
    return null
  }
}

describe("DataFetch sorting", () => {
  it("does not restore a legacy sort after sorts are explicitly cleared", async () => {
    const fetch = new TestDataFetch({
      API: {} as APIClient,
      datasource: { type: "viewV2" },
      query: {},
    })
    fetch.options.sortColumn = "name"
    fetch.options.sortOrder = SortOrder.DESCENDING
    fetch.options.sorts = []

    await fetch.getInitialData()

    expect(fetch.options.sorts).toEqual([])
    expect(fetch.options.sortColumn).toBeNull()
    expect(fetch.options.sortOrder).toEqual(SortOrder.ASCENDING)
    expect(fetch.options.sortType).toBeNull()
  })
})
