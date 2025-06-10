import { describe, it, expect, vi, beforeEach } from "vitest"
import { writable, get } from "svelte/store"
import { createStores, deriveStores, initialise } from "./conditions"
import { FieldType, EmptyFilterOption } from "@budibase/types"

// Mock the QueryUtils module
vi.mock("../../../utils", () => ({
  derivedMemo: vi.fn((store, fn) => {
    // Simple mock that just derives the value directly
    const derived = writable()
    store.subscribe(value => {
      derived.set(fn(value))
    })
    return derived
  }),
  QueryUtils: {
    buildQuery: vi.fn(() => ({ onEmptyFilter: EmptyFilterOption.RETURN_NONE })),
    runQuery: vi.fn((rows, _query) => rows), // Default to returning all rows (condition matches)
  },
}))

describe("Grid Conditions Store", () => {
  let context
  let conditionStores
  let derivedStores

  beforeEach(() => {
    // Create mock context
    const rows = writable([])
    const columns = writable([])

    context = {
      rows,
      columns,
    }

    // Initialize stores
    conditionStores = createStores()
    derivedStores = deriveStores(context)

    // Combine stores
    Object.assign(context, conditionStores, derivedStores)

    // Initialize the conditions logic
    initialise(context)
  })

  it("should re-evaluate conditions when row data changes even if _rev is the same", async () => {
    const { QueryUtils } = await import("../../../utils")

    // Set up a column with conditions
    const testColumns = [
      {
        name: "status",
        schema: { type: FieldType.STRING },
        conditions: [
          {
            operator: "equal",
            metadataKey: "background",
            metadataValue: "#ff0000",
            target: "cell",
            referenceValue: "active",
          },
        ],
      },
    ]

    // Set up initial rows
    const initialRows = [
      { _id: "row1", _rev: "1-abc", status: "inactive" },
      { _id: "row2", _rev: "2-def", status: "active" },
    ]

    // Mock QueryUtils to return matches only for "active" status
    QueryUtils.runQuery.mockImplementation((rows, _query) => {
      return rows.filter(row => row.value === "active")
    })

    // Set columns and initial rows
    context.columns.set(testColumns)
    context.rows.set(initialRows)

    // Wait for conditions to be evaluated
    await new Promise(resolve => setTimeout(resolve, 0))

    // Check initial metadata - only row2 should have background color
    const initialMetadata = get(context.metadata)
    expect(initialMetadata["row1"]).toEqual({
      version: "1-abc",
      row: {},
      cell: {},
    })
    expect(initialMetadata["row2"]).toEqual({
      version: "2-def",
      row: {},
      cell: {
        status: { background: "#ff0000" },
      },
    })

    // Simulate data refresh: row1 changes from "inactive" to "active" but _rev stays the same
    // This simulates the bug scenario where external data changes but _rev doesn't update
    const refreshedRows = [
      { _id: "row1", _rev: "1-abc", status: "active" }, // Changed data, same _rev
      { _id: "row2", _rev: "2-def", status: "inactive" }, // Changed data, same _rev
    ]

    // Update rows (simulating a data provider refresh)
    context.rows.set(refreshedRows)

    // Wait for conditions to be evaluated
    await new Promise(resolve => setTimeout(resolve, 0))

    // Check metadata after refresh
    const refreshedMetadata = get(context.metadata)

    // Both rows should have been re-evaluated:
    // row1 should now have background color (status changed to "active")
    // row2 should no longer have background color (status changed to "inactive")
    expect(refreshedMetadata["row1"]).toEqual({
      version: "1-abc",
      row: {},
      cell: {
        status: { background: "#ff0000" },
      },
    })
    expect(refreshedMetadata["row2"]).toEqual({
      version: "2-def",
      row: {},
      cell: {},
    })
  })

  it("should re-evaluate all conditions when conditions change", async () => {
    const { QueryUtils } = await import("../../../utils")

    const rows = [{ _id: "row1", _rev: "1-abc", status: "active" }]

    // Mock QueryUtils to always match
    QueryUtils.runQuery.mockImplementation((rows, _query) => rows)

    // Set initial rows
    context.rows.set(rows)

    // Add conditions
    const columnsWithConditions = [
      {
        name: "status",
        schema: { type: FieldType.STRING },
        conditions: [
          {
            operator: "equal",
            metadataKey: "background",
            metadataValue: "#ff0000",
            target: "cell",
            referenceValue: "active",
          },
        ],
      },
    ]

    context.columns.set(columnsWithConditions)

    // Wait for conditions to be evaluated
    await new Promise(resolve => setTimeout(resolve, 0))

    // Check that conditions were applied
    const metadata = get(context.metadata)
    expect(metadata["row1"]).toEqual({
      version: "1-abc",
      row: {},
      cell: {
        status: { background: "#ff0000" },
      },
    })
  })
})
