import type { PlatformActionSessionIndexJob } from "@budibase/types"
import { structures } from "../../../../../tests"
import * as db from "../../../../db"

jest.mock("../sessionIndex")
import { upsertPlatformActionSession } from "../sessionIndex"
import { enqueuePlatformActionSessionIndex } from "../indexQueue"

const mockUpsert = upsertPlatformActionSession as jest.MockedFunction<
  typeof upsertPlatformActionSession
>

const POLL_INTERVAL_MS = 10
const WAIT_TIMEOUT_MS = 1000
// long enough for InMemoryQueue's async message handler to run a second
// delivery, if the enqueue-side dedupe failed to prevent one
const SETTLE_MS = 50

async function waitFor(predicate: () => boolean, timeoutMs = WAIT_TIMEOUT_MS) {
  const start = Date.now()
  while (!predicate()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error("Timed out waiting for condition")
    }
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS))
  }
}

describe("enqueuePlatformActionSessionIndex", () => {
  beforeEach(() => {
    mockUpsert.mockClear()
    mockUpsert.mockResolvedValue(undefined)
  })

  it("does not materialize a job twice when enqueued twice with the same platformActionId", async () => {
    const workspaceId = db.generateWorkspaceID(structures.tenant.id())
    const job: PlatformActionSessionIndexJob = {
      workspaceId,
      platformActionId: `platformaction_${structures.uuid()}`,
      sourceType: "agent_session",
      sourceId: "session-1",
      eventName: "action:ai_agent:executed",
      outcome: "success",
      timestamp: new Date().toISOString(),
    }

    await enqueuePlatformActionSessionIndex(job)
    await enqueuePlatformActionSessionIndex(job)

    await waitFor(() => mockUpsert.mock.calls.length > 0)
    // give any (unwanted) second delivery a chance to land before asserting
    await new Promise(resolve => setTimeout(resolve, SETTLE_MS))

    expect(mockUpsert).toHaveBeenCalledTimes(1)
  })
})
