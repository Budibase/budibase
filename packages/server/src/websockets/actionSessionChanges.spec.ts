import { db as dbCore } from "@budibase/backend-core"
import { PlatformActionSessionChange } from "@budibase/types"
import {
  ACTION_SESSION_CHANGE_FLUSH_MS,
  MAX_ACTION_SESSION_CHANGES_PER_EVENT,
  queueActionSessionChange,
} from "./actionSessionChanges"
import { builderSocket } from "./index"

jest.mock("./index", () => ({
  builderSocket: { emitActionSessionChange: jest.fn() },
}))

const emitMock = builderSocket!.emitActionSessionChange as jest.Mock

describe("queueActionSessionChange", () => {
  const workspaceId = dbCore.generateWorkspaceID()
  const devWorkspaceId = dbCore.getDevWorkspaceID(workspaceId)

  const change = (
    overrides: Partial<PlatformActionSessionChange> = {}
  ): PlatformActionSessionChange => ({
    workspaceId,
    environment: "prod",
    sourceType: "automation_run",
    sourceId: "run-1",
    ...overrides,
  })

  beforeEach(() => {
    jest.useFakeTimers()
    emitMock.mockReset()
  })

  afterEach(() => {
    // Flush windows left open by a test so they don't leak into the next one
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("emits one deduplicated event to the dev workspace room per flush window", () => {
    queueActionSessionChange(change())
    queueActionSessionChange(change())
    queueActionSessionChange(change({ sourceId: "run-2" }))
    queueActionSessionChange(
      change({ sourceType: "agent_session", sourceId: "run-2" })
    )

    jest.advanceTimersByTime(ACTION_SESSION_CHANGE_FLUSH_MS)

    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(devWorkspaceId, {
      environment: "prod",
      sessions: [
        { sourceType: "automation_run", sourceId: "run-1" },
        { sourceType: "automation_run", sourceId: "run-2" },
        { sourceType: "agent_session", sourceId: "run-2" },
      ],
    })
  })

  it("uses the dev workspace room for dev and prod workspace IDs", () => {
    queueActionSessionChange(change({ workspaceId: devWorkspaceId }))
    queueActionSessionChange(change({ sourceId: "run-2" }))

    jest.advanceTimersByTime(ACTION_SESSION_CHANGE_FLUSH_MS)

    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(devWorkspaceId, {
      environment: "prod",
      sessions: [
        { sourceType: "automation_run", sourceId: "run-1" },
        { sourceType: "automation_run", sourceId: "run-2" },
      ],
    })
  })

  it("does not emit before the flush window ends", () => {
    queueActionSessionChange(change())

    jest.advanceTimersByTime(ACTION_SESSION_CHANGE_FLUSH_MS - 1)

    expect(emitMock).not.toHaveBeenCalled()
  })

  it("keeps environments and workspaces in separate events", () => {
    const otherWorkspaceId = dbCore.generateWorkspaceID()

    queueActionSessionChange(change())
    queueActionSessionChange(change({ environment: "dev" }))
    queueActionSessionChange(change({ workspaceId: otherWorkspaceId }))

    jest.advanceTimersByTime(ACTION_SESSION_CHANGE_FLUSH_MS)

    const session = { sourceType: "automation_run", sourceId: "run-1" }
    expect(emitMock).toHaveBeenCalledTimes(3)
    expect(emitMock).toHaveBeenCalledWith(devWorkspaceId, {
      environment: "prod",
      sessions: [session],
    })
    expect(emitMock).toHaveBeenCalledWith(devWorkspaceId, {
      environment: "dev",
      sessions: [session],
    })
    expect(emitMock).toHaveBeenCalledWith(
      dbCore.getDevWorkspaceID(otherWorkspaceId),
      { environment: "prod", sessions: [session] }
    )
  })

  it("caps the listed sessions and flags the event as truncated", () => {
    for (let i = 0; i <= MAX_ACTION_SESSION_CHANGES_PER_EVENT; i++) {
      queueActionSessionChange(change({ sourceId: `run-${i}` }))
    }

    jest.advanceTimersByTime(ACTION_SESSION_CHANGE_FLUSH_MS)

    expect(emitMock).toHaveBeenCalledTimes(1)
    const event = emitMock.mock.calls[0][1]
    expect(event.sessions).toHaveLength(MAX_ACTION_SESSION_CHANGES_PER_EVENT)
    expect(event.truncated).toBe(true)
  })

  it("starts a new window after flushing", () => {
    queueActionSessionChange(change())
    jest.advanceTimersByTime(ACTION_SESSION_CHANGE_FLUSH_MS)

    queueActionSessionChange(change({ sourceId: "run-2" }))
    jest.advanceTimersByTime(ACTION_SESSION_CHANGE_FLUSH_MS)

    expect(emitMock).toHaveBeenCalledTimes(2)
    expect(emitMock).toHaveBeenLastCalledWith(devWorkspaceId, {
      environment: "prod",
      sessions: [{ sourceType: "automation_run", sourceId: "run-2" }],
    })
  })

  it("logs instead of throwing when the emit fails", () => {
    emitMock.mockImplementation(() => {
      throw new Error("socket unavailable")
    })
    const errorSpy = jest.spyOn(console, "error").mockImplementation()

    queueActionSessionChange(change())

    expect(() =>
      jest.advanceTimersByTime(ACTION_SESSION_CHANGE_FLUSH_MS)
    ).not.toThrow()
    expect(errorSpy).toHaveBeenCalledWith(
      "Failed to emit action session changes",
      expect.objectContaining({ room: devWorkspaceId, environment: "prod" })
    )
    errorSpy.mockRestore()
  })
})
