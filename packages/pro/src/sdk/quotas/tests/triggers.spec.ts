import {
  MonthlyQuotaName,
  QuotaUsageType,
  StaticQuotaName,
} from "@budibase/types"
import tk from "timekeeper"
import { DBTestConfiguration, mocks } from "../../../../tests"
import * as db from "../../../db"
import * as quotas from "../quotas"

const mockTriggerQuota = mocks.licenses.mockTriggerQuota

describe("triggers", () => {
  const config = new DBTestConfiguration()

  beforeEach(async () => {
    jest.clearAllMocks()
    config.newTenant()
  })

  it("static - 90 then 100", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.static.rows
    const now = new Date().toISOString()

    await config.doInWorkspace(async () => {
      // 90 percent
      let value = quota.value * 0.9
      await quotas.incrementMany({
        change: value,
        name: StaticQuotaName.ROWS,
        type: QuotaUsageType.STATIC,
      })
      let usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota.triggers.rows![90]).toBe(now)
      expect(usage.usageQuota.triggers.rows![100]).toBe(undefined)
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Rows",
        percentage: 90,
      })
      mockTriggerQuota.mockClear()

      // advance 1 day to ensure 90 trigger holds old date
      const nextDay = new Date()
      nextDay.setDate(nextDay.getDate() + 1)
      tk.freeze(nextDay)

      // continue to 100 percent
      value = quota.value * 0.1
      await quotas.incrementMany({
        change: value,
        name: StaticQuotaName.ROWS,
        type: QuotaUsageType.STATIC,
      })
      usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota.triggers.rows![90]).toBe(now)
      expect(usage.usageQuota.triggers.rows![100]).toBe(nextDay.toISOString())
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Rows",
        percentage: 100,
      })
    })
  })

  it("static - direct to 100, only triggers once", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.static.rows
    const now = new Date().toISOString()

    await config.doInWorkspace(async () => {
      let value = quota.value
      await quotas.incrementMany({
        change: value,
        name: StaticQuotaName.ROWS,
        type: QuotaUsageType.STATIC,
      })
      let usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota.triggers.rows![90]).toBe(now)
      expect(usage.usageQuota.triggers.rows![100]).toBe(now)
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Rows",
        percentage: 100,
      })
    })
  })

  it("monthly - 90 then 100", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.monthly.automations
    const now = new Date().toISOString()
    const currentMonthString = db.quotas.utils.getCurrentMonthString()

    await config.doInWorkspace(async () => {
      // 90 percent
      let value = quota.value * 0.9
      await quotas.incrementMany({
        change: value,
        name: MonthlyQuotaName.AUTOMATIONS,
        type: QuotaUsageType.MONTHLY,
      })
      let usage = await db.quotas.getQuotaUsage()
      expect(usage.monthly[currentMonthString].triggers.automations![80]).toBe(
        now
      ) // 80 is also recorded
      expect(usage.monthly[currentMonthString].triggers.automations![90]).toBe(
        now
      )
      expect(usage.monthly[currentMonthString].triggers.automations![100]).toBe(
        undefined
      )
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Automations",
        percentage: 90,
        resetDate: usage.quotaReset,
      })
      mockTriggerQuota.mockClear()

      // continue to 100 percent
      value = quota.value * 0.1
      await quotas.incrementMany({
        change: value,
        name: MonthlyQuotaName.AUTOMATIONS,
        type: QuotaUsageType.MONTHLY,
      })
      usage = await db.quotas.getQuotaUsage()
      expect(usage.monthly[currentMonthString].triggers.automations![80]).toBe(
        now
      )
      expect(usage.monthly[currentMonthString].triggers.automations![90]).toBe(
        now
      )
      expect(usage.monthly[currentMonthString].triggers.automations![100]).toBe(
        now
      )
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Automations",
        percentage: 100,
        resetDate: usage.quotaReset,
      })
      mockTriggerQuota.mockClear()
    })
  })

  it("monthly - direct to 100, only triggers once", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.monthly.automations
    const now = new Date().toISOString()
    const currentMonthString = db.quotas.utils.getCurrentMonthString()

    await config.doInWorkspace(async () => {
      const value = quota.value
      await quotas.incrementMany({
        change: value,
        name: MonthlyQuotaName.AUTOMATIONS,
        type: QuotaUsageType.MONTHLY,
      })
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.monthly[currentMonthString].triggers.automations![80]).toBe(
        now
      )
      expect(usage.monthly[currentMonthString].triggers.automations![90]).toBe(
        now
      )
      expect(usage.monthly[currentMonthString].triggers.automations![100]).toBe(
        now
      )
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Automations",
        percentage: 100,
        resetDate: usage.quotaReset,
      })
      mockTriggerQuota.mockClear()
    })
  })

  it("no triggers with unlimited license", async () => {
    const license = mocks.licenses.useUnlimited()
    const quota = license.quotas.usage.static.rows

    await config.doInWorkspace(async () => {
      let value = quota.value
      await quotas.incrementMany({
        change: value,
        name: StaticQuotaName.ROWS,
        type: QuotaUsageType.STATIC,
      })
      let usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota.triggers.rows![90]).toBe(undefined)
      expect(usage.usageQuota.triggers.rows![100]).toBe(undefined)
      expect(mockTriggerQuota).toHaveBeenCalledTimes(0)
    })
  })

  it("no triggers when already triggered", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.static.rows

    await config.doInWorkspace(async () => {
      let value = quota.value * 0.9
      await quotas.incrementMany({
        change: value,
        name: StaticQuotaName.ROWS,
        type: QuotaUsageType.STATIC,
      })

      // first trigger
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      mockTriggerQuota.mockClear()

      // no re-trigger
      await quotas.increment(StaticQuotaName.ROWS, QuotaUsageType.STATIC)
      expect(mockTriggerQuota).toHaveBeenCalledTimes(0)
    })
  })

  it("monthly - re-triggers the following month", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.monthly.automations
    await config.doInWorkspace(async () => {
      let value = quota.value
      await quotas.incrementMany({
        change: value,
        name: MonthlyQuotaName.AUTOMATIONS,
        type: QuotaUsageType.MONTHLY,
      })

      // first trigger
      let usage = await db.quotas.getQuotaUsage()
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Automations",
        percentage: 100,
        resetDate: usage.quotaReset,
      })
      mockTriggerQuota.mockClear()

      // fast-forward to next month
      const nowDate = new Date()
      const nextMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1)
      tk.freeze(nextMonth)

      await quotas.incrementMany({
        change: value,
        name: MonthlyQuotaName.AUTOMATIONS,
        type: QuotaUsageType.MONTHLY,
      })
      // re-triggered
      usage = await db.quotas.getQuotaUsage()
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Automations",
        percentage: 100,
        resetDate: usage.quotaReset,
      })
    })
  })

  it("re-triggers after usage is lowered", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.static.plugins

    await config.doInWorkspace(async () => {
      let value = quota.value * 0.9
      await quotas.incrementMany({
        change: value,
        name: StaticQuotaName.PLUGINS,
        type: QuotaUsageType.STATIC,
      })

      // first trigger
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      mockTriggerQuota.mockClear()

      // go one below the 90% threshold
      await quotas.decrement(StaticQuotaName.PLUGINS, QuotaUsageType.STATIC)

      // go above the threshold again
      await quotas.increment(StaticQuotaName.PLUGINS, QuotaUsageType.STATIC)

      // re-triggered
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
    })
  })

  it("triggers concurrently doesn't send two emails", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.static.plugins

    await config.doInWorkspace(async () => {
      const trigger = async () => {
        let value = quota.value * 0.9
        await quotas.incrementMany({
          change: value,
          name: StaticQuotaName.PLUGINS,
          type: QuotaUsageType.STATIC,
        })
      }

      // wait a small amount of time to emulate concurrent trigger requests.
      // this ensures the lock mechanism works as expected - however this
      // doesn't completely protect triggering against stale reads.
      mocks.licenses.mockTriggerQuota.mockImplementationOnce(async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 50)
        })
      })

      const promises = []
      promises.push(trigger())
      promises.push(trigger())

      await Promise.all(promises)

      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
    })
  })
})
