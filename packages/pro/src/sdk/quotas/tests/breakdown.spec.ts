import {
  ActionType,
  MonthlyQuotaName,
  MonthlyUsage,
  QuotaUsageType,
} from "@budibase/types"
import { DBTestConfiguration } from "../../../../tests"
import * as db from "../../../db"
import * as dbQuotaUtils from "../../../db/quotas/utils"
import * as quotas from "../quotas"

jest.mock("../../../db/quotas/utils", () => {
  const actual = jest.requireActual("../../../db/quotas/utils")
  return {
    ...actual,
    getCurrentMonthString: jest
      .fn()
      .mockImplementation(actual.getCurrentMonthString),
    // setCurrentMonth calls getCurrentMonthString directly (same-module reference),
    // so we override it here to go through the mockable export
    setCurrentMonth: (usage: any) => {
      const {
        getCurrentMonthString,
        generateNewMonthlyQuotas,
      } = require("../../../db/quotas/utils")
      const currentMonth = getCurrentMonthString()
      if (!usage.monthly) {
        usage.monthly = {}
      }
      if (!usage.monthly[currentMonth]) {
        usage.monthly[currentMonth] = generateNewMonthlyQuotas()
      }
      usage.monthly.current = usage.monthly[currentMonth]
    },
  }
})

import { sql, utils } from "@budibase/backend-core"

jest.setTimeout(10000)

const QUERIES = MonthlyQuotaName.QUERIES
const AUTOMATIONS = MonthlyQuotaName.AUTOMATIONS

function tableId() {
  return `ta_${utils.newid()}`
}

function dsId() {
  return `datasource_${utils.newid()}`
}

function autoId() {
  return `au_${utils.newid()}`
}

function dsPlusId() {
  return `datasource_plus_${utils.newid()}`
}

function dsPlusTableId() {
  return sql.utils.buildExternalTableId(dsPlusId(), utils.newid())
}

const config = new DBTestConfiguration()

type UpdateTest = {
  [key: string]: {
    name: string
    id?: string
  }[]
}

async function retrieveQuotas(
  appId: string,
  id?: string,
  type: QuotaUsageType = QuotaUsageType.MONTHLY,
  name: MonthlyQuotaName = MonthlyQuotaName.QUERIES
) {
  return config.doInWorkspace(async () => {
    const month = db.quotas.utils.getCurrentMonthString()
    const doc = await db.quotas.getQuotaUsage()
    let monthDoc = {}
    if (doc.apps?.[appId]) {
      monthDoc = doc.apps[appId].monthly[month]
    }
    const usageValues = await db.quotas.getCurrentUsageValues(type, name, id)
    return {
      ...usageValues,
      doc: monthDoc as MonthlyUsage,
    }
  }, appId)
}

async function updateQuotas(testCase: UpdateTest) {
  for (let [workspaceId, tests] of Object.entries(testCase)) {
    await config.doInWorkspace(async () => {
      for (let test of tests) {
        let type = Object.values(MonthlyQuotaName).includes(
          test.name as MonthlyQuotaName
        )
          ? QuotaUsageType.MONTHLY
          : QuotaUsageType.STATIC
        await quotas.increment(test.name as any, type, { id: test.id })
      }
    }, workspaceId)
  }
}

