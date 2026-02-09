import { context, db } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import {
  AutomationLog,
  AutomationLogPage,
  AutomationStatus,
  AutomationTriggerResult,
  AutomationTriggerStepId,
  Database,
} from "@budibase/types"
import { Mock } from "jest-mock"
import _ from "lodash"
import tk from "timekeeper"
import { mocks } from "../../../../../tests"
import {
  generateAutomationLogID,
  getExpiredLogs,
} from "../../../../db/automations"
import { daysAgo } from "../../../../utilities/time"
import { logSearch } from "../index"

jest.mock("@budibase/backend-core", () => ({
  ...jest.requireActual("@budibase/backend-core"),
  context: {
    getProdWorkspaceDB: jest.fn(),
  },
}))

const baseDate = new Date()
tk.freeze(baseDate)

let workspaceDb: Database = db.getDB(db.generateWorkspaceID())

async function generateAutomationLogs({
  automationId,
}: {
  automationId: string
}) {
  const logs = [
    { date: daysAgo(0), status: AutomationStatus.ERROR },
    { date: daysAgo(2), status: AutomationStatus.SUCCESS },
    { date: daysAgo(35), status: AutomationStatus.SUCCESS },
  ]
  for (let log of logs) {
    await generateAutomationLog(automationId, log)
  }
}

async function generateAutomationLog(
  automationId: string,
  log: {
    date: Date
    status: AutomationStatus
  }
) {
  const _id = generateAutomationLogID(
    log.date.toISOString(),
    log.status,
    automationId
  )
  const triggerResult: AutomationTriggerResult = {
    id: "triggerId",
    stepId: AutomationTriggerStepId.APP,
    outputs: {},
  }
  const obj: AutomationLog = {
    _id,
    status: log.status,
    automationId,
    createdAt: log.date.toISOString(),
    automationName: "automationName",
    trigger: triggerResult,
    steps: [triggerResult],
  }
  await workspaceDb.put(obj)
  const result = await workspaceDb.get<AutomationLog>(_id)
  return result
}

function newApp() {
  workspaceDb = db.getDB(db.generateWorkspaceID())
  const mockGetProdWorkspaceDB = context.getProdWorkspaceDB as Mock
  mockGetProdWorkspaceDB.mockReturnValue(workspaceDb)
}

describe("paid log testing", () => {
  beforeAll(async () => {
    newApp()
    const automationId = "au_4ad55bcf27b34855b4ae11f0ed50e5ac"
    await generateAutomationLogs({ automationId })
  })

  beforeEach(() => {
    mocks.licenses.setAutomationLogsQuota(30)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("check paid expired", async () => {
    const expired = await getExpiredLogs()
    expect(expired.data.length).toEqual(1)
  })

  it("should work with paid license", async () => {
    const logs = await logSearch({ startDate: daysAgo(30).toISOString() })
    expect(logs.data.length).toEqual(2)
  })

  it("check status lookup", async () => {
    const logs = await logSearch({
      startDate: daysAgo(30).toISOString(),
      status: AutomationStatus.SUCCESS,
    })
    expect(logs.data.length).toEqual(1)
  })

  describe("pagination", () => {
    const pageSize = 10
    const automationIds: string[] = []
    const allLogs: AutomationLog[] = []

    beforeAll(async () => {
      newApp()

      automationIds.push(...generator.unique(generator.guid, 3))
      const logs = []
      for (const automationId of automationIds) {
        const logsToCreate = generator.arrayOf<{
          date: Date
          status: AutomationStatus
        }>(
          () => ({
            date: generator.date({ max: new Date(), min: daysAgo(30) }) as Date,
            status: _.sample(Object.values(AutomationStatus))!,
          }),
          { min: 20, max: 20 }
        )
        for (let log of logsToCreate) {
          logs.push(await generateAutomationLog(automationId, log))
        }
      }
      allLogs.push(...logs.sort((a, b) => b._id!.localeCompare(a._id!)))
    })

    it("should return all automation logs", async () => {
      const logs = await logSearch({})
      expect(logs.data).toHaveLength(10)
      expect(logs).toEqual({
        data: expect.any(Array),
        hasNextPage: true,
        nextPage: allLogs[10]._id,
        totalLogs: allLogs.length,
        totalRows: allLogs.length,
      })
    })

    it("should be able to get a further page", async () => {
      const logs = await logSearch({ page: allLogs[12]._id })

      expect(logs).toEqual({
        data: allLogs
          .slice(12, 12 + pageSize)
          .map(({ _id }) => expect.objectContaining({ _id })),
        hasNextPage: true,
        nextPage: allLogs[12 + pageSize]._id,
        totalLogs: allLogs.length,
        totalRows: allLogs.length,
      })
    })

    it("should be able to get all documents via paging", async () => {
      const retirevedLogs = []

      let searchResponse: AutomationLogPage | undefined
      let pages = 0
      do {
        searchResponse = await logSearch({ page: searchResponse?.nextPage })
        retirevedLogs.push(...searchResponse.data)
        pages++
      } while (searchResponse.hasNextPage)

      expect(retirevedLogs).toEqual(allLogs)
      expect(pages).toBe(6)
    })

    it("should be able to filter by app", async () => {
      const automationId = automationIds[2]
      const logs = await logSearch({ automationId })
      expect(logs.data).toHaveLength(10)
      expect(logs).toEqual({
        data: expect.any(Array),
        hasNextPage: true,
        nextPage: expect.any(String),
        totalLogs: 60,
        totalRows: 180,
      })
    })

    it("should be able to page when filtering by automation id", async () => {
      const automationId = automationIds[2]
      const automationLogs = allLogs.filter(
        l => l.automationId === automationId
      )

      const firstPage = await logSearch({
        automationId,
      })
      const secondPage = await logSearch({
        automationId,
        page: firstPage.nextPage,
      })

      expect(automationLogs).toHaveLength(20)
      expect(firstPage).toEqual({
        data: automationLogs
          .slice(0, pageSize)
          .map(({ _id }) => expect.objectContaining({ _id })),
        hasNextPage: true,
        nextPage: expect.any(String),
        totalLogs: allLogs.length,
        totalRows: 180,
      })
      expect(secondPage).toEqual({
        data: automationLogs
          .slice(pageSize, pageSize * 2)
          .map(({ _id }) => expect.objectContaining({ _id })),
        hasNextPage: false,
        nextPage: undefined,
        totalLogs: allLogs.length,
        totalRows: 180,
      })
    })
  })
})

describe("free log testing", () => {
  beforeAll(async () => {
    newApp()
    const automationId = "au_4ad55bcf27b34855b4ae11f0ed50e5ac"
    await generateAutomationLogs({ automationId })
  })

  beforeEach(() => {
    mocks.licenses.setAutomationLogsQuota(1)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("check free expired", async () => {
    const expired = await getExpiredLogs()
    expect(expired.data.length).toEqual(2)
  })

  it("should work with free license", async () => {
    const logs = await logSearch({ startDate: daysAgo(30).toISOString() })
    expect(logs.data.length).toEqual(1)
  })
})
