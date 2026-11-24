import { describe, expect, it } from "vitest"
import { shouldReloadAfterDelete } from "./pagination"

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
