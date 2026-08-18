import { SortOrder, SortType } from "@budibase/types"
import type { ViewV2 } from "@budibase/types"
import { view } from "./views"

const baseView = {
  version: 2,
  id: "view_1",
  name: "View 1",
  tableId: "table_1",
  schema: {},
} satisfies ViewV2

describe("public view mapping", () => {
  it("preserves the single-sort response shape", () => {
    const sort = {
      field: "name",
      order: SortOrder.ASCENDING,
      type: SortType.STRING,
    }

    expect(
      view({
        ...baseView,
        sort: [sort],
      }).sort
    ).toEqual(sort)
  })

  it("preserves every sort in a multi-sort response", () => {
    const sort = [
      {
        field: "name",
        order: SortOrder.ASCENDING,
        type: SortType.STRING,
      },
      {
        field: "createdAt",
        order: SortOrder.DESCENDING,
        type: SortType.STRING,
      },
    ]

    expect(
      view({
        ...baseView,
        sort,
      }).sort
    ).toEqual(sort)
  })
})
