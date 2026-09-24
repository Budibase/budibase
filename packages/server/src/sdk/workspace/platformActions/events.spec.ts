import { events, utils } from "@budibase/backend-core"
import type {
  PlatformActionEnvironment,
  PlatformActionEvent,
  PlatformActionSourceType,
} from "@budibase/types"
import { DocumentType, SEPARATOR } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { fetchSessionEvents, fetchSessionEventsSummary } from "./events"

const tick = () => new Promise(resolve => setTimeout(resolve, 5))

describe("platformActions events", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  async function createEvent({
    environment = "prod",
    sourceType = "agent_session",
    sourceId,
    eventName = "action:tool:executed",
  }: {
    environment?: PlatformActionEnvironment
    sourceType?: PlatformActionSourceType
    sourceId: string
    eventName?: string
  }) {
    const timestamp = new Date().toISOString()
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
    await tick()
  }

  async function withContext<T>(fn: () => Promise<T>): Promise<T> {
    return config.doInContext(config.getProdWorkspaceId(), fn)
  }

  describe("fetchSessionEvents", () => {
    it("lists events for the exact session, oldest first", async () => {
      await createEvent({ sourceId: "run-1", eventName: "action:step:1" })
      await createEvent({ sourceId: "run-1", eventName: "action:step:2" })
      await createEvent({ sourceId: "run-1", eventName: "action:step:3" })

      const { events: page } = await withContext(() =>
        fetchSessionEvents({
          environment: "prod",
          sourceType: "agent_session",
          sourceId: "run-1",
          limit: 10,
        })
      )

      expect(page.map(e => e.eventName)).toEqual([
        "action:step:1",
        "action:step:2",
        "action:step:3",
      ])
    })

    it("isolates events by environment for the same source id", async () => {
      await createEvent({
        sourceId: "run-1",
        environment: "prod",
        eventName: "action:prod:1",
      })
      await createEvent({
        sourceId: "run-1",
        environment: "dev",
        eventName: "action:dev:1",
      })

      const { events: page } = await withContext(() =>
        fetchSessionEvents({
          environment: "prod",
          sourceType: "agent_session",
          sourceId: "run-1",
          limit: 10,
        })
      )

      expect(page.map(e => e.eventName)).toEqual(["action:prod:1"])
    })

    it("isolates events by source type and source id", async () => {
      await createEvent({
        sourceId: "shared-id",
        sourceType: "agent_session",
        eventName: "action:agent:1",
      })
      await createEvent({
        sourceId: "shared-id",
        sourceType: "automation_run",
        eventName: "action:automation:1",
      })

      const { events: page } = await withContext(() =>
        fetchSessionEvents({
          environment: "prod",
          sourceType: "agent_session",
          sourceId: "shared-id",
          limit: 10,
        })
      )

      expect(page.map(e => e.eventName)).toEqual(["action:agent:1"])
    })

    describe("pagination", () => {
      beforeEach(async () => {
        for (const eventName of ["1", "2", "3", "4", "5"]) {
          await createEvent({ sourceId: "run-1", eventName })
        }
      })

      it("pages forward and reconstructs the full ordered list", async () => {
        const baseline = await withContext(() =>
          fetchSessionEvents({
            environment: "prod",
            sourceType: "agent_session",
            sourceId: "run-1",
            limit: 100,
          })
        )
        const expectedOrder = baseline.events.map(e => e.eventName)

        const collected: string[] = []
        let bookmark: string | undefined
        let hasNextPage = true
        while (hasNextPage) {
          const page: Awaited<ReturnType<typeof fetchSessionEvents>> =
            await withContext(() =>
              fetchSessionEvents({
                environment: "prod",
                sourceType: "agent_session",
                sourceId: "run-1",
                limit: 2,
                bookmark,
              })
            )
          collected.push(...page.events.map(e => e.eventName))
          hasNextPage = page.pagination.hasNextPage
          bookmark = page.pagination.nextBookmark
        }

        expect(collected).toEqual(expectedOrder)
      })

      it("pages backward to reconstruct an earlier page", async () => {
        const fetchPage = (bookmark?: string) =>
          withContext(() =>
            fetchSessionEvents({
              environment: "prod",
              sourceType: "agent_session",
              sourceId: "run-1",
              limit: 2,
              bookmark,
            })
          )

        const firstPage = await fetchPage()
        const secondPage = await fetchPage(firstPage.pagination.nextBookmark)
        const backToFirst = await fetchPage(
          secondPage.pagination.previousBookmark
        )

        expect(backToFirst.events.map(e => e.eventName)).toEqual(
          firstPage.events.map(e => e.eventName)
        )
      })
    })
  })

  describe("fetchSessionEventsSummary", () => {
    it("counts the persisted events for the whole session, not just a page", async () => {
      await createEvent({ sourceId: "run-1", eventName: "1" })
      await createEvent({ sourceId: "run-1", eventName: "2" })
      await createEvent({ sourceId: "run-1", eventName: "3" })
      await createEvent({
        sourceId: "run-1",
        environment: "dev",
        eventName: "dev-only",
      })

      const summary = await withContext(() =>
        fetchSessionEventsSummary({
          environment: "prod",
          sourceType: "agent_session",
          sourceId: "run-1",
        })
      )

      expect(summary).toEqual({ total: 3 })
    })
  })
})
