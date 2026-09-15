import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"
import type { EscalationReviewDetails } from "@budibase/types"
import { API } from "@/api"
import { EscalationsStore } from "./escalations"

vi.mock("@/api", () => {
  return {
    API: {
      fetchEscalationContext: vi.fn(),
      fetchEscalationResult: vi.fn(),
      resolveEscalation: vi.fn(),
    },
  }
})

const fetchEscalationContext = vi.mocked(API.fetchEscalationContext)
const fetchEscalationResult = vi.mocked(API.fetchEscalationResult)

const POLL_INTERVAL_MS = 5000

const reviewDetails: EscalationReviewDetails = {
  title: "Approval needed",
  summary: "Approve the refund",
  reviewContext: {
    requestedBy: "Ada",
    operation: "Refunds",
    action: "issue a refund",
  },
}

describe("EscalationsStore polling", () => {
  let store: EscalationsStore
  let warn: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    store = new EscalationsStore()
  })

  afterEach(() => {
    store.stop()
    vi.useRealTimers()
    warn.mockRestore()
  })

  it("keeps a review context fetched alongside a failing result poll", async () => {
    fetchEscalationContext.mockResolvedValue(reviewDetails)
    fetchEscalationResult
      .mockRejectedValueOnce(new Error("result unavailable"))
      .mockResolvedValue({ resolution: "pending" })

    store.track("escalation_1")
    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS)

    expect(fetchEscalationContext).toHaveBeenCalledTimes(1)
    expect(get(store.store).escalations.escalation_1).toMatchObject({
      escalationId: "escalation_1",
      resolution: "pending",
      reviewContext: reviewDetails.reviewContext,
    })
  })

  it("does not retry a failed context fetch", async () => {
    fetchEscalationContext.mockRejectedValue(new Error("context unavailable"))
    fetchEscalationResult.mockResolvedValue({ resolution: "pending" })

    store.track("escalation_1")
    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * 5)

    expect(fetchEscalationContext).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(fetchEscalationResult.mock.calls.length).toBeGreaterThan(3)
    expect(get(store.store).escalations.escalation_1).toMatchObject({
      resolution: "pending",
    })
  })
})
