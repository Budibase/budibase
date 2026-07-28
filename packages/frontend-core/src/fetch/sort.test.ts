import { describe, expect, it } from "vitest"
import { FieldType, SortOrder, SortType } from "@budibase/types"
import type { TableSchema } from "@budibase/types"
import { normalizeSorts } from "./sort"

describe("sort normalization", () => {
  it("does not restore the single-sort options after sorts are explicitly cleared", () => {
    const schema: TableSchema = {
      name: {
        name: "name",
        type: FieldType.STRING,
      },
    }

    expect(
      normalizeSorts(
        {
          sorts: [],
          sortColumn: "name",
          sortOrder: SortOrder.DESCENDING,
          sortType: null,
        },
        schema,
        null
      )
    ).toEqual([])
  })

  it("normalizes every configured sort", () => {
    const schema: TableSchema = {
      name: {
        name: "name",
        type: FieldType.STRING,
      },
      count: {
        name: "count",
        type: FieldType.NUMBER,
      },
    }

    expect(
      normalizeSorts(
        {
          sorts: [
            {
              field: "name",
              order: SortOrder.DESCENDING,
            },
            {
              field: "count",
            },
          ],
          sortColumn: null,
          sortOrder: SortOrder.ASCENDING,
          sortType: null,
        },
        schema,
        null
      )
    ).toEqual([
      {
        field: "name",
        order: SortOrder.DESCENDING,
        type: SortType.STRING,
      },
      {
        field: "count",
        order: SortOrder.ASCENDING,
        type: SortType.NUMBER,
      },
    ])
  })
})
