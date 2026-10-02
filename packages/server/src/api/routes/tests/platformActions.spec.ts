import { db as dbCore, events, utils } from "@budibase/backend-core"
import { DocumentType, SEPARATOR } from "@budibase/types"
import type {
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionEvent,
  PlatformActionSessionIndexDoc,
  PlatformActionSourceType,
  Workspace,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("/api/actions", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  async function createSession({
    sourceType = "agent_session",
    sourceId,
    environment = "prod",
    status = "active",
    updatedAt = new Date().toISOString(),
  }: {
    sourceType?: PlatformActionSourceType
    sourceId: string
    environment?: PlatformActionEnvironment
    status?: PlatformActionContainerStatus
    updatedAt?: string
  }) {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const doc: PlatformActionSessionIndexDoc = {
        _id: events.platformActions.getPlatformActionSessionId({
          environment,
          sourceType,
          sourceId,
        }),
        sourceType,
        sourceId,
        environment,
        status,
        actionCount: 1,
        startedAt: updatedAt,
        updatedAt,
      }
      await events.platformActions.getActionsDB().put(doc)
    })
  }

  async function createEvent({
    sourceType = "agent_session",
    sourceId,
    environment = "prod",
    eventName,
    timestamp,
  }: {
    sourceType?: PlatformActionSourceType
    sourceId: string
    environment?: PlatformActionEnvironment
    eventName: string
    timestamp: string
  }) {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const doc: PlatformActionEvent = {
        _id: [DocumentType.PLATFORM_ACTION_EVENT, utils.newid()].join(
          SEPARATOR
        ),
        sourceType,
        sourceId,
        environment,
        eventName,
        timestamp,
        payload: {},
      }
      await events.platformActions.getActionsDB().put(doc)
    })
  }

  describe("authorization", () => {
    it("rejects users who are not builders of the workspace", async () => {
      const user = await config.createUser({
        builder: {},
        admin: { global: false },
      })

      await config.withUser(user, async () => {
        await config.api.platformActions.fetchSessions({}, { status: 403 })
        await config.api.platformActions.fetchSessionEvents(
          { sourceType: "agent_session", sourceId: "session-1" },
          { env: "prod" },
          { status: 403 }
        )
      })
    })

    it("rejects builders of another workspace", async () => {
      const workspaceA = config.getDevWorkspaceId()
      await createSession({ sourceId: "session-a" })
      const workspaceB: Workspace = await config.createWorkspace()
      const user = await config.createUser({
        builder: {
          global: false,
          apps: [dbCore.getProdWorkspaceID(workspaceB.appId)],
        },
        admin: { global: false },
      })

      await config.withUser(user, () =>
        config.withApp(workspaceA, async () => {
          await config.api.platformActions.fetchSessions({}, { status: 403 })
          await config.api.platformActions.fetchSessionEvents(
            { sourceType: "agent_session", sourceId: "session-a" },
            { env: "prod" },
            { status: 403 }
          )
        })
      )
    })
  })

  describe("workspace isolation", () => {
    it("only reads the Actions of the requested workspace", async () => {
      await createSession({ sourceId: "session-a" })
      await createEvent({
        sourceId: "session-a",
        eventName: "action:a",
        timestamp: "2026-09-24T00:00:00.000Z",
      })
      const workspaceB = await config.createWorkspace()

      await config.withApp(workspaceB, async () => {
        const result = await config.api.platformActions.fetchSessions()
        expect(result.sessions).toEqual([])
        expect(result.summary.total).toBe(0)

        await config.api.platformActions.fetchSessionEvents(
          { sourceType: "agent_session", sourceId: "session-a" },
          { env: "prod" },
          { status: 404 }
        )
      })
    })
  })

  describe("GET /api/actions/sessions", () => {
    it("returns an empty list when there are no sessions", async () => {
      const result = await config.api.platformActions.fetchSessions()

      expect(result).toEqual({
        sessions: [],
        summary: { total: 0, active: 0, waiting: 0, completed: 0, failed: 0 },
        pagination: { hasNextPage: false, hasPreviousPage: false },
      })
    })

    it("lists sessions from both environments when env is omitted", async () => {
      await createSession({ sourceId: "prod-1", environment: "prod" })
      await createSession({ sourceId: "dev-1", environment: "dev" })

      const result = await config.api.platformActions.fetchSessions()

      expect(result.sessions.map(s => s.sourceId).sort()).toEqual([
        "dev-1",
        "prod-1",
      ])
      expect(result.summary.total).toBe(2)
    })

    it("filters by environment", async () => {
      await createSession({ sourceId: "prod-1", environment: "prod" })
      await createSession({ sourceId: "dev-1", environment: "dev" })

      const result = await config.api.platformActions.fetchSessions({
        env: "dev",
      })

      expect(result.sessions.map(s => s.sourceId)).toEqual(["dev-1"])
      expect(result.summary.total).toBe(1)
    })

    it("filters by status and summarises every status", async () => {
      await createSession({ sourceId: "active-1", status: "active" })
      await createSession({ sourceId: "completed-1", status: "completed" })
      await createSession({ sourceId: "failed-1", status: "failed" })

      const result = await config.api.platformActions.fetchSessions({
        status: "completed",
      })

      expect(result.sessions.map(s => s.sourceId)).toEqual(["completed-1"])
      expect(result.summary).toEqual({
        total: 3,
        active: 1,
        waiting: 0,
        completed: 1,
        failed: 1,
      })
    })

    it("pages forward and backward with bookmarks", async () => {
      for (const [index, sourceId] of ["s-1", "s-2", "s-3"].entries()) {
        await createSession({
          sourceId,
          updatedAt: `2026-09-24T00:00:0${index}.000Z`,
        })
      }

      const firstPage = await config.api.platformActions.fetchSessions({
        limit: "2",
      })
      const secondPage = await config.api.platformActions.fetchSessions({
        limit: "2",
        bookmark: firstPage.pagination.nextBookmark,
      })
      const backToFirst = await config.api.platformActions.fetchSessions({
        limit: "2",
        bookmark: secondPage.pagination.previousBookmark,
      })

      expect(
        [...firstPage.sessions, ...secondPage.sessions].map(s => s.sourceId)
      ).toEqual(["s-3", "s-2", "s-1"])
      expect(secondPage.pagination).toEqual({
        hasNextPage: false,
        hasPreviousPage: true,
        previousBookmark: expect.any(String),
      })
      expect(backToFirst.sessions).toEqual(firstPage.sessions)
    })

    it.each([
      { env: "staging" },
      { status: "paused" },
      { limit: "0" },
      { limit: "101" },
      { limit: "1.5" },
      { limit: "abc" },
      { unknown: "value" },
      { bookmark: "not-a-bookmark" },
    ])("rejects invalid query %o", async query => {
      await config.api.platformActions.fetchSessions(query, {
        status: 400,
      })
    })
  })

  describe("GET /api/actions/sessions/:sourceType/:sourceId/events", () => {
    it("lists the events of the session with their summary", async () => {
      await createSession({ sourceType: "automation_run", sourceId: "run/1" })
      await createEvent({
        sourceType: "automation_run",
        sourceId: "run/1",
        eventName: "action:1",
        timestamp: "2026-09-24T00:00:00.000Z",
      })
      await createEvent({
        sourceType: "automation_run",
        sourceId: "run/1",
        eventName: "action:2",
        timestamp: "2026-09-24T00:00:01.000Z",
      })

      const result = await config.api.platformActions.fetchSessionEvents(
        { sourceType: "automation_run", sourceId: "run/1" },
        { env: "prod" }
      )

      expect(result.events.map(e => e.eventName)).toEqual([
        "action:1",
        "action:2",
      ])
      expect(result.summary).toEqual({ total: 2 })
    })

    it("returns an empty list for an existing session without events", async () => {
      await createSession({ sourceId: "session-1" })

      const result = await config.api.platformActions.fetchSessionEvents(
        { sourceType: "agent_session", sourceId: "session-1" },
        { env: "prod" }
      )

      expect(result).toEqual({
        events: [],
        summary: { total: 0 },
        pagination: { hasNextPage: false, hasPreviousPage: false },
      })
    })

    it("returns 404 when the session does not exist in the environment", async () => {
      await createSession({ sourceId: "session-1", environment: "dev" })

      await config.api.platformActions.fetchSessionEvents(
        { sourceType: "agent_session", sourceId: "session-1" },
        { env: "prod" },
        { status: 404 }
      )
    })

    it("pages forward and backward with bookmarks", async () => {
      await createSession({ sourceId: "session-1" })
      for (const index of [1, 2, 3]) {
        await createEvent({
          sourceId: "session-1",
          eventName: `action:${index}`,
          timestamp: `2026-09-24T00:00:0${index}.000Z`,
        })
      }
      const params = {
        sourceType: "agent_session" as const,
        sourceId: "session-1",
      }

      const firstPage = await config.api.platformActions.fetchSessionEvents(
        params,
        { env: "prod", limit: "2" }
      )
      const secondPage = await config.api.platformActions.fetchSessionEvents(
        params,
        { env: "prod", limit: "2", bookmark: firstPage.pagination.nextBookmark }
      )
      const backToFirst = await config.api.platformActions.fetchSessionEvents(
        params,
        {
          env: "prod",
          limit: "2",
          bookmark: secondPage.pagination.previousBookmark,
        }
      )

      expect(
        [...firstPage.events, ...secondPage.events].map(e => e.eventName)
      ).toEqual(["action:1", "action:2", "action:3"])
      expect(backToFirst.events).toEqual(firstPage.events)
    })

    it("rejects an unsupported source type", async () => {
      await config.api.platformActions.fetchSessionEvents(
        { sourceType: "unknown", sourceId: "session-1" },
        { env: "prod" },
        { status: 400 }
      )
    })

    it.each([
      {},
      { env: "staging" },
      { env: "prod", limit: "0" },
      { env: "prod", limit: "101" },
      { env: "prod", bookmark: "not-a-bookmark" },
    ])("rejects invalid query %o", async query => {
      await createSession({ sourceId: "session-1" })

      await config.api.platformActions.fetchSessionEvents(
        { sourceType: "agent_session", sourceId: "session-1" },
        query,
        { status: 400 }
      )
    })
  })
})
