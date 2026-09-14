import { context } from "@budibase/backend-core"
import { DocumentType, SEPARATOR } from "@budibase/types"
import type {
  Database,
  PlatformActionContainerStatus,
  PlatformActionSessionIndexDoc,
  PlatformActionSourceType,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { fetchSessions, type SessionsPageResult } from "./sessions"

async function putSession(
  db: Database,
  {
    sourceType,
    sourceId,
    status,
  }: {
    sourceType: PlatformActionSourceType
    sourceId: string
    status: PlatformActionContainerStatus
  }
): Promise<void> {
  const now = new Date().toISOString()
  const doc: PlatformActionSessionIndexDoc = {
    _id: `${DocumentType.PLATFORM_ACTION_SESSION}${SEPARATOR}${sourceType}${SEPARATOR}${sourceId}`,
    sourceType,
    sourceId,
    status,
    actionCount: 1,
    startedAt: now,
    updatedAt: now,
  }
  await db.put(doc)
}

describe("platformActions sessions", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  it("pages forward through the full list and stops at the end", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const db = context.getProdWorkspaceDB()
      for (const sourceId of ["run-1", "run-2", "run-3", "run-4", "run-5"]) {
        await putSession(db, {
          sourceType: "automation_run",
          sourceId,
          status: "completed",
        })
      }

      const baseline = await fetchSessions({
        environment: "prod",
        limit: 10,
      })
      expect(baseline.sessions).toHaveLength(5)

      const forwardPages: SessionsPageResult[] = []
      let bookmark: string | undefined
      while (true) {
        const page = await fetchSessions({
          environment: "prod",
          limit: 2,
          bookmark,
        })
        forwardPages.push(page)
        if (!page.pagination.hasNextPage) break
        bookmark = page.pagination.nextBookmark
      }

      expect(
        forwardPages.flatMap(p => p.sessions.map(s => s.sourceId))
      ).toEqual(baseline.sessions.map(s => s.sourceId))
      expect(forwardPages[0].pagination.hasPreviousPage).toBe(false)
      expect(forwardPages[0].pagination.previousBookmark).toBeUndefined()
      const lastForward = forwardPages[forwardPages.length - 1]
      expect(lastForward.pagination.hasNextPage).toBe(false)
      expect(lastForward.pagination.nextBookmark).toBeUndefined()
    })
  })

  it("pages backward to reconstruct an earlier page", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const db = context.getProdWorkspaceDB()
      for (const sourceId of ["run-a", "run-b", "run-c"]) {
        await putSession(db, {
          sourceType: "automation_run",
          sourceId,
          status: "completed",
        })
      }

      const firstPage = await fetchSessions({ environment: "prod", limit: 2 })
      expect(firstPage.pagination.hasNextPage).toBe(true)
      const secondPage = await fetchSessions({
        environment: "prod",
        limit: 2,
        bookmark: firstPage.pagination.nextBookmark,
      })

      const back = await fetchSessions({
        environment: "prod",
        limit: 2,
        bookmark: secondPage.pagination.previousBookmark,
      })

      expect(back.sessions.map(s => s.sourceId)).toEqual(
        firstPage.sessions.map(s => s.sourceId)
      )
      expect(back.pagination.hasPreviousPage).toBe(false)
      expect(back.pagination.previousBookmark).toBeUndefined()
      expect(back.pagination.hasNextPage).toBe(true)
    })
  })

  it("filters by status while paginating", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const db = context.getProdWorkspaceDB()
      for (const sourceId of ["failed-1", "failed-2", "failed-3"]) {
        await putSession(db, {
          sourceType: "automation_run",
          sourceId,
          status: "failed",
        })
      }
      await putSession(db, {
        sourceType: "automation_run",
        sourceId: "completed-1",
        status: "completed",
      })

      const baseline = await fetchSessions({
        environment: "prod",
        status: "failed",
        limit: 10,
      })
      expect(baseline.sessions).toHaveLength(3)
      expect(baseline.sessions.every(s => s.status === "failed")).toBe(true)

      const firstPage = await fetchSessions({
        environment: "prod",
        status: "failed",
        limit: 2,
      })
      expect(firstPage.pagination.hasNextPage).toBe(true)
      const secondPage = await fetchSessions({
        environment: "prod",
        status: "failed",
        limit: 2,
        bookmark: firstPage.pagination.nextBookmark,
      })
      expect(secondPage.pagination.hasNextPage).toBe(false)

      expect(
        [...firstPage.sessions, ...secondPage.sessions].map(s => s.sourceId)
      ).toEqual(baseline.sessions.map(s => s.sourceId))
    })
  })

  it("isolates sessions between prod and dev environments", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await putSession(context.getProdWorkspaceDB(), {
        sourceType: "automation_run",
        sourceId: "prod-run",
        status: "completed",
      })
      await putSession(context.getDevWorkspaceDB(), {
        sourceType: "automation_run",
        sourceId: "dev-run",
        status: "completed",
      })

      const prodSessions = await fetchSessions({
        environment: "prod",
        limit: 10,
      })
      const devSessions = await fetchSessions({ environment: "dev", limit: 10 })

      expect(prodSessions.sessions.map(s => s.sourceId)).toEqual(["prod-run"])
      expect(devSessions.sessions.map(s => s.sourceId)).toEqual(["dev-run"])
    })
  })

  describe("combined sessions (env omitted)", () => {
    it("merges prod and dev into one correctly ordered list", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        for (const sourceId of ["prod-1", "prod-2", "prod-3"]) {
          await putSession(context.getProdWorkspaceDB(), {
            sourceType: "automation_run",
            sourceId,
            status: "completed",
          })
        }
        for (const sourceId of ["dev-1", "dev-2", "dev-3"]) {
          await putSession(context.getDevWorkspaceDB(), {
            sourceType: "automation_run",
            sourceId,
            status: "completed",
          })
        }

        const prodOnly = await fetchSessions({ environment: "prod", limit: 10 })
        const devOnly = await fetchSessions({ environment: "dev", limit: 10 })
        const expectedOrder = [...prodOnly.sessions, ...devOnly.sessions]
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
          .map(s => s.sourceId)

        const combined = await fetchSessions({ limit: 10 })

        expect(combined.sessions.map(s => s.sourceId)).toEqual(expectedOrder)
        for (const session of combined.sessions) {
          expect(session.environment).toBe(
            session.sourceId.startsWith("prod") ? "prod" : "dev"
          )
        }
      })
    })

    it("paginates forward through the combined list across both environments", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        for (const sourceId of ["prod-1", "prod-2", "prod-3"]) {
          await putSession(context.getProdWorkspaceDB(), {
            sourceType: "automation_run",
            sourceId,
            status: "completed",
          })
        }
        for (const sourceId of ["dev-1", "dev-2", "dev-3"]) {
          await putSession(context.getDevWorkspaceDB(), {
            sourceType: "automation_run",
            sourceId,
            status: "completed",
          })
        }

        const baseline = await fetchSessions({ limit: 10 })
        expect(baseline.sessions).toHaveLength(6)

        const forwardPages: SessionsPageResult[] = []
        let bookmark: string | undefined
        while (true) {
          const page = await fetchSessions({ limit: 2, bookmark })
          forwardPages.push(page)
          if (!page.pagination.hasNextPage) break
          bookmark = page.pagination.nextBookmark
        }

        expect(
          forwardPages.flatMap(p => p.sessions.map(s => s.sourceId))
        ).toEqual(baseline.sessions.map(s => s.sourceId))
        expect(forwardPages[0].pagination.hasPreviousPage).toBe(false)
        const lastForward = forwardPages[forwardPages.length - 1]
        expect(lastForward.pagination.hasNextPage).toBe(false)
      })
    })

    it("pages backward through the combined list to reconstruct an earlier page", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        for (const sourceId of ["prod-1", "prod-2"]) {
          await putSession(context.getProdWorkspaceDB(), {
            sourceType: "automation_run",
            sourceId,
            status: "completed",
          })
        }
        for (const sourceId of ["dev-1", "dev-2"]) {
          await putSession(context.getDevWorkspaceDB(), {
            sourceType: "automation_run",
            sourceId,
            status: "completed",
          })
        }

        const firstPage = await fetchSessions({ limit: 2 })
        expect(firstPage.pagination.hasNextPage).toBe(true)
        const secondPage = await fetchSessions({
          limit: 2,
          bookmark: firstPage.pagination.nextBookmark,
        })

        const back = await fetchSessions({
          limit: 2,
          bookmark: secondPage.pagination.previousBookmark,
        })

        expect(back.sessions.map(s => s.sourceId)).toEqual(
          firstPage.sessions.map(s => s.sourceId)
        )
        expect(back.pagination.hasPreviousPage).toBe(false)
        expect(back.pagination.hasNextPage).toBe(true)
      })
    })

    it("keeps paginating correctly when every page is drawn from a single environment", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        // "failed" only exists in prod - dev contributes zero candidates on
        // every page, exercising the carry-over-unchanged bookmark path for
        // the non-contributing side.
        for (const sourceId of ["failed-1", "failed-2", "failed-3"]) {
          await putSession(context.getProdWorkspaceDB(), {
            sourceType: "automation_run",
            sourceId,
            status: "failed",
          })
        }
        await putSession(context.getDevWorkspaceDB(), {
          sourceType: "automation_run",
          sourceId: "dev-completed",
          status: "completed",
        })

        const baseline = await fetchSessions({ status: "failed", limit: 10 })
        expect(baseline.sessions).toHaveLength(3)

        const forwardPages: SessionsPageResult[] = []
        let bookmark: string | undefined
        while (true) {
          const page = await fetchSessions({
            status: "failed",
            limit: 2,
            bookmark,
          })
          forwardPages.push(page)
          if (!page.pagination.hasNextPage) break
          bookmark = page.pagination.nextBookmark
        }

        expect(
          forwardPages.flatMap(p => p.sessions.map(s => s.sourceId))
        ).toEqual(baseline.sessions.map(s => s.sourceId))
      })
    })
  })
})
