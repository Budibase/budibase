import { get } from "svelte/store"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  fetchEscalationResult: vi.fn(),
  resolveEscalation: vi.fn(),
}))

vi.mock("@/api", () => ({ API: mocks }))

import { EscalationsStore } from "./escalations"

describe("EscalationsStore", () => {
  let store: EscalationsStore

  beforeEach(() => {
    store = new EscalationsStore()
  })

  afterEach(() => {
    store.reset()
    vi.resetAllMocks()
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

  it("starts a new poll while the reset poll is still settling", async () => {
    let finishFirstPoll: (result: { resolution: "resolved" }) => void
    mocks.fetchEscalationResult
      .mockImplementationOnce(
        () =>
          new Promise(resolve => {
            finishFirstPoll = resolve
          })
      )
      .mockResolvedValueOnce({ resolution: "resolved" })

    store.track("escalation-1")
    await vi.waitFor(() => {
      expect(mocks.fetchEscalationResult).toHaveBeenCalledTimes(1)
    })

    store.reset()
    store.track("escalation-2")

    await vi.waitFor(() => {
      expect(mocks.fetchEscalationResult).toHaveBeenCalledTimes(2)
      expect(get(store.store).escalations["escalation-2"]?.resolution).toBe(
        "resolved"
      )
    })

    finishFirstPoll!({ resolution: "resolved" })
    await Promise.resolve()

    expect(get(store.store).escalations["escalation-1"]).toBeUndefined()
  })
})
