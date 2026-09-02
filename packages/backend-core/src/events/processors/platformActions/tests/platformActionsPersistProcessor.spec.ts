import { Event, PlatformActionEvent, type Identity } from "@budibase/types"
import { structures } from "../../../../../tests"
import * as context from "../../../../context"
import * as db from "../../../../db"

jest.mock("../indexQueue")
import { enqueuePlatformActionSessionIndex } from "../indexQueue"

jest.mock("../../../../utils", () => ({
  ...jest.requireActual("../../../../utils"),
  timeout: jest.fn().mockResolvedValue(undefined),
}))
import PlatformActionPersistProcessor from "../platformActionsPersistProcessor"

const mockEnqueue = enqueuePlatformActionSessionIndex as jest.MockedFunction<
  typeof enqueuePlatformActionSessionIndex
>

async function run<T>(task: () => Promise<T>): Promise<T> {
  const workspaceId = db.generateWorkspaceID(structures.tenant.id())
  return await context.doInWorkspaceContext(workspaceId, task)
}

describe("PlatformActionPersistProcessor", () => {
  const processor = new PlatformActionPersistProcessor()
  const identity = {} as Identity

  beforeEach(() => {
    mockEnqueue.mockReset()
  })

  it("ignores events that are not action events", async () => {
    await run(async () => {
      await processor.processEvent(
        "some:other:event" as Event,
        identity,
        { sourceType: "agent_session", sourceId: "session-1" },
        undefined
      )

      const { rows } = await context
        .getWorkspaceDB()
        .allDocs({ include_docs: false })
      expect(rows).toHaveLength(0)
      expect(mockEnqueue).not.toHaveBeenCalled()
    })
  })

  it("ignores action events without a structural sourceType/sourceId", async () => {
    await run(async () => {
      await processor.processEvent(
        Event.ACTION_CRUD_EXECUTED,
        identity,
        { verb: "create" },
        undefined
      )

      const { rows } = await context
        .getWorkspaceDB()
        .allDocs({ include_docs: false })
      expect(rows).toHaveLength(0)
      expect(mockEnqueue).not.toHaveBeenCalled()
    })
  })

  it("persists any action:* event that structurally carries sourceType/sourceId, not just AI_AGENT/AUTOMATION_STEP", async () => {
    await run(async () => {
      await processor.processEvent(
        Event.ACTION_CRUD_EXECUTED,
        identity,
        { sourceType: "agent_session", sourceId: "future-family" },
        undefined
      )

      expect(mockEnqueue).toHaveBeenCalledTimes(1)
    })
  })

  it("persists a PlatformActionEvent doc with a compact, colon/dot-free id", async () => {
    await run(async () => {
      await processor.processEvent(
        Event.ACTION_AI_AGENT_EXECUTED,
        identity,
        {
          sourceType: "agent_session",
          sourceId: "session-1",
          agentId: "agent-1",
        },
        "2026-08-31T14:10:15.959Z"
      )

      const { rows } = await context
        .getWorkspaceDB()
        .allDocs<PlatformActionEvent>({ include_docs: true })

      expect(rows).toHaveLength(1)
      const doc = rows[0].doc!

      expect(doc._id).toMatch(/^platform_action_\d{8}T\d{9}Z_[0-9a-f-]{36}$/)
      expect(doc._id).not.toMatch(/[:.]/)
      expect(doc.sourceType).toBe("agent_session")
      expect(doc.sourceId).toBe("session-1")
      expect(doc.eventName).toBe(Event.ACTION_AI_AGENT_EXECUTED)
      expect(doc.timestamp).toBe("2026-08-31T14:10:15.959Z")
      expect(doc.payload).toEqual({ agentId: "agent-1" })
    })
  })

  it.each([
    [Event.ACTION_AI_AGENT_EXECUTED, "completed"],
    [Event.ACTION_AI_AGENT_FAILED, "failed"],
  ])(
    "enqueues a session index job with signal %s for %s",
    async (event, signal) => {
      await run(async () => {
        await processor.processEvent(
          event,
          identity,
          { sourceType: "agent_session", sourceId: "session-1" },
          undefined
        )

        expect(mockEnqueue).toHaveBeenCalledWith(
          expect.objectContaining({
            incrementsActionCount: true,
            signal,
            sourceType: "agent_session",
            sourceId: "session-1",
          })
        )
      })
    }
  )

  it("does not enqueue a session index job when Layer 1 persistence fails", async () => {
    await run(async () => {
      const putSpy = jest
        .spyOn(db.DatabaseImpl.prototype, "put")
        .mockRejectedValueOnce(new Error("boom"))

      try {
        await processor.processEvent(
          Event.ACTION_AI_AGENT_EXECUTED,
          identity,
          { sourceType: "agent_session", sourceId: "session-1" },
          undefined
        )

        expect(putSpy).toHaveBeenCalledTimes(1)
        expect(mockEnqueue).not.toHaveBeenCalled()
      } finally {
        putSpy.mockRestore()
      }
    })
  })

  it("retries the enqueue call when it transiently fails, and eventually succeeds", async () => {
    await run(async () => {
      mockEnqueue
        .mockRejectedValueOnce(new Error("redis blip"))
        .mockRejectedValueOnce(new Error("redis blip"))
        .mockResolvedValueOnce(undefined)

      await processor.processEvent(
        Event.ACTION_AI_AGENT_EXECUTED,
        identity,
        { sourceType: "agent_session", sourceId: "session-1" },
        undefined
      )

      expect(mockEnqueue).toHaveBeenCalledTimes(3)
    })
  })

  it("gives up and logs after exhausting enqueue retries, without throwing", async () => {
    await run(async () => {
      mockEnqueue.mockRejectedValue(new Error("redis down"))
      const errorSpy = jest.spyOn(console, "error").mockImplementation()

      try {
        await expect(
          processor.processEvent(
            Event.ACTION_AI_AGENT_EXECUTED,
            identity,
            { sourceType: "agent_session", sourceId: "session-1" },
            undefined
          )
        ).resolves.toBeUndefined()

        expect(mockEnqueue).toHaveBeenCalledTimes(3)
        expect(errorSpy).toHaveBeenCalledWith(
          "Failed to enqueue platform action session index job",
          expect.objectContaining({ sourceType: "agent_session" })
        )
      } finally {
        errorSpy.mockRestore()
      }
    })
  })
})
