import { cache, context } from "@budibase/backend-core"
import {
  MonthlyQuotaName,
  QuotaUsageType,
  StaticQuotaName,
} from "@budibase/types"
import tk from "timekeeper"
import { DBTestConfiguration, mocks } from "../../../tests"
import * as quotas from "../quotas"

const { Writethrough } = cache.writethrough

describe("quotas", () => {
  const config = new DBTestConfiguration()

  beforeEach(async () => {
    config.newTenant()
    tk.freeze(mocks.date.MOCK_DATE)
  })

  const getQuotaUsage = async () => {
    return config.doInTenant(() => {
      return quotas.getQuotaUsage()
    })
  }

  describe("getQuotaUsage", () => {
    it("returns the quotas", async () => {
      const usage = await getQuotaUsage()
      expect(usage).toBeDefined()
      expect(usage.usageQuota[StaticQuotaName.WORKSPACES]).toBe(0)
      expect(usage.usageQuota[StaticQuotaName.ROWS]).toBe(0)
      expect(usage.monthly["1-2020"]).toBeDefined()
      expect(usage.monthly["1-2020"][MonthlyQuotaName.AUTOMATIONS]).toBe(0)
      expect(usage.monthly["1-2020"][MonthlyQuotaName.QUERIES]).toBe(0)
    })

    it("initialised the monthly field", async () => {
      let usage = await getQuotaUsage()
      // manually delete the 'monthly' field (mimic backward compatibility)
      await config.doInTenant(async () => {
        let db = context.getGlobalDB()
        const writethroughDb = new Writethrough(db)
        delete usage.monthly
        await writethroughDb.put(usage)
      })
      expect(usage.monthly).toBeUndefined()

      usage = await getQuotaUsage()
      expect(usage.monthly).toBeDefined()
      expect(usage.monthly["1-2020"]).toBeDefined()
      expect(usage.monthly.current).toBe(usage.monthly["1-2020"])
    })
  })

  describe("setUsagePerApp", () => {
    it("sets the usage for two apps", async () => {
      await config.doInTenant(async () => {
        await quotas.setUsagePerApp(
          {
            app_1: 3,
            app_2: 4,
          },
          StaticQuotaName.ROWS,
          QuotaUsageType.STATIC
        )
        const usage = await getQuotaUsage()
        expect(usage).toBeDefined()
        expect(usage.apps["app_1"].usageQuota[StaticQuotaName.ROWS]).toBe(3)
        expect(usage.apps["app_2"].usageQuota[StaticQuotaName.ROWS]).toBe(4)
        expect(usage.usageQuota[StaticQuotaName.ROWS]).toBe(7)
      })
    })
  })

  describe("setAllUsage", () => {
    it("sets the usage", async () => {
      await config.doInTenant(async () => {
        await quotas.setAllUsage({
          name: StaticQuotaName.WORKSPACES,
          type: QuotaUsageType.STATIC,
          values: {
            total: 1,
          },
        })
        await quotas.setAllUsage({
          name: MonthlyQuotaName.AUTOMATIONS,
          type: QuotaUsageType.MONTHLY,
          values: {
            total: 1,
          },
        })

        const usage = await getQuotaUsage()

        expect(usage).toBeDefined()
        expect(usage.usageQuota[StaticQuotaName.WORKSPACES]).toBe(1)
        expect(usage.monthly["1-2020"][MonthlyQuotaName.AUTOMATIONS]).toBe(1)
      })
    })

    it("sets the usage in a new month", async () => {
      tk.reset() // use the real current date
      const monthString = quotas.utils.getCurrentMonthString()
      await config.doInTenant(async () => {
        await quotas.setAllUsage({
          name: StaticQuotaName.WORKSPACES,
          type: QuotaUsageType.STATIC,
          values: {
            total: 1,
          },
        })
        await quotas.setAllUsage({
          name: MonthlyQuotaName.AUTOMATIONS,
          type: QuotaUsageType.MONTHLY,
          values: {
            total: 1,
          },
        })

        const usage = await getQuotaUsage()

        expect(usage).toBeDefined()
        expect(usage.usageQuota[StaticQuotaName.WORKSPACES]).toBe(1)
        expect(usage.monthly[monthString][MonthlyQuotaName.AUTOMATIONS]).toBe(1)
      })
    })
  })

  describe("getCurrentUsageValues", () => {
    it("returns the current usage value", async () => {
      await config.doInTenant(async () => {
        let staticValue = (
          await quotas.getCurrentUsageValues(
            QuotaUsageType.STATIC,
            StaticQuotaName.WORKSPACES
          )
        ).total
        let monthlyValue = (
          await quotas.getCurrentUsageValues(
            QuotaUsageType.MONTHLY,
            MonthlyQuotaName.AUTOMATIONS
          )
        ).total
        expect(staticValue).toBe(0)
        expect(monthlyValue).toBe(0)

        await quotas.setAllUsage({
          name: StaticQuotaName.WORKSPACES,
          type: QuotaUsageType.STATIC,
          values: {
            total: 1,
          },
        })
        await quotas.setAllUsage({
          name: MonthlyQuotaName.AUTOMATIONS,
          type: QuotaUsageType.MONTHLY,
          values: {
            total: 1,
          },
        })
        staticValue = (
          await quotas.getCurrentUsageValues(
            QuotaUsageType.STATIC,
            StaticQuotaName.WORKSPACES
          )
        ).total
        monthlyValue = (
          await quotas.getCurrentUsageValues(
            QuotaUsageType.MONTHLY,
            MonthlyQuotaName.AUTOMATIONS
          )
        ).total

        expect(staticValue).toBe(1)
        expect(monthlyValue).toBe(1)
      })
    })

    it("returns the current usage value across months", async () => {
      await config.doInTenant(async () => {
        await quotas.setAllUsage({
          name: StaticQuotaName.WORKSPACES,
          type: QuotaUsageType.STATIC,
          values: {
            total: 1,
          },
        })
        await quotas.setAllUsage({
          name: MonthlyQuotaName.AUTOMATIONS,
          type: QuotaUsageType.MONTHLY,
          values: {
            total: 1,
          },
        })

        let staticValue = (
          await quotas.getCurrentUsageValues(
            QuotaUsageType.STATIC,
            StaticQuotaName.WORKSPACES
          )
        ).total
        let monthlyValue = (
          await quotas.getCurrentUsageValues(
            QuotaUsageType.MONTHLY,
            MonthlyQuotaName.AUTOMATIONS
          )
        ).total

        expect(staticValue).toBe(1)
        expect(monthlyValue).toBe(1)

        // fast forward to real current date
        tk.reset()

        staticValue = (
          await quotas.getCurrentUsageValues(
            QuotaUsageType.STATIC,
            StaticQuotaName.WORKSPACES
          )
        ).total
        monthlyValue = (
          await quotas.getCurrentUsageValues(
            QuotaUsageType.MONTHLY,
            MonthlyQuotaName.AUTOMATIONS
          )
        ).total

        expect(staticValue).toBe(1) // unchanged
        expect(monthlyValue).toBe(0) // reset
      })
    })
  })
})
