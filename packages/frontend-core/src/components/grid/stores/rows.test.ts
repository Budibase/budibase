import { describe, expect, it, vi } from "vitest"

vi.mock("@budibase/bbui", () => ({ Helpers: {} }))
vi.mock("../../../utils", () => ({ getRelatedTableValues: vi.fn() }))
vi.mock("../../../fetch", () => ({ fetchData: vi.fn() }))

import { shouldReloadAfterDelete } from "./rows"

describe("shouldReloadAfterDelete", () => {
  it("reloads when every loaded row was deleted and more rows exist", () => {
    expect(
      shouldReloadAfterDelete({ remainingRowCount: 0, hasNextPage: true })
    ).toBe(true)
  })

  it("does not reload when there are no more pages", () => {
    expect(
      shouldReloadAfterDelete({ remainingRowCount: 0, hasNextPage: false })
    ).toBe(false)
  })

  it("does not reload when some loaded rows remain", () => {
    expect(
      shouldReloadAfterDelete({ remainingRowCount: 1, hasNextPage: true })
    ).toBe(false)
  })
})
