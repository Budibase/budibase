import type {
  PlatformActionSessionIndexJob,
  PlatformActionSessionMetadata,
} from "@budibase/types"
import { structures } from "../../../../../tests"
import * as context from "../../../../context"
import * as db from "../../../../db"

jest.mock("../sessionIndex")
import { upsertPlatformActionSession } from "../sessionIndex"
import {
  enqueuePlatformActionSessionIndex,
  enqueuePlatformActionSessionLifecycle,
  initPlatformActionSessionIndexQueue,
} from "../indexQueue"

const mockUpsert = upsertPlatformActionSession as jest.MockedFunction<
  typeof upsertPlatformActionSession
>
const mockOnSessionIndexed = jest.fn()

const buildJob = (
  overrides: Partial<PlatformActionSessionIndexJob> = {}
): PlatformActionSessionIndexJob => ({
  workspaceId: db.generateWorkspaceID(structures.tenant.id()),
  environment: "prod",
  indexId: `platform_action_${structures.uuid()}`,
  sourceType: "agent_session",
  sourceId: "session-1",
  incrementsActionCount: true,
  signal: "completed",
  timestamp: new Date().toISOString(),
  ...overrides,
})

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
  beforeAll(() => {
    initPlatformActionSessionIndexQueue({
      onSessionIndexed: mockOnSessionIndexed,
    })
  })

  beforeEach(() => {
    mockUpsert.mockReset()
    mockUpsert.mockResolvedValue(true)
    mockOnSessionIndexed.mockReset()
  })

  it("does not materialize a job twice when enqueued twice with the same indexId", async () => {
    const job = buildJob()

    await enqueuePlatformActionSessionIndex(job)
    await enqueuePlatformActionSessionIndex(job)

    await waitFor(() => mockUpsert.mock.calls.length > 0)
    // give any (unwanted) second delivery a chance to land before asserting
    await new Promise(resolve => setTimeout(resolve, SETTLE_MS))

    expect(mockUpsert).toHaveBeenCalledTimes(1)
  })

  it("enqueues lifecycle signals without incrementing actionCount", async () => {
    const workspaceId = db.generateWorkspaceID(structures.tenant.id())

    await context.doInWorkspaceContext(workspaceId, async () => {
      await enqueuePlatformActionSessionLifecycle({
        sourceType: "agent_session",
        sourceId: "session-1",
        signal: "active",
        lifecycleId: "platform_action_lifecycle_test",
      })
    })

    await waitFor(() => mockUpsert.mock.calls.length > 0)

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        incrementsActionCount: false,
        signal: "active",
        sourceType: "agent_session",
        sourceId: "session-1",
        environment: "prod",
      })
    )
  })

  it("carries the scope's session metadata on lifecycle signals", async () => {
    const workspaceId = db.generateWorkspaceID(structures.tenant.id())
    const metadata: PlatformActionSessionMetadata = {
      asset: { type: "automation", id: "au_1", label: "Ticket triage" },
      triggeredBy: { type: "schedule" },
    }

    await context.doInWorkspaceContext(workspaceId, () =>
      context.doInPlatformActionSessionContext(
        { sourceType: "automation_run", sourceId: "run-1", ...metadata },
        () =>
          enqueuePlatformActionSessionLifecycle({
            sourceType: "automation_run",
            sourceId: "run-1",
            signal: "active",
            lifecycleId: "platform_action_lifecycle_test_metadata",
          })
      )
    )

    await waitFor(() => mockUpsert.mock.calls.length > 0)

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ sourceId: "run-1", metadata })
    )
  })

  it("derives environment: dev when the current context is a dev workspace", async () => {
    const prodWorkspaceId = db.generateWorkspaceID(structures.tenant.id())
    const devWorkspaceId = db.getDevWorkspaceID(prodWorkspaceId)

    await context.doInWorkspaceContext(devWorkspaceId, async () => {
      await enqueuePlatformActionSessionLifecycle({
        sourceType: "agent_session",
        sourceId: "session-2",
        signal: "active",
        lifecycleId: "platform_action_lifecycle_test_dev",
      })
    })

    await waitFor(() => mockUpsert.mock.calls.length > 0)

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceId: "session-2",
        environment: "dev",
      })
    )
  })

  it("notifies the session change once the session doc is written", async () => {
    const job = buildJob({
      environment: "dev",
      sourceType: "automation_run",
      sourceId: "run-notified",
    })

    await enqueuePlatformActionSessionIndex(job)

    await waitFor(() => mockOnSessionIndexed.mock.calls.length > 0)

    expect(mockOnSessionIndexed).toHaveBeenCalledWith({
      workspaceId: job.workspaceId,
      environment: "dev",
      sourceType: "automation_run",
      sourceId: "run-notified",
    })
  })

  it("does not notify when the write is discarded", async () => {
    mockUpsert.mockResolvedValue(false)

    await enqueuePlatformActionSessionIndex(buildJob())

    await waitFor(() => mockUpsert.mock.calls.length > 0)
    await new Promise(resolve => setTimeout(resolve, SETTLE_MS))

    expect(mockOnSessionIndexed).not.toHaveBeenCalled()
  })

  it("notifies only for the retry that writes after a failed attempt", async () => {
    mockUpsert.mockRejectedValueOnce(new Error("lock not acquired"))

    await enqueuePlatformActionSessionIndex(buildJob())

    await waitFor(() => mockOnSessionIndexed.mock.calls.length > 0)
    await new Promise(resolve => setTimeout(resolve, SETTLE_MS))

    expect(mockUpsert).toHaveBeenCalledTimes(2)
    expect(mockOnSessionIndexed).toHaveBeenCalledTimes(1)
  })

  it("does not retry the job when the notification fails", async () => {
    mockOnSessionIndexed.mockImplementation(() => {
      throw new Error("socket unavailable")
    })
    const errorSpy = jest.spyOn(console, "error").mockImplementation()

    await enqueuePlatformActionSessionIndex(buildJob())

    await waitFor(() => mockOnSessionIndexed.mock.calls.length > 0)
    // InMemoryQueue retries a failed job after 100ms
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(mockUpsert).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith(
      "Failed to notify platform action session change",
      expect.objectContaining({ err: expect.any(Error) })
    )
    errorSpy.mockRestore()
  })
})

