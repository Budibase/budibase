import tk from "timekeeper"
import { db, events, utils } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import type {
  PlatformActionSessionStatus,
  PlatformActionEnvironment,
  PlatformActionEvent,
  PlatformActionSessionIndexDoc,
} from "@budibase/types"
import { DocumentType, SEPARATOR } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { clearOldHistory, clearOldHistoryOnSessionEnd } from "./cleanup"
import {
  createEventsBySessionView,
  createSessionsByStatusAndUpdatedAtView,
} from "./views"

const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24

describe("platformActions cleanup", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
    mocks.licenses.setPlatformActionsRetentionQuota(30)
  })

  afterEach(() => {
    tk.reset()
    mocks.licenses.useUnlimited()
  })

  afterAll(() => {
    config.end()
  })

  async function withContext<T>(fn: () => Promise<T>): Promise<T> {
    return config.doInContext(config.getProdWorkspaceId(), fn)
  }

  async function atDaysAgo<T>(daysAgo: number, fn: () => Promise<T>) {
    tk.freeze(new Date(Date.now() - daysAgo * ONE_DAY_MILLIS))
    try {
      return await fn()
    } finally {
      tk.reset()
    }
  }

  async function createSession({
    sourceId,
    daysAgo,
    status = "completed",
    environment = "prod",
    eventCount = 1,
  }: {
    sourceId: string
    daysAgo: number
    status?: PlatformActionSessionStatus
    environment?: PlatformActionEnvironment
    eventCount?: number
  }) {
    await atDaysAgo(daysAgo, () =>
      withContext(async () => {
        const database = events.platformActions.getActionsDB()
        const timestamp = new Date().toISOString()
        const eventDocs: PlatformActionEvent[] = Array.from(
          { length: eventCount },
          () => ({
            _id: [DocumentType.PLATFORM_ACTION_EVENT, utils.newid()].join(
              SEPARATOR
            ),
            environment,
            sourceType: "agent_session",
            sourceId,
            eventName: "action:tool:executed",
            timestamp,
            payload: {},
          })
        )
        const session: PlatformActionSessionIndexDoc = {
          _id: events.platformActions.getPlatformActionSessionId({
            environment,
            sourceType: "agent_session",
            sourceId,
          }),
          environment,
          sourceType: "agent_session",
          sourceId,
          status,
          actionCount: eventCount,
          startedAt: timestamp,
          updatedAt: timestamp,
        }
        await database.bulkDocs([...eventDocs, session])
      })
    )
  }

  async function addEvent({
    sourceId,
    daysAgo,
  }: {
    sourceId: string
    daysAgo: number
  }) {
    await atDaysAgo(daysAgo, () =>
      withContext(async () => {
        const event: PlatformActionEvent = {
          _id: [DocumentType.PLATFORM_ACTION_EVENT, utils.newid()].join(
            SEPARATOR
          ),
          environment: "prod",
          sourceType: "agent_session",
          sourceId,
          eventName: "action:tool:executed",
          timestamp: new Date().toISOString(),
          payload: {},
        }
        await events.platformActions.getActionsDB().put(event)
      })
    )
  }

  // Source IDs of the stored sessions and of each stored event
  async function getStored() {
    return withContext(async () => {
      const response = await events.platformActions
        .getActionsDB()
        .allDocs<PlatformActionSessionIndexDoc | PlatformActionEvent>({
          include_docs: true,
        })
      const docs = response.rows
        .map(row => row.doc!)
        .filter(doc => doc.sourceId !== undefined)
      return {
        sessions: docs
          .filter(doc => !("eventName" in doc))
          .map(doc => doc.sourceId)
          .sort(),
        events: docs
          .filter(doc => "eventName" in doc)
          .map(doc => doc.sourceId)
          .sort(),
      }
    })
  }

  const clear = (batchSize?: number) =>
    withContext(() => clearOldHistory({ batchSize }))

  it.each<PlatformActionSessionStatus>(["completed", "failed"])(
    "only deletes %s sessions strictly before the retention cutoff",
    async status => {
      const now = new Date("2026-03-09T12:00:00.000Z")
      const cutoff = now.getTime() - 30 * ONE_DAY_MILLIS
      await withContext(async () => {
        const database = events.platformActions.getActionsDB()
        for (const { sourceId, offset } of [
          { sourceId: "before-cutoff", offset: -1 },
          { sourceId: "at-cutoff", offset: 0 },
          { sourceId: "after-cutoff", offset: 1 },
        ]) {
          const timestamp = new Date(cutoff + offset).toISOString()
          const session: PlatformActionSessionIndexDoc = {
            _id: events.platformActions.getPlatformActionSessionId({
              environment: "prod",
              sourceType: "agent_session",
              sourceId,
            }),
            environment: "prod",
            sourceType: "agent_session",
            sourceId,
            status,
            actionCount: 1,
            startedAt: timestamp,
            updatedAt: timestamp,
          }
          const event: PlatformActionEvent = {
            _id: [DocumentType.PLATFORM_ACTION_EVENT, utils.newid()].join(
              SEPARATOR
            ),
            environment: "prod",
            sourceType: "agent_session",
            sourceId,
            eventName: "action:tool:executed",
            timestamp,
            payload: {},
          }
          // The database adapter stamps updatedAt when persisting documents.
          tk.freeze(new Date(timestamp))
          await database.bulkDocs([event, session])
        }
      })

      tk.freeze(now)
      await clear()

      expect(await getStored()).toEqual({
        sessions: ["after-cutoff", "at-cutoff"],
        events: ["after-cutoff", "at-cutoff"],
      })
    }
  )

  it("deletes expired terminal sessions and their events in both environments", async () => {
    await createSession({ sourceId: "completed-prod", daysAgo: 40 })
    await createSession({
      sourceId: "failed-dev",
      daysAgo: 40,
      status: "failed",
      environment: "dev",
    })
    await createSession({ sourceId: "recent", daysAgo: 1 })

    await clear()

    expect(await getStored()).toEqual({
      sessions: ["recent"],
      events: ["recent"],
    })
  })

  it.each<PlatformActionSessionStatus>(["active", "waiting"])(
    "keeps an old %s session and its events",
    async status => {
      await createSession({ sourceId: "old", daysAgo: 60, status })

      await clear()

      expect(await getStored()).toEqual({
        sessions: ["old"],
        events: ["old"],
      })
    }
  )

  it.each([0, 30])(
    "keeps all history when an unindexed event is %s days old",
    async daysAgo => {
      tk.freeze(new Date("2026-10-14T12:00:00.000Z"))
      const now = new Date()
      await createSession({ sourceId: "resumed", daysAgo: 40, eventCount: 2 })
      tk.freeze(now)
      await addEvent({ sourceId: "resumed", daysAgo })
      tk.freeze(now)
      await createSession({ sourceId: "expired", daysAgo: 35 })
      tk.freeze(now)

      await clear()

      expect(await getStored()).toEqual({
        sessions: ["resumed"],
        events: ["resumed", "resumed", "resumed"],
      })
      const session = await withContext(() =>
        events.platformActions
          .getActionsDB()
          .get<PlatformActionSessionIndexDoc>(
            events.platformActions.getPlatformActionSessionId({
              environment: "prod",
              sourceType: "agent_session",
              sourceId: "resumed",
            })
          )
      )
      expect(session.actionCount).toBe(2)
    }
  )

  it("deletes a large session across bounded runs", async () => {
    await createSession({ sourceId: "large", daysAgo: 40, eventCount: 5 })

    await clear(3)
    const afterFirstRun = await getStored()
    await clear(3)

    expect(afterFirstRun).toEqual({
      sessions: ["large"],
      events: ["large", "large"],
    })
    expect(await getStored()).toEqual({
      sessions: [],
      events: [],
    })
  })

  it("keeps an expired session whose events failed to delete", async () => {
    await createSession({ sourceId: "expired", daysAgo: 40 })
    const bulkDocs = jest
      .spyOn(db.DatabaseImpl.prototype, "bulkDocs")
      .mockImplementationOnce(async documents =>
        documents.map(doc => ({
          id: doc._id!,
          error: "conflict",
          reason: "Document update conflict.",
        }))
      )

    try {
      await clear()
    } finally {
      bulkDocs.mockRestore()
    }

    expect(await getStored()).toEqual({
      sessions: ["expired"],
      events: ["expired"],
    })
  })

  it("does nothing with an unlimited quota", async () => {
    await createSession({ sourceId: "expired", daysAgo: 400 })
    mocks.licenses.useUnlimited()

    await clear()

    expect(await getStored()).toEqual({
      sessions: ["expired"],
      events: ["expired"],
    })
  })

  it("does not create a missing Actions database", async () => {
    const workspaceId = config.getProdWorkspaceId()
    const actionsDbName = events.platformActions.getActionsDbName(workspaceId)

    await clear()

    expect(await db.dbExists(actionsDbName)).toBe(false)
  })

  async function setStatus({
    sourceId,
    status,
  }: {
    sourceId: string
    status: PlatformActionSessionStatus
  }) {
    await withContext(async () => {
      const database = events.platformActions.getActionsDB()
      const session = await database.get<PlatformActionSessionIndexDoc>(
        events.platformActions.getPlatformActionSessionId({
          environment: "prod",
          sourceType: "agent_session",
          sourceId,
        })
      )
      await database.put({ ...session, status })
    })
  }

  it("applies a shorter retention period to existing history", async () => {
    await createSession({ sourceId: "twenty-days", daysAgo: 20 })

    await clear()
    const withThirtyDays = await getStored()
    mocks.licenses.setPlatformActionsRetentionQuota(7)
    await clear()

    expect(withThirtyDays.sessions).toEqual(["twenty-days"])
    expect(await getStored()).toEqual({ sessions: [], events: [] })
  })

  it("continues past protected candidates across bounded scans", async () => {
    for (const sourceId of ["protected-a", "protected-b", "protected-c"]) {
      await createSession({ sourceId, daysAgo: 50 })
      await addEvent({ sourceId, daysAgo: 0 })
    }
    await createSession({ sourceId: "expired", daysAgo: 40 })

    await withContext(() => clearOldHistory({ scanLimit: 2 }))
    const first = await getStored()
    await withContext(() => clearOldHistory({ scanLimit: 2 }))
    const second = await getStored()

    expect(first.sessions).toContain("expired")
    expect(second).toEqual({
      sessions: ["protected-a", "protected-b", "protected-c"],
      events: [
        "protected-a",
        "protected-a",
        "protected-b",
        "protected-b",
        "protected-c",
        "protected-c",
      ],
    })
  })

  it("restarts the cursor when the retention quota changes", async () => {
    await createSession({ sourceId: "protected", daysAgo: 50 })
    await addEvent({ sourceId: "protected", daysAgo: 20 })
    await withContext(() => clearOldHistory({ scanLimit: 1 }))

    mocks.licenses.setPlatformActionsRetentionQuota(7)
    await withContext(() => clearOldHistory({ scanLimit: 1 }))

    expect(await getStored()).toEqual({ sessions: [], events: [] })
  })

  it("continues after a deleted cursor with equal timestamps across statuses", async () => {
    const now = new Date()
    for (const sourceId of ["a", "b", "c"]) {
      tk.freeze(now)
      await createSession({
        sourceId,
        daysAgo: 40,
        status: sourceId === "b" ? "failed" : "completed",
      })
    }

    await clear(2)
    await clear(2)

    expect(await getStored()).toEqual({ sessions: ["c"], events: ["c"] })
  })

  it("pages past a full protected candidate page within one run", async () => {
    for (let index = 0; index < 100; index++) {
      const sourceId = `protected-${index}`
      await createSession({ sourceId, daysAgo: 50 })
      await addEvent({ sourceId, daysAgo: 0 })
    }
    await createSession({ sourceId: "expired", daysAgo: 40 })

    await clear()

    const stored = await getStored()
    expect(stored.sessions).toHaveLength(100)
    expect(stored.events).toHaveLength(200)
    expect(stored.sessions).not.toContain("expired")
    expect(stored.events).not.toContain("expired")
  })

  it("restarts a completed scan to revisit protected sessions", async () => {
    await createSession({ sourceId: "protected", daysAgo: 50 })
    await addEvent({ sourceId: "protected", daysAgo: 0 })
    await withContext(() => clearOldHistory({ scanLimit: 1 }))
    await withContext(() => clearOldHistory({ scanLimit: 1 }))

    tk.freeze(new Date(Date.now() + 31 * ONE_DAY_MILLIS))
    await withContext(() => clearOldHistory({ scanLimit: 1 }))

    expect(await getStored()).toEqual({ sessions: [], events: [] })
  })

  it("keeps an old session that only just became terminal", async () => {
    await createSession({ sourceId: "long-run", daysAgo: 60, status: "active" })
    await setStatus({ sourceId: "long-run", status: "completed" })

    await clear()

    expect(await getStored()).toEqual({
      sessions: ["long-run"],
      events: ["long-run"],
    })
  })

  it("keeps the other environment's session with the same source", async () => {
    await createSession({ sourceId: "shared", daysAgo: 40 })
    await createSession({
      sourceId: "shared",
      daysAgo: 40,
      status: "active",
      environment: "dev",
    })

    await clear()

    expect(await getStored()).toEqual({
      sessions: ["shared"],
      events: ["shared"],
    })
    const devSession = await withContext(() =>
      events.platformActions
        .getActionsDB()
        .tryGet<PlatformActionSessionIndexDoc>(
          events.platformActions.getPlatformActionSessionId({
            environment: "dev",
            sourceType: "agent_session",
            sourceId: "shared",
          })
        )
    )
    expect(devSession?.status).toEqual("active")
  })

  it("does nothing once the workspace has been deleted", async () => {
    await createSession({ sourceId: "expired", daysAgo: 40 })
    await db.getDB(config.getDevWorkspaceId(), { skip_setup: true }).destroy()

    await clear()

    expect(await getStored()).toEqual({
      sessions: ["expired"],
      events: ["expired"],
    })
    expect(await db.dbExists(config.getDevWorkspaceId())).toBe(false)
  })

  it("rechecks candidates after waiting for a concurrent resume to finish", async () => {
    await createSession({ sourceId: "resumed", daysAgo: 40 })
    const workspaceId = config.getProdWorkspaceId()
    // Creating a missing view takes the lock this test holds
    await withContext(async () => {
      const workspaceDb = events.platformActions.getActionsDB()
      await createSessionsByStatusAndUpdatedAtView(workspaceDb)
      await createEventsBySessionView(workspaceDb)
    })
    // Expired sessions, both terminal statuses, then the events view
    const QUERIES_BEFORE_LOCK = 3
    const querySpy = jest.spyOn(db.DatabaseImpl.prototype, "query")

    try {
      let cleaning: Promise<void> | undefined
      await config.doInContext(workspaceId, () =>
        events.platformActions.doWithExistingActionsWorkspace(async () => {
          cleaning = clear()
          while (querySpy.mock.calls.length < QUERIES_BEFORE_LOCK) {
            await new Promise(resolve => setTimeout(resolve, 10))
          }
          await setStatus({ sourceId: "resumed", status: "active" })
          await addEvent({ sourceId: "resumed", daysAgo: 0 })
        })
      )
      await cleaning
    } finally {
      querySpy.mockRestore()
    }

    expect(await getStored()).toEqual({
      sessions: ["resumed"],
      events: ["resumed", "resumed"],
    })
  })

  describe("clearOldHistoryOnSessionEnd", () => {
    const sessionEnd = (signal: PlatformActionSessionStatus | undefined) =>
      clearOldHistoryOnSessionEnd({
        workspaceId: config.getProdWorkspaceId(),
        environment: "prod",
        sourceType: "agent_session",
        sourceId: "ending",
        signal,
      })

    it.each<PlatformActionSessionStatus>(["completed", "failed"])(
      "cleans up when a session becomes %s",
      async signal => {
        await createSession({ sourceId: "expired", daysAgo: 40 })

        await sessionEnd(signal)

        expect(await getStored()).toEqual({ sessions: [], events: [] })
      }
    )

    it.each<PlatformActionSessionStatus | undefined>([
      "active",
      "waiting",
      undefined,
    ])("does not clean up for a %s signal", async signal => {
      await createSession({ sourceId: "expired", daysAgo: 40 })

      await sessionEnd(signal)

      expect(await getStored()).toEqual({
        sessions: ["expired"],
        events: ["expired"],
      })
    })
  })
})
