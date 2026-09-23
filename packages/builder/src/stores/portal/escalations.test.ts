import { get } from "svelte/store"
import { afterEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  fetchEscalationResult: vi.fn(),
  resolveEscalation: vi.fn(),
}))

vi.mock("@/api", () => ({ API: mocks }))

import { EscalationsStore } from "./escalations"

describe("EscalationsStore", () => {
  const store = new EscalationsStore()

  afterEach(() => {
    store.reset()
    vi.clearAllMocks()
  })

  it("fetches a tracked escalation immediately", async () => {
    mocks.fetchEscalationResult.mockResolvedValue({ resolution: "resolved" })

    store.track("escalation-1")

    await vi.waitFor(() => {
      expect(mocks.fetchEscalationResult).toHaveBeenCalledWith(
        "escalation-1",
        expect.any(AbortSignal)
      )
      expect(get(store.store).escalations["escalation-1"]?.resolution).toBe(
        "resolved"
      )
    })
  })
})
