import {
  Event,
  PlatformActionEvent,
  type Identity,
  type PlatformActionSessionIndexDoc,
  type PlatformActionSessionMetadata,
} from "@budibase/types"
import { structures } from "../../../../../tests"
import * as context from "../../../../context"
import * as db from "../../../../db"
import {
  doWithActionsWorkspaceDeletionLock,
  doWithActionsWorkspaceWriteLock,
  getActionsDB,
  getActionsDbName,
} from "../db"

jest.mock("../indexQueue")
import { enqueuePlatformActionSessionIndex } from "../indexQueue"

jest.mock("../../../../utils", () => ({
  ...jest.requireActual("../../../../utils"),
  timeout: jest.fn().mockResolvedValue(undefined),
}))
import PlatformActionPersistProcessor from "../platformActionsPersistProcessor"
import { upsertPlatformActionSession } from "../sessionIndex"
import { getPlatformActionSessionId } from "../utils"
import {
  createWorkspace,
  destroyWorkspace,
  runInWorkspace as run,
} from "./workspace"

const mockEnqueue = enqueuePlatformActionSessionIndex as jest.MockedFunction<
  typeof enqueuePlatformActionSessionIndex
>

describe("PlatformActionPersistProcessor", () => {
  const processor = new PlatformActionPersistProcessor()
  const identity = {} as Identity

  beforeEach(() => {
    mockEnqueue.mockReset()
  })

  it("keeps waiting when an older failed action is persisted after its lifecycle correction", async () => {
    await run(async () => {
      mockEnqueue.mockImplementation(upsertPlatformActionSession)
      const source = {
        sourceType: "agent_session" as const,
        sourceId: "delayed-resume-failure",
      }
      const environment = context.getPlatformActionEnvironment()
      const failureTimestamp = Date.now()
      const waitingTimestamp = new Date(failureTimestamp + 1).toISOString()
      await processor.processEvent(
        Event.ACTION_AI_AGENT_EXECUTED,
        identity,
        { ...source, awaitingEscalation: true },
        failureTimestamp - 1
      )
      await upsertPlatformActionSession({
        ...source,
        environment,
        incrementsActionCount: false,
        signal: "waiting",
        timestamp: waitingTimestamp,
      })
      await processor.processEvent(
        Event.ACTION_AI_AGENT_FAILED,
        identity,
        source,
        failureTimestamp
      )

      const session = await getActionsDB().get<PlatformActionSessionIndexDoc>(
        getPlatformActionSessionId({ ...source, environment })
      )
      expect(session.status).toBe("waiting")
      expect(session.statusUpdatedAt).toBe(waitingTimestamp)
      expect(session.actionCount).toBe(2)
      expect(session.completedAt).toBeUndefined()
    })
  })

  it("skips self-host cloud events without persisting, enqueueing or logging an error", async () => {
    const tenantId = structures.tenant.id()
    const workspaceId = db.generateWorkspaceID(tenantId)
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    try {
      await context.doInWorkspaceContext(workspaceId, () =>
        context.doInSelfHostTenantUsingCloud(tenantId, () =>
          processor.processEvent(Event.ACTION_AI_AGENT_EXECUTED, identity, {
            sourceType: "agent_session",
            sourceId: "session-1",
          })
        )
      )

      expect(await db.dbExists(getActionsDbName(workspaceId))).toBe(false)
      expect(mockEnqueue).not.toHaveBeenCalled()
      expect(errorSpy).not.toHaveBeenCalled()
    } finally {
      errorSpy.mockRestore()
    }
  })

  it("ignores events that are not action events", async () => {
    await run(async () => {
      await processor.processEvent(
        "some:other:event" as Event,
        identity,
        { sourceType: "agent_session", sourceId: "session-1" },
        undefined
      )

      const { rows } = await getActionsDB().allDocs({ include_docs: false })
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

      const { rows } = await getActionsDB().allDocs({ include_docs: false })
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

      const { rows } = await getActionsDB().allDocs<PlatformActionEvent>({
        include_docs: true,
      })

      expect(rows).toHaveLength(1)
      const doc = rows[0].doc!

      expect(doc._id).toMatch(/^platform_action_\d{8}T\d{9}Z_[0-9a-f-]{36}$/)
      expect(doc._id).not.toMatch(/[:.]/)
      expect(doc.sourceType).toBe("agent_session")
      expect(doc.sourceId).toBe("session-1")
      expect(doc.environment).toBe("prod")
      expect(doc.eventName).toBe(Event.ACTION_AI_AGENT_EXECUTED)
      expect(doc.timestamp).toBe("2026-08-31T14:10:15.959Z")
      expect(doc.payload).toEqual({ agentId: "agent-1" })
    })
  })

  it("tags the persisted event and the enqueued job as dev when the current context is a dev workspace", async () => {
    const prodWorkspaceId = await createWorkspace()
    const devWorkspaceId = db.getDevWorkspaceID(prodWorkspaceId)

    try {
      await context.doInWorkspaceContext(devWorkspaceId, async () => {
        await processor.processEvent(
          Event.ACTION_AI_AGENT_EXECUTED,
          identity,
          { sourceType: "agent_session", sourceId: "session-1" },
          undefined
        )

        const { rows } = await getActionsDB().allDocs<PlatformActionEvent>({
          include_docs: true,
        })

        expect(rows).toHaveLength(1)
        expect(rows[0].doc!.environment).toBe("dev")
        expect(mockEnqueue).toHaveBeenCalledWith(
          expect.objectContaining({ environment: "dev" })
        )
      })
    } finally {
      await destroyWorkspace(prodWorkspaceId)
    }
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

  describe("session metadata", () => {
    const metadata: PlatformActionSessionMetadata = {
      asset: { type: "agent", id: "agent-1", label: "HR assistant" },
      triggeredBy: { type: "user", id: "us_1", label: "John Doe" },
    }

    it("attaches the scope's metadata to the index job only, never to the persisted event", async () => {
      await run(async () => {
        await context.doInPlatformActionSessionContext(
          { sourceType: "agent_session", sourceId: "session-1", ...metadata },
          () =>
            processor.processEvent(
              Event.ACTION_AI_AGENT_EXECUTED,
              identity,
              { sourceType: "agent_session", sourceId: "session-1" },
              undefined
            )
        )

        expect(mockEnqueue).toHaveBeenCalledWith(
          expect.objectContaining({ metadata })
        )
        const { rows } = await getActionsDB().allDocs<PlatformActionEvent>({
          include_docs: true,
        })
        expect(rows).toHaveLength(1)
        expect(JSON.stringify(rows[0].doc)).not.toContain("HR assistant")
        expect(JSON.stringify(rows[0].doc)).not.toContain("John Doe")
      })
    })

    it("does not attach metadata scoped to a different source", async () => {
      await run(async () => {
        await context.doInPlatformActionSessionContext(
          { sourceType: "agent_session", sourceId: "session-1", ...metadata },
          () =>
            processor.processEvent(
              Event.ACTION_AI_AGENT_EXECUTED,
              identity,
              { sourceType: "agent_session", sourceId: "session-2" },
              undefined
            )
        )

        expect(mockEnqueue).toHaveBeenCalledWith(
          expect.objectContaining({
            sourceId: "session-2",
            metadata: undefined,
          })
        )
      })
    })
  })

  it("marks an agent action as waiting only when it awaits an escalation", async () => {
    await run(async () => {
      await processor.processEvent(
        Event.ACTION_AI_AGENT_EXECUTED,
        identity,
        {
          sourceType: "agent_session",
          sourceId: "session-1",
          awaitingEscalation: true,
        },
        undefined
      )

      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          incrementsActionCount: true,
          signal: "waiting",
        })
      )
    })
  })

  it("uses an agent action's final status when its request was judged failed", async () => {
    await run(async () => {
      await processor.processEvent(
        Event.ACTION_AI_AGENT_EXECUTED,
        identity,
        {
          sourceType: "agent_session",
          sourceId: "session-1",
          finalStatus: "failed",
        },
        undefined
      )

      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          incrementsActionCount: true,
          signal: "failed",
        })
      )
    })
  })

  it("does not apply an escalation state to a non-agent action", async () => {
    await run(async () => {
      await processor.processEvent(
        Event.ACTION_AUTOMATION_STEP_EXECUTED,
        identity,
        {
          sourceType: "automation_run",
          sourceId: "run-1",
          awaitingEscalation: true,
        },
        undefined
      )

      // automation_run step events never assert a container status
      // themselves. The orchestrator signals active/completed/failed
      // explicitly from the run's own outcome, so an AI_AGENT-specific
      // property like awaitingEscalation has no effect here.
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          incrementsActionCount: true,
          signal: undefined,
        })
      )
    })
  })

  it("does not assert failed for a mid-run automation step failure either", async () => {
    await run(async () => {
      await processor.processEvent(
        Event.ACTION_AUTOMATION_STEP_FAILED,
        identity,
        { sourceType: "automation_run", sourceId: "run-1" },
        undefined
      )

      // A step failing under continueOnError doesn't clear the runner's
      // recorded error, but it also doesn't decide the container's status by
      // itself - only the orchestrator's own terminal signal does.
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          incrementsActionCount: true,
          signal: undefined,
        })
      )
    })
  })

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

  it("persists and enqueues once after contention exceeds the previous retry budget", async () => {
    const workspaceId = await createWorkspace()
    // The previous policy allowed 10 retries, each delayed by at most 300ms.
    const contentionMs = 4000
    let acquired!: () => void
    const lockAcquired = new Promise<void>(resolve => {
      acquired = resolve
    })
    const holder = doWithActionsWorkspaceWriteLock({
      workspaceId,
      task: async () => {
        acquired()
        await new Promise(resolve => setTimeout(resolve, contentionMs))
      },
    })
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    try {
      await lockAcquired
      await context.doInWorkspaceContext(workspaceId, async () => {
        await Promise.all([
          holder,
          processor.processEvent(Event.ACTION_AI_AGENT_EXECUTED, identity, {
            sourceType: "agent_session",
            sourceId: "contended-session",
          }),
        ])
        const { rows } = await getActionsDB().allDocs<PlatformActionEvent>({
          include_docs: true,
        })
        expect(rows).toHaveLength(1)
        expect(rows[0].doc).toMatchObject({ sourceId: "contended-session" })
        expect(mockEnqueue).toHaveBeenCalledTimes(1)
        expect(mockEnqueue).toHaveBeenCalledWith(
          expect.objectContaining({ indexId: rows[0].id })
        )
        expect(errorSpy).not.toHaveBeenCalled()
      })
    } finally {
      errorSpy.mockRestore()
      await Promise.allSettled([holder])
      await destroyWorkspace(workspaceId)
    }
  }, 30000)

  describe("workspace deletion", () => {
    const processAgentAction = () =>
      processor.processEvent(Event.ACTION_AI_AGENT_EXECUTED, identity, {
        sourceType: "agent_session",
        sourceId: "session-1",
      })

    it("discards a late event without recreating the Actions DB", async () => {
      const workspaceId = await createWorkspace()
      try {
        await destroyWorkspace(workspaceId)

        await context.doInWorkspaceContext(workspaceId, processAgentAction)

        expect(await db.dbExists(getActionsDbName(workspaceId))).toBe(false)
        expect(mockEnqueue).not.toHaveBeenCalled()
      } finally {
        await destroyWorkspace(workspaceId)
      }
    })

    it("discards an event that waited for an in-progress deletion", async () => {
      const workspaceId = await createWorkspace()
      let releaseDeletion!: () => void
      const deletionReleased = new Promise<void>(resolve => {
        releaseDeletion = resolve
      })
      let deletionAcquired!: () => void
      const isDeletionAcquired = new Promise<void>(resolve => {
        deletionAcquired = resolve
      })

      const deletion = doWithActionsWorkspaceDeletionLock({
        workspaceId,
        task: async () => {
          deletionAcquired()
          await deletionReleased
          await db
            .getDB(db.getDevWorkspaceID(workspaceId), { skip_setup: true })
            .destroy()
        },
      })
      let writer: Promise<void> | undefined
      try {
        await isDeletionAcquired
        writer = Promise.resolve(
          context.doInWorkspaceContext(workspaceId, processAgentAction)
        )
        releaseDeletion()
        await Promise.all([deletion, writer])

        expect(await db.dbExists(getActionsDbName(workspaceId))).toBe(false)
        expect(mockEnqueue).not.toHaveBeenCalled()
      } finally {
        releaseDeletion()
        await Promise.allSettled([deletion, writer])
        await destroyWorkspace(workspaceId)
      }
    })

    it("lets a deletion that arrives mid-write remove the persisted event", async () => {
      const workspaceId = await createWorkspace()
      const originalPut = db.DatabaseImpl.prototype.put
      let releasePut!: () => void
      const putReleased = new Promise<void>(resolve => {
        releasePut = resolve
      })
      let putStarted!: () => void
      const isPutStarted = new Promise<void>(resolve => {
        putStarted = resolve
      })
      const putSpy = jest
        .spyOn(db.DatabaseImpl.prototype, "put")
        .mockImplementationOnce(async function (
          this: db.DatabaseImpl,
          ...args
        ) {
          putStarted()
          await putReleased
          return await originalPut.apply(this, args)
        })

      let writer: Promise<void> | undefined
      let deletion: Promise<void> | undefined
      try {
        writer = Promise.resolve(
          context.doInWorkspaceContext(workspaceId, processAgentAction)
        )
        await isPutStarted
        deletion = destroyWorkspace(workspaceId)
        releasePut()
        await Promise.all([writer, deletion])

        expect(await db.dbExists(getActionsDbName(workspaceId))).toBe(false)
        expect(mockEnqueue).toHaveBeenCalledTimes(1)
      } finally {
        releasePut()
        await Promise.allSettled([writer, deletion])
        putSpy.mockRestore()
        await destroyWorkspace(workspaceId)
      }
    })
  })
})