describe("initPlatformActionSessionIndexQueue", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("is not started by enqueuing a job", async () => {
    jest.resetModules()
    const freshQueue = await import("../../../../queue")
    const processSpy = jest.spyOn(freshQueue.BudibaseQueue.prototype, "process")
    const freshIndexQueue = await import("../indexQueue")

    await freshIndexQueue.enqueuePlatformActionSessionIndex(buildJob())

    expect(processSpy).not.toHaveBeenCalled()
  })

  it("resets the initialised guard when process() rejects asynchronously, then stops retrying once it succeeds", async () => {
    jest.resetModules()
    const freshQueue = await import("../../../../queue")
    const processSpy = jest
      .spyOn(freshQueue.BudibaseQueue.prototype, "process")
      .mockRejectedValueOnce(new Error("redis unreachable"))
      .mockImplementationOnce(() => new Promise<void>(() => {}))
    const errorSpy = jest.spyOn(console, "error").mockImplementation()

    const freshIndexQueue = await import("../indexQueue")

    await freshIndexQueue.initPlatformActionSessionIndexQueue()
    expect(processSpy).toHaveBeenCalledTimes(1)

    // The guard must have been reset by the failed attempt above - a second
    // call should try process() again instead of treating the queue as
    // already (falsely) initialised.
    freshIndexQueue.initPlatformActionSessionIndexQueue()
    expect(processSpy).toHaveBeenCalledTimes(2)

    // Once process() is up and running (its returned promise stays
    // pending), further calls must not attempt to re-register it.
    await freshIndexQueue.initPlatformActionSessionIndexQueue()
    expect(processSpy).toHaveBeenCalledTimes(2)

    expect(errorSpy).toHaveBeenCalledWith(
      "Platform action session index queue processor failed to start",
      expect.any(Error)
    )
  })
})