describe("quotas", () => {
  beforeEach(async () => {
    config.newTenant()
  })

  describe("actions global breakdown", () => {
    const actions = MonthlyQuotaName.ACTIONS

    it("tracks breakdown by action type at the global monthly level", async () => {
      await config.doInTenant(async () => {
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.CRUD,
        })
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.CRUD,
        })
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.AUTOMATION_STEP,
        })
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.AI_AGENT,
        })

        const month = db.quotas.utils.getCurrentMonthString()
        const doc = await db.quotas.getQuotaUsage()
        const monthDoc = doc.monthly[month]

        expect(monthDoc.actions).toBe(4)
        expect(monthDoc.breakdown?.actions?.parent).toBe("actions")
        expect(monthDoc.breakdown?.actions?.values[ActionType.CRUD]).toBe(2)
        expect(
          monthDoc.breakdown?.actions?.values[ActionType.AUTOMATION_STEP]
        ).toBe(1)
        expect(monthDoc.breakdown?.actions?.values[ActionType.AI_AGENT]).toBe(1)
      })
    })

    it("breakdown does not carry over to a new month", async () => {
      await config.doInTenant(async () => {
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.CRUD,
        })
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.CRUD,
        })

        const getCurrentMonthStringMock =
          dbQuotaUtils.getCurrentMonthString as jest.MockedFunction<
            typeof dbQuotaUtils.getCurrentMonthString
          >

        const oldMonth = getCurrentMonthStringMock()

        getCurrentMonthStringMock.mockReturnValue("1-2099")

        try {
          // reading quota usage triggers setCurrentMonth, which creates the new month entry
          const doc = await db.quotas.getQuotaUsage()

          expect(doc.monthly["1-2099"]).toBeDefined()
          expect(doc.monthly["1-2099"].actions).toBe(0)
          expect(doc.monthly["1-2099"].breakdown).toBeUndefined()

          // old month data is preserved but not accessible via current
          expect(doc.monthly[oldMonth].actions).toBe(2)
          expect(
            doc.monthly[oldMonth].breakdown?.actions?.values[ActionType.CRUD]
          ).toBe(2)

          // current now points to the new empty month
          expect(doc.monthly.current).toBe(doc.monthly["1-2099"])
        } finally {
          const getCurrentMonthStringMock =
            dbQuotaUtils.getCurrentMonthString as jest.MockedFunction<
              typeof dbQuotaUtils.getCurrentMonthString
            >
          getCurrentMonthStringMock.mockImplementation(
            jest.requireActual("../../../db/quotas/utils").getCurrentMonthString
          )
        }
      })
    })

    it("writes a zero breakdown value instead of leaving the stale count", async () => {
      await config.doInTenant(async () => {
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.CRUD,
        })

        // Force the breakdown counter back to 0 via a direct decrement
        await quotas.updateUsage({
          usageChange: -1,
          name: actions,
          type: QuotaUsageType.MONTHLY,
          opts: { id: ActionType.CRUD },
        })

        const month = db.quotas.utils.getCurrentMonthString()
        const doc = await db.quotas.getQuotaUsage()
        const monthDoc = doc.monthly[month]

        // Total is 0, breakdown must also reflect 0, not the stale 1
        expect(monthDoc.actions).toBe(0)
        expect(monthDoc.breakdown?.actions?.values[ActionType.CRUD]).toBe(0)
      })
    })

    it("getCurrentUsageValues returns the per-type breakdown count", async () => {
      await config.doInTenant(async () => {
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.CRUD,
        })
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.CRUD,
        })
        await quotas.increment(actions, QuotaUsageType.MONTHLY, {
          id: ActionType.AUTOMATION_STEP,
        })

        const crudValues = await db.quotas.getCurrentUsageValues(
          QuotaUsageType.MONTHLY,
          actions,
          ActionType.CRUD
        )
        expect(crudValues.total).toBe(3)
        expect(crudValues.breakdown).toBe(2)

        const automationValues = await db.quotas.getCurrentUsageValues(
          QuotaUsageType.MONTHLY,
          actions,
          ActionType.AUTOMATION_STEP
        )
        expect(automationValues.total).toBe(3)
        expect(automationValues.breakdown).toBe(1)
      })
    })
  })

  describe("app breakdown", () => {
    it("single app breakdown", async () => {
      const id1 = tableId(),
        id2 = tableId(),
        id3 = dsId(),
        id4 = autoId()
      await updateQuotas({
        [config.workspaceId]: [
          { name: QUERIES, id: id1 },
          { name: QUERIES, id: id2 },
          { name: QUERIES, id: id3 },
          { name: AUTOMATIONS, id: id4 },
        ],
      })
      let usage = await retrieveQuotas(config.workspaceId, id1)
      expect(usage.total).toBe(3)
      expect(usage.app).toBe(3)
      expect(usage.breakdown).toBe(1)
      expect(usage.doc.queries).toBe(3)
      const breakdown = usage.doc.breakdown
      expect(breakdown?.rowQueries?.parent).toEqual("queries")
      expect(breakdown?.rowQueries?.values[id1]).toEqual(1)
      expect(breakdown?.rowQueries?.values[id2]).toEqual(1)
      expect(breakdown?.datasourceQueries?.parent).toEqual("queries")
      expect(breakdown?.datasourceQueries?.values[id3]).toEqual(1)
      expect(breakdown?.automations?.parent).toEqual("automations")
      expect(breakdown?.automations?.values[id4]).toEqual(1)
    })

    it("two app breakdowns", async () => {
      const id1 = tableId(),
        id2 = tableId()

      const workspace1 = config.newWorkspace()
      const workspace2 = config.newWorkspace()

      await updateQuotas({
        [workspace1]: [
          { name: QUERIES, id: id1 },
          { name: QUERIES, id: id2 },
        ],
        [workspace2]: [
          { name: QUERIES, id: id1 },
          { name: QUERIES, id: id2 },
        ],
      })
      function checkUsage(usage: any) {
        expect(usage.total).toBe(4)
        expect(usage.app).toBe(2)
        expect(usage.breakdown).toBe(1)
        const breakdown = usage.doc.breakdown
        expect(breakdown.rowQueries.parent).toEqual("queries")
        expect(breakdown.rowQueries.values[id1]).toEqual(1)
        expect(breakdown.rowQueries.values[id2]).toEqual(1)
      }
      let workspace1Usage = await retrieveQuotas(workspace1, id1)
      let workspace2Usage = await retrieveQuotas(workspace2, id1)
      checkUsage(workspace1Usage)
      checkUsage(workspace2Usage)
    })

    it("should be able to handle a complex case", async () => {
      const table1 = tableId(),
        table2 = tableId(),
        table3 = tableId(),
        ds1 = dsId(),
        ds2 = dsId(),
        dsPlus1 = dsPlusTableId(),
        auto1 = autoId()

      const workspace1 = config.newWorkspace()
      const workspace2 = config.newWorkspace()

      await updateQuotas({
        [workspace1]: [
          { name: QUERIES, id: table1 },
          { name: QUERIES, id: table1 },
          { name: QUERIES, id: table1 },
          { name: QUERIES, id: table2 },
          { name: QUERIES, id: table2 },
          { name: QUERIES, id: table2 },
          { name: QUERIES, id: table2 },
          { name: QUERIES, id: table2 },
          { name: QUERIES, id: ds1 },
          { name: QUERIES, id: ds1 },
          { name: QUERIES, id: ds1 },
          { name: QUERIES, id: dsPlus1 },
          { name: QUERIES, id: dsPlus1 },
          { name: QUERIES, id: dsPlus1 },
          { name: AUTOMATIONS, id: auto1 },
          { name: AUTOMATIONS, id: auto1 },
          { name: AUTOMATIONS, id: auto1 },
        ],
        [workspace2]: [
          { name: QUERIES, id: table3 },
          { name: QUERIES, id: table3 },
          { name: QUERIES, id: table3 },
          { name: QUERIES, id: table3 },
          { name: QUERIES, id: table3 },
          { name: QUERIES, id: table1 },
          { name: QUERIES, id: table1 },
          { name: QUERIES, id: table1 },
          { name: QUERIES, id: ds2 },
          { name: QUERIES, id: ds2 },
          { name: QUERIES, id: ds2 },
          { name: AUTOMATIONS, id: auto1 },
          { name: AUTOMATIONS, id: auto1 },
          { name: AUTOMATIONS, id: auto1 },
        ],
      })
      const workspace1Usage = await retrieveQuotas(workspace1)
      const workspace2Usage = await retrieveQuotas(workspace2)
      const breakdown2 = workspace2Usage.doc.breakdown

      // overall across both apps
      expect(workspace1Usage).toMatchObject({
        total: 25,
        app: 14,
        doc: {
          queries: 14,
          automations: 3,
          breakdown: {
            rowQueries: {
              values: {
                [table1]: 3,
                [table2]: 5,
                [dsPlus1]: 3,
              },
            },
            datasourceQueries: {
              values: {
                [ds1]: 3,
              },
            },
            automations: {
              values: {
                [auto1]: 3,
              },
            },
          },
        },
      })

      expect(workspace2Usage.total).toBe(25)
      expect(workspace2Usage.app).toBe(11)
      expect(breakdown2?.rowQueries?.values[table3]).toBe(5)
      expect(breakdown2?.rowQueries?.values[table1]).toBe(3)
      expect(breakdown2?.datasourceQueries?.values[ds2]).toBe(3)
      expect(breakdown2?.automations?.values[auto1]).toBe(3)
    })
  })
})
