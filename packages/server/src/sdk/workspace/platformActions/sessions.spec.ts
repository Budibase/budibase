import tk from "timekeeper"
import { db, events } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { DocumentType, SEPARATOR } from "@budibase/types"
import type {
  PlatformActionSessionStatus,
  PlatformActionEnvironment,
  PlatformActionSessionIndexDoc,
  PlatformActionSourceType,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { fetchSessions, fetchSessionsSummary } from "./sessions"
import { encodeKeysetBookmark } from "./pagination"
import { clearOldHistory } from "./cleanup"
import { querySessions } from "./views"

jest.mock("./cleanup", () => {
  const actual = jest.requireActual("./cleanup")
  return { ...actual, clearOldHistory: jest.fn(actual.clearOldHistory) }
})

const actualClearOldHistory = jest.requireActual("./cleanup").clearOldHistory

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
    encodeURIComponent(sourceType),
    encodeURIComponent(sourceId),
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
    extra = {},
  }: {
    sourceType?: PlatformActionSourceType
    sourceId: string
    environment?: PlatformActionEnvironment
    status?: PlatformActionSessionStatus
    extra?: Partial<PlatformActionSessionIndexDoc>
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
        ...extra,
      }
      await events.platformActions.getActionsDB().put(doc)
    })
    await tick()
  }

  async function withContext<T>(fn: () => Promise<T>): Promise<T> {
    return config.doInContext(config.getProdWorkspaceId(), fn)
  }

  describe("fetchSessions", () => {
    it("pages forward and backward by ID when timestamps are equal", async () => {
      tk.freeze(new Date("2026-09-24T00:00:00.000Z"))
      try {
        for (const sourceId of ["c", "a", "e", "b", "d"]) {
          await createSession({ sourceId })
        }
      } finally {
        tk.reset()
      }

      const fetchPage = (bookmark?: string) =>
        withContext(() => fetchSessions({ limit: 2, bookmark }))
      const first = await fetchPage()
      const second = await fetchPage(first.pagination.nextBookmark)
      const third = await fetchPage(second.pagination.nextBookmark)
      const backToSecond = await fetchPage(third.pagination.previousBookmark)
      const backToFirst = await fetchPage(
        backToSecond.pagination.previousBookmark
      )

      expect(
        [first, second, third].map(page =>
          page.sessions.map(session => session.sourceId)
        )
      ).toEqual([["e", "d"], ["c", "b"], ["a"]])
      expect(backToSecond.sessions).toEqual(second.sessions)
      expect(backToFirst.sessions).toEqual(first.sessions)
      expect(third.pagination.hasNextPage).toBe(false)
      expect(backToFirst.pagination.hasPreviousPage).toBe(false)
    })

    it.each([
      {},
      { status: "active" as const },
      { environment: "prod" as const },
      { environment: "prod" as const, status: "active" as const },
    ])(
      "excludes sessions without timestamps from lists and counts: %j",
      async filters => {
        await createSession({ sourceId: "valid" })
        const result = await withContext(async () => {
          const workspaceDb = events.platformActions.getActionsDB()
          // Bypass put(), which automatically populates updatedAt.
          await db.directCouchQuery(workspaceDb.name, "POST", {
            _id: buildSessionId({
              environment: "prod",
              sourceType: "agent_session",
              sourceId: "missing-timestamp",
            }),
            environment: "prod",
            sourceType: "agent_session",
            sourceId: "missing-timestamp",
            status: "active",
            actionCount: 1,
          })
          return fetchSessions(filters)
        })

        expect(result.sessions.map(session => session.sourceId)).toEqual([
          "valid",
        ])
        expect(result.summary).toEqual({
          total: 1,
          active: 1,
          waiting: 0,
          completed: 0,
          failed: 0,
        })
      }
    )

    it("preserves source IDs with special characters when reading encoded session IDs", async () => {
      const sourceId = "run/a b%25"
      await createSession({ sourceId })

      const { sessions } = await withContext(() => fetchSessions({}))

      expect(sessions).toEqual([
        expect.objectContaining({
          sourceId,
          sourceType: "agent_session",
          environment: "prod",
        }),
      ])
    })

    it("exposes the session metadata without its internal capture timestamps", async () => {
      const capturedAt = "2026-08-31T00:00:00.000Z"
      await createSession({
        sourceId: "with-metadata",
        extra: {
          assetType: "agent",
          assetId: "agent-1",
          assetLabel: "HR assistant",
          assetCapturedAt: capturedAt,
          triggeredByType: "schedule",
          triggeredByCapturedAt: capturedAt,
        },
      })

      const { sessions } = await withContext(() => fetchSessions({}))

      expect(sessions).toEqual([
        expect.objectContaining({
          assetType: "agent",
          assetId: "agent-1",
          assetLabel: "HR assistant",
          triggeredByType: "schedule",
        }),
      ])
      expect(sessions[0]).not.toHaveProperty("assetCapturedAt")
      expect(sessions[0]).not.toHaveProperty("triggeredByCapturedAt")
    })

    it("rejects an explicitly supplied empty bookmark", async () => {
      await expect(
        withContext(() => fetchSessions({ bookmark: "" }))
      ).rejects.toMatchObject({ status: 400, message: "Invalid bookmark" })
    })

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
      it.each(["updated", "status changed", "deleted"] as const)(
        "does not skip the next session when the anchor is %s",
        async change => {
          const first = await withContext(() =>
            fetchSessions({ status: "active", limit: 2 })
          )
          const anchor = first.sessions[1]
          await withContext(async () => {
            const database = events.platformActions.getActionsDB()
            const doc = await database.get<PlatformActionSessionIndexDoc>(
              buildSessionId(anchor)
            )
            if (change === "deleted") {
              await database.remove(doc)
            } else {
              await database.put({
                ...doc,
                ...(change === "updated"
                  ? { updatedAt: "2099-01-01T00:00:00.000Z" }
                  : { status: "completed" }),
              })
            }
          })

          const next = await withContext(() =>
            fetchSessions({
              status: "active",
              limit: 2,
              bookmark: first.pagination.nextBookmark,
            })
          )
          expect(next.sessions.map(session => session.sourceId)).toEqual([
            "c",
            "b",
          ])
          expect(next.pagination.hasNextPage).toBe(true)
        }
      )

      it("does not skip a session when paging backward after the anchor moves", async () => {
        const first = await withContext(() => fetchSessions({ limit: 2 }))
        const second = await withContext(() =>
          fetchSessions({ limit: 2, bookmark: first.pagination.nextBookmark })
        )
        await withContext(async () => {
          const database = events.platformActions.getActionsDB()
          const doc = await database.get<PlatformActionSessionIndexDoc>(
            buildSessionId(second.sessions[0])
          )
          await database.put({ ...doc, updatedAt: "2099-01-01T00:00:00.000Z" })
        })

        const previous = await withContext(() =>
          fetchSessions({
            limit: 2,
            bookmark: second.pagination.previousBookmark,
          })
        )
        expect(previous.sessions.map(session => session.sourceId)).toEqual([
          "e",
          "d",
        ])
        expect(previous.pagination.hasPreviousPage).toBe(false)
      })

      it("excludes the anchor after it moves inside the previous page", async () => {
        await withContext(async () => {
          const database = events.platformActions.getActionsDB()
          for (const [index, sourceId] of ["a", "b", "c", "d", "e"].entries()) {
            const doc = await database.get<PlatformActionSessionIndexDoc>(
              buildSessionId({
                environment: "prod",
                sourceType: "agent_session",
                sourceId,
              })
            )
            tk.freeze(new Date(Date.UTC(2026, 8, 24, 0, 0, index)))
            try {
              await database.put(doc)
            } finally {
              tk.reset()
            }
          }
        })
        const first = await withContext(() => fetchSessions({ limit: 2 }))
        const second = await withContext(() =>
          fetchSessions({ limit: 2, bookmark: first.pagination.nextBookmark })
        )
        await withContext(async () => {
          const database = events.platformActions.getActionsDB()
          const doc = await database.get<PlatformActionSessionIndexDoc>(
            buildSessionId(second.sessions[0])
          )
          tk.freeze(new Date("2026-09-24T00:00:03.500Z"))
          try {
            await database.put(doc)
          } finally {
            tk.reset()
          }
        })

        const previous = await withContext(() =>
          fetchSessions({
            limit: 2,
            bookmark: second.pagination.previousBookmark,
          })
        )
        expect(previous.sessions.map(session => session.sourceId)).toEqual([
          "e",
          "d",
        ])
        expect(previous.pagination.hasPreviousPage).toBe(false)
        expect(previous.pagination.previousBookmark).toBeUndefined()
      })

      it.each(["next", "prev"] as const)(
        "rejects %s bookmarks outside the requested filter",
        async direction => {
          const cases = [
            {
              environment: "prod" as const,
              key: ["dev", "2026-09-24T00:00:00.000Z"],
            },
            {
              status: "active" as const,
              key: ["failed", "2026-09-24T00:00:00.000Z"],
            },
            {
              environment: "prod" as const,
              status: "active" as const,
              key: ["prod", "failed", "2026-09-24T00:00:00.000Z"],
            },
            { key: ["prod", "2026-09-24T00:00:00.000Z"] },
            { environment: "prod" as const, key: "2026-09-24T00:00:00.000Z" },
            { environment: "prod" as const, key: ["prod", {}] },
          ]
          for (const { key, ...filters } of cases) {
            await expect(
              withContext(() =>
                fetchSessions({
                  ...filters,
                  bookmark: encodeKeysetBookmark({
                    direction,
                    key,
                    id: "session",
                  }),
                })
              )
            ).rejects.toMatchObject({ status: 400 })
          }
        }
      )

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
    it.each([undefined, "prod", "dev"] as const)(
      "returns zero counts for an empty database with environment %s",
      async environment => {
        const summary = await withContext(() =>
          fetchSessionsSummary({ environment })
        )
        expect(summary).toEqual({
          total: 0,
          active: 0,
          waiting: 0,
          completed: 0,
          failed: 0,
        })
      }
    )

    it.each([undefined, "prod", "dev"] as const)(
      "groups different timestamps by status with environment %s",
      async environment => {
        for (const env of ["prod", "dev"] as const) {
          for (const status of [
            "active",
            "waiting",
            "completed",
            "failed",
          ] as const) {
            await createSession({
              sourceId: `${env}-${status}-1`,
              environment: env,
              status,
            })
            await createSession({
              sourceId: `${env}-${status}-2`,
              environment: env,
              status,
            })
          }
        }
        const summary = await withContext(() =>
          fetchSessionsSummary({ environment })
        )
        const count = environment ? 2 : 4
        expect(summary).toEqual({
          total: count * 4,
          active: count,
          waiting: count,
          completed: count,
          failed: count,
        })
      }
    )

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

  describe("retention", () => {
    it.each([
      { direction: "next", sameTimestamp: false },
      { direction: "prev", sameTimestamp: false },
      { direction: "next", sameTimestamp: true },
      { direction: "prev", sameTimestamp: true },
    ] as const)(
      "deduplicates a session changing status during $direction pagination (same timestamp: $sameTimestamp)",
      async ({ direction, sameTimestamp }) => {
        const active: PlatformActionSessionIndexDoc = {
          _id: "pas_moving",
          _rev: "1-old",
          sourceId: "moving",
          sourceType: "agent_session",
          environment: "prod",
          status: "active",
          actionCount: 1,
          startedAt: "2026-10-14T10:00:00.000Z",
          updatedAt: "2026-10-14T11:00:00.000Z",
        }
        const completed: PlatformActionSessionIndexDoc = {
          ...active,
          _rev: "2-new",
          status: "completed",
          updatedAt: sameTimestamp
            ? active.updatedAt
            : "2026-10-14T12:00:00.000Z",
        }
        const other: PlatformActionSessionIndexDoc = {
          ...active,
          _id: "pas_other",
          sourceId: "other",
          status: "waiting",
          updatedAt: "2026-10-14T10:00:00.000Z",
        }
        const result = await withContext(async () => {
          const database = events.platformActions.getActionsDB()
          const query = jest.spyOn(database, "query")
          // The active read sees the old revision; the completed read sees
          // the same session after its transition, within the same request.
          for (const docs of [[active], [other], [completed], []]) {
            query.mockResolvedValueOnce({
              total_rows: docs.length,
              offset: 0,
              rows: docs.map(doc => ({
                id: doc._id!,
                key: doc._id!,
                value: doc,
                doc,
              })),
            })
          }
          try {
            return await querySessions({
              workspaceDb: database,
              limit: 2,
              direction,
              cutoff: "2026-10-01T00:00:00.000Z",
            })
          } finally {
            query.mockRestore()
          }
        })
        expect(result).toEqual({ items: [completed, other], hasMore: false })
      }
    )

    const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24
    // Expired sessions stay stored, so reads have to hide them on their own
    beforeEach(() => {
      mocks.licenses.setPlatformActionsRetentionQuota(30)
      jest.mocked(clearOldHistory).mockResolvedValue()
    })

    afterEach(() => {
      jest.mocked(clearOldHistory).mockImplementation(actualClearOldHistory)
      mocks.licenses.useUnlimited()
    })

    async function createSessionDaysAgo({
      daysAgo,
      ...session
    }: {
      daysAgo: number
      sourceId: string
      environment?: PlatformActionEnvironment
      status?: PlatformActionSessionStatus
    }) {
      tk.freeze(new Date(Date.now() - daysAgo * ONE_DAY_MILLIS))
      try {
        await createSession(session)
      } finally {
        tk.reset()
      }
    }

    async function createMixedSessions() {
      await createSessionDaysAgo({ sourceId: "old-active", daysAgo: 60 })
      await createSessionDaysAgo({
        sourceId: "old-waiting",
        daysAgo: 50,
        status: "waiting",
      })
      await createSessionDaysAgo({
        sourceId: "expired-completed",
        daysAgo: 40,
        status: "completed",
      })
      await createSessionDaysAgo({
        sourceId: "expired-failed",
        daysAgo: 35,
        status: "failed",
      })
      await createSessionDaysAgo({
        sourceId: "recent-failed",
        daysAgo: 2,
        status: "failed",
      })
      await createSessionDaysAgo({
        sourceId: "recent-completed",
        daysAgo: 1,
        status: "completed",
      })
    }

    it.each([{}, { environment: "prod" as const }])(
      "hides expired terminal sessions but keeps old active and waiting ones: %j",
      async filters => {
        await createMixedSessions()

        const result = await withContext(() => fetchSessions(filters))

        expect(result.sessions.map(session => session.sourceId)).toEqual([
          "recent-completed",
          "recent-failed",
          "old-waiting",
          "old-active",
        ])
      }
    )

    it.each([
      { status: "completed" as const, expected: ["recent-completed"] },
      { status: "failed" as const, expected: ["recent-failed"] },
    ])(
      "excludes expired sessions from the $status filter",
      async ({ status, expected }) => {
        await createMixedSessions()

        const [all, prod] = await withContext(() =>
          Promise.all([
            fetchSessions({ status }),
            fetchSessions({ status, environment: "prod" }),
          ])
        )

        expect(all.sessions.map(session => session.sourceId)).toEqual(expected)
        expect(prod.sessions.map(session => session.sourceId)).toEqual(expected)
      }
    )

    it.each([undefined, "prod"] as const)(
      "fills pages with eligible sessions for environment %s",
      async environment => {
        await createMixedSessions()
        const first = await withContext(() =>
          fetchSessions({ environment, limit: 2 })
        )
        const second = await withContext(() =>
          fetchSessions({
            environment,
            limit: 2,
            bookmark: first.pagination.nextBookmark,
          })
        )
        const back = await withContext(() =>
          fetchSessions({
            environment,
            limit: 2,
            bookmark: second.pagination.previousBookmark,
          })
        )
        expect(first.sessions.map(session => session.sourceId)).toEqual([
          "recent-completed",
          "recent-failed",
        ])
        expect(second.sessions.map(session => session.sourceId)).toEqual([
          "old-waiting",
          "old-active",
        ])
        expect(second.pagination.hasNextPage).toBe(false)
        expect(back.sessions).toEqual(first.sessions)
        expect(back.pagination.hasPreviousPage).toBe(false)
      }
    )

    it("uses document IDs to paginate equal timestamps across statuses", async () => {
      tk.freeze(new Date())
      try {
        await createSession({ sourceId: "a", status: "failed" })
        await createSession({ sourceId: "b", status: "active" })
        await createSession({ sourceId: "c", status: "completed" })
        await createSession({ sourceId: "d", status: "waiting" })
      } finally {
        tk.reset()
      }
      const first = await withContext(() => fetchSessions({ limit: 2 }))
      const second = await withContext(() =>
        fetchSessions({ limit: 2, bookmark: first.pagination.nextBookmark })
      )
      const back = await withContext(() =>
        fetchSessions({
          limit: 2,
          bookmark: second.pagination.previousBookmark,
        })
      )
      expect(first.sessions.map(session => session.sourceId)).toEqual([
        "d",
        "c",
      ])
      expect(second.sessions.map(session => session.sourceId)).toEqual([
        "b",
        "a",
      ])
      expect(second.pagination.hasNextPage).toBe(false)
      expect(back.sessions).toEqual(first.sessions)
    })

    it("returns an empty page for a next bookmark older than the cutoff", async () => {
      await createMixedSessions()
      const bookmark = encodeKeysetBookmark({
        direction: "next",
        key: [
          "completed",
          new Date(Date.now() - 40 * ONE_DAY_MILLIS).toISOString(),
        ],
        id: "anything",
      })

      const result = await withContext(() =>
        fetchSessions({ status: "completed", bookmark })
      )

      expect(result.sessions).toEqual([])
      expect(result.pagination).toEqual({
        hasNextPage: false,
        hasPreviousPage: false,
      })
    })

    it("pages back from a bookmark older than the cutoff without expired sessions", async () => {
      await createMixedSessions()
      const bookmark = encodeKeysetBookmark({
        direction: "prev",
        key: [
          "completed",
          new Date(Date.now() - 50 * ONE_DAY_MILLIS).toISOString(),
        ],
        id: "anything",
      })

      const result = await withContext(() =>
        fetchSessions({ status: "completed", bookmark })
      )

      expect(result.sessions.map(session => session.sourceId)).toEqual([
        "recent-completed",
      ])
    })

    it.each([undefined, "prod"] as const)(
      "excludes expired sessions from counts with environment %s",
      async environment => {
        await createMixedSessions()

        const summary = await withContext(() =>
          fetchSessionsSummary({ environment })
        )

        expect(summary).toEqual({
          total: 4,
          active: 1,
          waiting: 1,
          completed: 1,
          failed: 1,
        })
      }
    )

    it("keeps every session with an unlimited quota", async () => {
      mocks.licenses.useUnlimited()
      await createMixedSessions()

      const result = await withContext(() => fetchSessions({}))

      expect(result.sessions).toHaveLength(6)
      expect(result.summary.total).toBe(6)
    })

    it("deletes expired sessions before listing", async () => {
      jest.mocked(clearOldHistory).mockImplementation(actualClearOldHistory)
      await createMixedSessions()

      await withContext(() => fetchSessions({}))

      const storedIds = await withContext(async () => {
        const response = await events.platformActions
          .getActionsDB()
          .allDocs<PlatformActionSessionIndexDoc>({ include_docs: true })
        return response.rows
          .map(row => row.doc!.sourceId)
          .filter(sourceId => sourceId !== undefined)
          .sort()
      })
      expect(storedIds).toEqual([
        "old-active",
        "old-waiting",
        "recent-completed",
        "recent-failed",
      ])
    })
  })
})
