import { events } from "@budibase/backend-core"
import { DocumentType, SEPARATOR } from "@budibase/types"
import type {
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionSessionIndexDoc,
  PlatformActionSourceType,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { fetchSessions, fetchSessionsSummary } from "./sessions"

const tick = () => new Promise(resolve => setTimeout(resolve, 5))

function buildSessionId({
  environment,
  sourceType,
  sourceId,
}: {
  environment: PlatformActionEnvironment
  sourceType: PlatformActionSourceType
  sourceId: string
}): string {
  return [
    DocumentType.PLATFORM_ACTION_SESSION,
    environment,
    sourceType,
    sourceId,
  ].join(SEPARATOR)
}

describe("platformActions sessions", () => {
  const config = new TestConfiguration()

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
  }: {
    sourceType?: PlatformActionSourceType
    sourceId: string
    environment?: PlatformActionEnvironment
    status?: PlatformActionContainerStatus
  }) {
    const timestamp = new Date().toISOString()
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const doc: PlatformActionSessionIndexDoc = {
        _id: buildSessionId({ environment, sourceType, sourceId }),
        sourceType,
        sourceId,
        environment,
        status,
        actionCount: 1,
        startedAt: timestamp,
        updatedAt: timestamp,
      }
      await events.platformActions.getActionsDB().put(doc)
    })
    await tick()
  }

  async function withContext<T>(fn: () => Promise<T>): Promise<T> {
    return config.doInContext(config.getProdWorkspaceId(), fn)
  }

  describe("fetchSessions", () => {
    it("lists sessions across both environments when env is omitted", async () => {
      await createSession({ sourceId: "prod-1", environment: "prod" })
      await createSession({ sourceId: "dev-1", environment: "dev" })

      const { sessions } = await withContext(() => fetchSessions({ limit: 10 }))

      expect(sessions.map(s => s.sourceId).sort()).toEqual(
        ["dev-1", "prod-1"].sort()
      )
    })

    it("filters by environment", async () => {
      await createSession({ sourceId: "prod-1", environment: "prod" })
      await createSession({ sourceId: "dev-1", environment: "dev" })

      const { sessions } = await withContext(() =>
        fetchSessions({ environment: "prod", limit: 10 })
      )

      expect(sessions).toHaveLength(1)
      expect(sessions[0].sourceId).toBe("prod-1")
      expect(sessions[0].environment).toBe("prod")
    })

    it("filters by status", async () => {
      await createSession({ sourceId: "active-1", status: "active" })
      await createSession({ sourceId: "failed-1", status: "failed" })

      const { sessions } = await withContext(() =>
        fetchSessions({ status: "failed", limit: 10 })
      )

      expect(sessions).toHaveLength(1)
      expect(sessions[0].sourceId).toBe("failed-1")
    })

    it("filters by environment and status together", async () => {
      await createSession({
        sourceId: "prod-active",
        environment: "prod",
        status: "active",
      })
      await createSession({
        sourceId: "prod-failed",
        environment: "prod",
        status: "failed",
      })
      await createSession({
        sourceId: "dev-active",
        environment: "dev",
        status: "active",
      })

      const { sessions } = await withContext(() =>
        fetchSessions({ environment: "prod", status: "active", limit: 10 })
      )

      expect(sessions).toHaveLength(1)
      expect(sessions[0].sourceId).toBe("prod-active")
    })

    it("orders sessions newest-updated first", async () => {
      await createSession({ sourceId: "first" })
      await createSession({ sourceId: "second" })
      await createSession({ sourceId: "third" })

      const { sessions } = await withContext(() => fetchSessions({ limit: 10 }))

      expect(sessions.map(s => s.sourceId)).toEqual([
        "third",
        "second",
        "first",
      ])
    })

    it("isolates sessions between different workspaces", async () => {
      await createSession({ sourceId: "workspace-1-session" })

      const otherConfig = new TestConfiguration()
      await otherConfig.newTenant()
      try {
        await otherConfig.doInContext(otherConfig.getProdWorkspaceId(), () =>
          events.platformActions
            .getActionsDB()
            .put<PlatformActionSessionIndexDoc>({
              _id: buildSessionId({
                environment: "prod",
                sourceType: "agent_session",
                sourceId: "workspace-2-session",
              }),
              sourceType: "agent_session",
              sourceId: "workspace-2-session",
              environment: "prod",
              status: "active",
              actionCount: 1,
              startedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
        )

        const { sessions } = await withContext(() =>
          fetchSessions({ limit: 10 })
        )

        expect(sessions.map(s => s.sourceId)).toEqual(["workspace-1-session"])
      } finally {
        otherConfig.end()
      }
    })

    it("rejects a malformed bookmark", async () => {
      await expect(
        withContext(() => fetchSessions({ bookmark: "not-a-valid-bookmark" }))
      ).rejects.toMatchObject({ status: 400 })
    })

    describe("pagination", () => {
      beforeEach(async () => {
        for (const sourceId of ["a", "b", "c", "d", "e"]) {
          await createSession({ sourceId })
        }
      })

      it("pages forward and reconstructs the full ordered list", async () => {
        const baseline = await withContext(() => fetchSessions({ limit: 100 }))
        const expectedOrder = baseline.sessions.map(s => s.sourceId)

        const collected: string[] = []
        let bookmark: string | undefined
        let hasNextPage = true
        while (hasNextPage) {
          const page: Awaited<ReturnType<typeof fetchSessions>> =
            await withContext(() => fetchSessions({ limit: 2, bookmark }))
          collected.push(...page.sessions.map(s => s.sourceId))
          hasNextPage = page.pagination.hasNextPage
          bookmark = page.pagination.nextBookmark
        }

        expect(collected).toEqual(expectedOrder)
      })

      it("has no previous page on the first page and no next page on the last", async () => {
        const first = await withContext(() => fetchSessions({ limit: 2 }))
        expect(first.pagination.hasPreviousPage).toBe(false)
        expect(first.pagination.previousBookmark).toBeUndefined()
        expect(first.pagination.hasNextPage).toBe(true)

        let last = first
        while (last.pagination.hasNextPage) {
          last = await withContext(() =>
            fetchSessions({ limit: 2, bookmark: last.pagination.nextBookmark })
          )
        }
        expect(last.pagination.hasNextPage).toBe(false)
        expect(last.pagination.nextBookmark).toBeUndefined()
      })

      it("pages backward to reconstruct an earlier page", async () => {
        const firstPage = await withContext(() => fetchSessions({ limit: 2 }))
        const secondPage = await withContext(() =>
          fetchSessions({
            limit: 2,
            bookmark: firstPage.pagination.nextBookmark,
          })
        )
        const backToFirst = await withContext(() =>
          fetchSessions({
            limit: 2,
            bookmark: secondPage.pagination.previousBookmark,
          })
        )

        expect(backToFirst.sessions.map(s => s.sourceId)).toEqual(
          firstPage.sessions.map(s => s.sourceId)
        )
      })
    })
  })

  describe("fetchSessionsSummary", () => {
    it("counts sessions per status, combined across environments", async () => {
      await createSession({
        sourceId: "prod-active",
        environment: "prod",
        status: "active",
      })
      await createSession({
        sourceId: "dev-failed",
        environment: "dev",
        status: "failed",
      })
      await createSession({
        sourceId: "prod-completed",
        environment: "prod",
        status: "completed",
      })

      const summary = await withContext(() => fetchSessionsSummary({}))

      expect(summary).toEqual({
        total: 3,
        active: 1,
        waiting: 0,
        completed: 1,
        failed: 1,
      })
    })

    it("scopes counts to a single environment when given", async () => {
      await createSession({
        sourceId: "prod-active",
        environment: "prod",
        status: "active",
      })
      await createSession({
        sourceId: "dev-failed",
        environment: "dev",
        status: "failed",
      })

      const summary = await withContext(() =>
        fetchSessionsSummary({ environment: "prod" })
      )

      expect(summary).toEqual({
        total: 1,
        active: 1,
        waiting: 0,
        completed: 0,
        failed: 0,
      })
    })
  })
})
