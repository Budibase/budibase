import { describe, expect, it } from "vitest"
import { FieldType, SortOrder } from "@budibase/types"
import type { TableSchema } from "@budibase/types"
import { normalizeSorts } from "./sort"

describe("sort normalization", () => {
  it("does not restore a legacy sort after sorts are explicitly cleared", () => {
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
})
