import { beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"
import { FieldType, RelationshipType, TableSourceType } from "@budibase/types"
import type { FindTableResponse } from "@budibase/types"
import { API } from "@/api"
import { TableStore } from "../tables"

vi.mock("@/api", () => ({
  API: {
    getTables: vi.fn(),
    getTable: vi.fn(),
    saveTable: vi.fn(),
    deleteTable: vi.fn(),
  },
}))

const target: FindTableResponse = {
  _id: "ta_target",
  _rev: "1-target",
  type: "table",
  name: "Target",
  sourceId: "bb_internal",
  sourceType: TableSourceType.INTERNAL,
  schema: {},
}
const source: FindTableResponse = {
  ...target,
  _id: "ta_source",
  name: "Source",
  schema: {
    target: {
      name: "target",
      type: FieldType.LINK,
      tableId: "ta_target",
      fieldName: "sources",
      relationshipType: RelationshipType.MANY_TO_ONE,
    },
  },
}
const savedSource: FindTableResponse = { ...source, schema: {} }

describe("table relationship cleanup", () => {
  let store: TableStore

  beforeEach(() => {
    vi.resetAllMocks()
    store = new TableStore()
    store.set({ list: [source, target], selectedTableId: source._id })
    vi.mocked(API.saveTable).mockResolvedValue(savedSource)
  })

  it("removes stale related tables without failing a successful column deletion", async () => {
    vi.mocked(API.getTable).mockRejectedValue({
      status: 404,
      message: "CouchDB error: deleted",
    })

    await store.deleteField({ name: "target" })

    expect(get(store).list).toEqual([savedSource])
    expect(get(store).selected).toEqual(savedSource)
  })

  it("refreshes surviving related tables when a relationship is removed", async () => {
    const updatedTarget = { ...target, _rev: "2-target" }
    vi.mocked(API.getTable).mockResolvedValue(updatedTarget)

    await store.deleteField({ name: "target" })

    expect(get(store).list).toEqual([savedSource, updatedTarget])
  })

  it("propagates failures other than a missing related table", async () => {
    const error = { status: 500, message: "Database unavailable" }
    vi.mocked(API.getTable).mockRejectedValue(error)

    await expect(store.deleteField({ name: "target" })).rejects.toEqual(error)
  })

  it("refreshes relationship schemas after deleting a table", async () => {
    vi.mocked(API.getTables).mockResolvedValue([savedSource])

    await store.delete({ _id: "ta_target", _rev: "1-target" })

    expect(get(store).list).toEqual([savedSource])
    expect(get(store).selected).toEqual(savedSource)
  })
})
