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

const REAL_TIMER_GLOBALS = [
  "hrtime",
  "nextTick",
  "performance",
  "queueMicrotask",
  "requestAnimationFrame",
  "requestIdleCallback",
  "setImmediate",
  "setInterval",
  "setTimeout",
] as const

describe("platformActions sessions", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  it.each(["prod", "dev", undefined] as const)(
    "rejects an empty bookmark with HTTP 400 for environment=%s",
    async environment => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await expect(
          fetchSessions({ environment, bookmark: "", limit: 2 })
        ).rejects.toMatchObject({
          message: "Invalid bookmark",
          status: 400,
        })
      })
    }
  )

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

    it.each([undefined, "completed"] as const)(
      "paginates timestamp ties in DB order in both directions with status=%s",
      async status => {
        await config.doInContext(config.getProdWorkspaceId(), async () => {
          jest.useFakeTimers({ doNotFake: [...REAL_TIMER_GLOBALS] })
          jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
          try {
            for (const sourceId of ["run-a", "run-b", "run-c"]) {
              for (const db of [
                context.getProdWorkspaceDB(),
                context.getDevWorkspaceDB(),
              ]) {
                await putSession(db, {
                  sourceType: "automation_run",
                  sourceId,
                  status: "completed",
                })
              }
            }
          } finally {
            jest.useRealTimers()
          }

          const expectedPages = [
            ["prod:run-c", "prod:run-b"],
            ["prod:run-a", "dev:run-c"],
            ["dev:run-b", "dev:run-a"],
          ]
          const pages: SessionsPageResult[] = []
          let bookmark: string | undefined
          for (const _expected of expectedPages) {
            const page = await fetchSessions({ limit: 2, status, bookmark })
            pages.push(page)
            bookmark = page.pagination.nextBookmark
          }

          expect(
            pages.map(page =>
              page.sessions.map(s => `${s.environment}:${s.sourceId}`)
            )
          ).toEqual(expectedPages)
          expect(pages[0].pagination.hasPreviousPage).toBe(false)
          expect(pages[pages.length - 1].pagination.hasNextPage).toBe(false)

          bookmark = pages[pages.length - 1].pagination.previousBookmark
          for (const expected of expectedPages.slice(0, -1).reverse()) {
            const page = await fetchSessions({ limit: 2, status, bookmark })
            expect(
              page.sessions.map(s => `${s.environment}:${s.sourceId}`)
            ).toEqual(expected)
            bookmark = page.pagination.previousBookmark
          }
          expect(bookmark).toBeUndefined()
        })
      }
    )

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

    it("returns an empty page when neither environment has any sessions", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const combined = await fetchSessions({ limit: 10 })

        expect(combined.sessions).toEqual([])
        expect(combined.pagination).toEqual({
          hasNextPage: false,
          hasPreviousPage: false,
          nextBookmark: undefined,
          previousBookmark: undefined,
        })
      })
    })

    it("breaks an exact updatedAt tie between environments by sorting prod before dev", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        jest.useFakeTimers({ doNotFake: [...REAL_TIMER_GLOBALS] })
        jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
        try {
          await putSession(context.getDevWorkspaceDB(), {
            sourceType: "automation_run",
            sourceId: "dev-tied",
            status: "completed",
          })
          await putSession(context.getProdWorkspaceDB(), {
            sourceType: "automation_run",
            sourceId: "prod-tied",
            status: "completed",
          })
        } finally {
          jest.useRealTimers()
        }

        const combined = await fetchSessions({ limit: 10 })

        expect(
          combined.sessions.map(s => ({
            sourceId: s.sourceId,
            environment: s.environment,
          }))
        ).toEqual([
          { sourceId: "prod-tied", environment: "prod" },
          { sourceId: "dev-tied", environment: "dev" },
        ])
      })
    })

    describe("backward reconstruction across a multi-page gap", () => {
      // db.put() stamps `updatedAt` from the real clock, so display order is
      // controlled purely by insertion order: inserting oldest-to-newest as
      // dev-4, prod-2, dev-3, dev-2, dev-1, prod-1 yields the reverse as the
      // newest-first display order - prod contributes to page 1, sits out
      // page 2 entirely, then resumes on page 3.
      let baseline: SessionsPageResult
      let page1: SessionsPageResult
      let page2: SessionsPageResult
      let page3: SessionsPageResult

      beforeEach(async () => {
        await config.doInContext(config.getProdWorkspaceId(), async () => {
          for (const [sourceId, db] of [
            ["dev-4", context.getDevWorkspaceDB()],
            ["prod-2", context.getProdWorkspaceDB()],
            ["dev-3", context.getDevWorkspaceDB()],
            ["dev-2", context.getDevWorkspaceDB()],
            ["dev-1", context.getDevWorkspaceDB()],
            ["prod-1", context.getProdWorkspaceDB()],
          ] as const) {
            await putSession(db, {
              sourceType: "automation_run",
              sourceId,
              status: "completed",
            })
          }

          baseline = await fetchSessions({ limit: 10 })
          page1 = await fetchSessions({ limit: 2 })
          page2 = await fetchSessions({
            limit: 2,
            bookmark: page1.pagination.nextBookmark,
          })
          page3 = await fetchSessions({
            limit: 2,
            bookmark: page2.pagination.nextBookmark,
          })
        })
      })

      it("sets up the intended gap: prod skips page 2 and resumes on page 3", () => {
        expect(baseline.sessions.map(s => s.sourceId).sort()).toEqual(
          ["dev-1", "dev-2", "dev-3", "dev-4", "prod-1", "prod-2"].sort()
        )
        const envPattern = baseline.sessions.map(s => s.environment)
        expect(envPattern.slice(0, 2)).toContain("prod")
        expect(envPattern.slice(2, 4)).toEqual(["dev", "dev"])
        expect(envPattern.slice(4, 6)).toContain("prod")
        expect(page1.sessions.map(s => s.sourceId)).toEqual(
          baseline.sessions.slice(0, 2).map(s => s.sourceId)
        )
        expect(page2.sessions.map(s => s.sourceId)).toEqual(
          baseline.sessions.slice(2, 4).map(s => s.sourceId)
        )
        expect(page3.sessions.map(s => s.sourceId)).toEqual(
          baseline.sessions.slice(4, 6).map(s => s.sourceId)
        )
        expect(page3.pagination.hasNextPage).toBe(false)
      })

      it("reconstructs page 2 one hop back from page 3", async () => {
        await config.doInContext(config.getProdWorkspaceId(), async () => {
          const reconstructedPage2 = await fetchSessions({
            limit: 2,
            bookmark: page3.pagination.previousBookmark,
          })
          expect(reconstructedPage2.sessions.map(s => s.sourceId)).toEqual(
            page2.sessions.map(s => s.sourceId)
          )
        })
      })

      it("reconstructs page 1 two hops back from page 3, past the gap", async () => {
        await config.doInContext(config.getProdWorkspaceId(), async () => {
          const reconstructedPage2 = await fetchSessions({
            limit: 2,
            bookmark: page3.pagination.previousBookmark,
          })
          const reconstructedPage1 = await fetchSessions({
            limit: 2,
            bookmark: reconstructedPage2.pagination.previousBookmark,
          })
          expect(reconstructedPage1.sessions.map(s => s.sourceId)).toEqual(
            page1.sessions.map(s => s.sourceId)
          )
          expect(reconstructedPage1.pagination.hasPreviousPage).toBe(false)
        })
      })
    })
  })
})
