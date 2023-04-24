import { it, expect, describe, beforeEach, vi } from "vitest"
import { createTablesStore } from "../tables"
import { writable, get } from "svelte/store"

vi.mock("api", () => {
  return {
    API: {
      getTables: vi.fn(),
      fetchTableDefinition: vi.fn(),
      saveTable: vi.fn(),
    },
  }
})

vi.mock("stores/backend", () => {
  return { datasources: vi.fn() }
})

// explict mock that is overwritten later so that the singleton admin store doesn't throw an error when partially mocked
vi.mock("svelte/store", () => {
  return {
    writable: vi.fn(() => ({
      subscribe: vi.fn(),
      update: vi.fn(),
    })),
    get: vi.fn(),
    derived: vi.fn(),
  }
})

describe("tables store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()

    ctx.writableReturn = { update: vi.fn(), subscribe: vi.fn() }
    writable.mockReturnValue(ctx.writableReturn)

    ctx.returnedStore = createTablesStore()
  })

  it("returns the created store", ctx => {
    expect(ctx.returnedStore).toEqual({
      subscribe: expect.toBe(ctx.writableReturn.subscribe),
      init: expect.toBeFunc(),
      fetch: expect.toBeFunc(),
      fetchTable: expect.toBeFunc(),
      select: expect.toBeFunc(),
      save: expect.toBeFunc(),
      delete: expect.toBeFunc(),
      saveField: expect.toBeFunc(),
      deleteField: expect.toBeFunc(),
      updateTable: expect.toBeFunc(),
    })
  })
})
