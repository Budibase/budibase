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

const deferred = () => {
  let resolve!: () => void
  const promise = new Promise<void>(done => {
    resolve = done
  })
  return { promise, resolve }
}

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
    const quota = license.quotas.usage.monthly.actions
    const now = new Date().toISOString()
    const currentMonthString = db.quotas.utils.getCurrentMonthString()

    await config.doInWorkspace(async () => {
      // 90 percent
      let value = quota.value * 0.9
      await quotas.incrementMany({
        change: value,
        name: MonthlyQuotaName.ACTIONS,
        type: QuotaUsageType.MONTHLY,
      })
      let usage = await db.quotas.getQuotaUsage()
      expect(usage.monthly[currentMonthString].triggers.actions![80]).toBe(now) // 80 is also recorded
      expect(usage.monthly[currentMonthString].triggers.actions![90]).toBe(now)
      expect(usage.monthly[currentMonthString].triggers.actions![100]).toBe(
        undefined
      )
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Actions",
        percentage: 90,
        resetDate: usage.quotaReset,
      })
      mockTriggerQuota.mockClear()

      // continue to 100 percent
      value = quota.value * 0.1
      await quotas.incrementMany({
        change: value,
        name: MonthlyQuotaName.ACTIONS,
        type: QuotaUsageType.MONTHLY,
      })
      usage = await db.quotas.getQuotaUsage()
      expect(usage.monthly[currentMonthString].triggers.actions![80]).toBe(now)
      expect(usage.monthly[currentMonthString].triggers.actions![90]).toBe(now)
      expect(usage.monthly[currentMonthString].triggers.actions![100]).toBe(now)
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Actions",
        percentage: 100,
        resetDate: usage.quotaReset,
      })
      mockTriggerQuota.mockClear()
    })
  })

  it("monthly - direct to 100, only triggers once", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.monthly.actions
    const now = new Date().toISOString()
    const currentMonthString = db.quotas.utils.getCurrentMonthString()

    await config.doInWorkspace(async () => {
      const value = quota.value
      await quotas.incrementMany({
        change: value,
        name: MonthlyQuotaName.ACTIONS,
        type: QuotaUsageType.MONTHLY,
      })
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.monthly[currentMonthString].triggers.actions![80]).toBe(now)
      expect(usage.monthly[currentMonthString].triggers.actions![90]).toBe(now)
      expect(usage.monthly[currentMonthString].triggers.actions![100]).toBe(now)
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Actions",
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
    const quota = license.quotas.usage.monthly.actions
    await config.doInWorkspace(async () => {
      let value = quota.value
      await quotas.incrementMany({
        change: value,
        name: MonthlyQuotaName.ACTIONS,
        type: QuotaUsageType.MONTHLY,
      })

      // first trigger
      let usage = await db.quotas.getQuotaUsage()
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Actions",
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
        name: MonthlyQuotaName.ACTIONS,
        type: QuotaUsageType.MONTHLY,
      })
      // re-triggered
      usage = await db.quotas.getQuotaUsage()
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Actions",
        percentage: 100,
        resetDate: usage.quotaReset,
      })
    })
  })

  it("re-triggers after usage is lowered", async () => {
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

      // go one below the 90% threshold
      await quotas.decrement(StaticQuotaName.ROWS, QuotaUsageType.STATIC)

      // go above the threshold again
      await quotas.increment(StaticQuotaName.ROWS, QuotaUsageType.STATIC)

      // re-triggered
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
    })
  })

  it("allows quota reads and updates while a notification is pending", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.static.rows

    await config.doInWorkspace(async () => {
      await quotas.set(
        StaticQuotaName.ROWS,
        QuotaUsageType.STATIC,
        quota.value * 0.9 - 1
      )
      const notifying = deferred()
      const releaseNotification = deferred()
      mockTriggerQuota.mockImplementationOnce(async () => {
        notifying.resolve()
        await releaseNotification.promise
      })
      const first = quotas.increment(
        StaticQuotaName.ROWS,
        QuotaUsageType.STATIC
      )
      await notifying.promise
      const second = quotas.increment(
        StaticQuotaName.ROWS,
        QuotaUsageType.STATIC
      )
      const read = db.quotas.getQuotaUsage()
      let timer: ReturnType<typeof setTimeout> | undefined
      let completedWhileNotifying = false
      try {
        completedWhileNotifying = await Promise.race([
          Promise.all([second, read]).then(() => true),
          new Promise<boolean>(resolve => {
            timer = setTimeout(() => resolve(false), 1000)
          }),
        ])
      } finally {
        clearTimeout(timer)
        releaseNotification.resolve()
        await Promise.all([first, second, read])
      }

      const usage = await db.quotas.getCurrentUsageValues(
        QuotaUsageType.STATIC,
        StaticQuotaName.ROWS
      )
      expect(completedWhileNotifying).toBe(true)
      expect(usage.total).toBe(quota.value * 0.9 + 1)
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
    })
  })

  it("sends a higher threshold notification while an earlier one is pending", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.static.rows

    await config.doInWorkspace(async () => {
      await quotas.set(
        StaticQuotaName.ROWS,
        QuotaUsageType.STATIC,
        quota.value * 0.9 - 1
      )
      const notifying = deferred()
      const releaseNotification = deferred()
      mockTriggerQuota.mockImplementationOnce(async () => {
        notifying.resolve()
        await releaseNotification.promise
      })
      const first = quotas.increment(
        StaticQuotaName.ROWS,
        QuotaUsageType.STATIC
      )
      await notifying.promise
      try {
        await quotas.incrementMany({
          change: quota.value * 0.1,
          name: StaticQuotaName.ROWS,
          type: QuotaUsageType.STATIC,
        })
      } finally {
        releaseNotification.resolve()
        await first
      }
      expect(mockTriggerQuota).toHaveBeenCalledTimes(2)
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Rows",
        percentage: 90,
      })
      expect(mockTriggerQuota).toHaveBeenCalledWith({
        name: "Rows",
        percentage: 100,
      })
    })
  })

  it("keeps committed usage when the notification fails", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.static.rows

    await config.doInWorkspace(async () => {
      mockTriggerQuota.mockRejectedValueOnce(new Error("Licensing unavailable"))
      await quotas.incrementMany({
        change: quota.value * 0.9,
        name: StaticQuotaName.ROWS,
        type: QuotaUsageType.STATIC,
      })
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota.rows).toBe(quota.value * 0.9)
      expect(usage.usageQuota.triggers.rows![90]).toBeDefined()
      expect(mockTriggerQuota).toHaveBeenCalledTimes(1)
    })
  })

  it("triggers concurrently doesn't send two emails", async () => {
    const license = mocks.licenses.useCloudFree()
    const quota = license.quotas.usage.static.rows

    await config.doInWorkspace(async () => {
      const trigger = async () => {
        await quotas.incrementMany({
          change: 1,
          name: StaticQuotaName.ROWS,
          type: QuotaUsageType.STATIC,
        })
      }

      await quotas.set(
        StaticQuotaName.ROWS,
        QuotaUsageType.STATIC,
        quota.value * 0.9 - 1
      )
      // The first update reaches 90%; the second must still apply its increment.
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
      const usage = await db.quotas.getCurrentUsageValues(
        QuotaUsageType.STATIC,
        StaticQuotaName.ROWS
      )
      expect(usage.total).toBe(quota.value * 0.9 + 1)
    })
  })
})
