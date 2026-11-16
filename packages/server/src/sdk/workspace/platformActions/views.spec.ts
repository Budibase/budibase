import { db, events } from "@budibase/backend-core"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { fetchSessions, fetchSessionsSummary } from "./sessions"
import { fetchSessionEvents, fetchSessionEventsSummary } from "./events"
import { createSessionsByUpdatedAtView } from "./views"

describe("Actions views during workspace deletion", () => {
  const config = new TestConfiguration()
  const session = {
    environment: "prod" as const,
    sourceType: "agent_session" as const,
    sourceId: "session-1",
  }

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => config.end())

  const deleteDatabases = async () => {
    for (const name of [
      config.getDevWorkspaceId(),
      events.platformActions.getActionsDbName(config.getProdWorkspaceId()),
    ]) {
      if (await db.dbExists(name)) {
        await db.getDB(name, { skip_setup: true }).destroy()
      }
    }
  }

  it.each([
    ["sessions", () => fetchSessions({})],
    ["session counts", () => fetchSessionsSummary({})],
    ["events", () => fetchSessionEvents(session)],
    ["event counts", () => fetchSessionEventsSummary(session)],
  ] as const)(
    "does not recreate Actions for %s while deletion holds the lock",
    async (_name, read) => {
      const workspaceId = config.getProdWorkspaceId()
      let acquired!: () => void
      const lockAcquired = new Promise<void>(resolve => {
        acquired = resolve
      })
      let release!: () => void
      const released = new Promise<void>(resolve => {
        release = resolve
      })
      const deletion =
        events.platformActions.doWithActionsWorkspaceDeletionLock({
          workspaceId,
          task: async () => {
            acquired()
            await released
            await deleteDatabases()
          },
        })
      await lockAcquired
      const reading = config.doInContext(workspaceId, async () => read())
      release()

      await Promise.all([
        deletion,
        expect(reading).rejects.toMatchObject({ status: 404 }),
      ])
      expect(
        await db.dbExists(events.platformActions.getActionsDbName(workspaceId))
      ).toBe(false)
    }
  )

  it("lets deletion remove a view whose creation was already in progress", async () => {
    const workspaceId = config.getProdWorkspaceId()
    let started!: () => void
    const putStarted = new Promise<void>(resolve => {
      started = resolve
    })
    let release!: () => void
    const released = new Promise<void>(resolve => {
      release = resolve
    })
    const originalPut = db.DatabaseImpl.prototype.put
    const putSpy = jest
      .spyOn(db.DatabaseImpl.prototype, "put")
      .mockImplementationOnce(async function (this: db.DatabaseImpl, ...args) {
        started()
        await released
        return originalPut.apply(this, args)
      })

    try {
      const creation = config.doInContext(workspaceId, () =>
        createSessionsByUpdatedAtView(events.platformActions.getActionsDB())
      )
      await putStarted
      const deletion =
        events.platformActions.doWithActionsWorkspaceDeletionLock({
          workspaceId,
          task: deleteDatabases,
        })
      release()
      await Promise.all([creation, deletion])
      expect(
        await db.dbExists(events.platformActions.getActionsDbName(workspaceId))
      ).toBe(false)
    } finally {
      release()
      putSpy.mockRestore()
      await deleteDatabases()
    }
  })
})
