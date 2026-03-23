import {
  APIWarningCode,
  License,
  MonthlyQuotaName,
  QuotaUsageType,
  StaticQuotaName,
} from "@budibase/types"
import { DBTestConfiguration, mocks } from "../../../../tests"

import { tenancy } from "@budibase/backend-core"
import _ from "lodash"
import { CLOUD_FREE_LICENSE } from "../../../constants/licenses"
import * as db from "../../../db"
import * as quotas from "../quotas"

describe("quotas", () => {
  const config = new DBTestConfiguration()

  beforeEach(async () => {
    jest.clearAllMocks()
    config.newTenant()
  })

  describe("increment", () => {
    it("increments by one", async () => {
      await config.doInWorkspace(async () => {
        await quotas.increment(
          MonthlyQuotaName.AUTOMATIONS,
          QuotaUsageType.MONTHLY
        )
        const firstUsage = await db.quotas.getCurrentUsageValues(
          QuotaUsageType.MONTHLY,
          MonthlyQuotaName.AUTOMATIONS
        )
        expect(firstUsage.total).toBe(1)
        expect(firstUsage.app).toBe(1)

        await quotas.increment(
          MonthlyQuotaName.AUTOMATIONS,
          QuotaUsageType.MONTHLY
        )
        const secondUsage = await db.quotas.getCurrentUsageValues(
          QuotaUsageType.MONTHLY,
          MonthlyQuotaName.AUTOMATIONS
        )
        expect(secondUsage.total).toBe(2)
        expect(secondUsage.app).toBe(2)
      })
    })

    it("increments by one with exceeded", async () => {
      const license: License = _.cloneDeep(CLOUD_FREE_LICENSE)
      license.quotas.usage.static.apps.value = 4
      mocks.licenses.useLicense(license)
      await config.doInWorkspace(async () => {
        await quotas.increment(
          StaticQuotaName.WORKSPACES,
          QuotaUsageType.STATIC
        )
        await quotas.increment(
          StaticQuotaName.WORKSPACES,
          QuotaUsageType.STATIC
        )
        await quotas.increment(
          StaticQuotaName.WORKSPACES,
          QuotaUsageType.STATIC
        )
        await quotas.increment(
          StaticQuotaName.WORKSPACES,
          QuotaUsageType.STATIC
        )

        let error: any = {}
        try {
          await quotas.increment(
            StaticQuotaName.WORKSPACES,
            QuotaUsageType.STATIC
          )
        } catch (e: any) {
          error = e
        }

        expect(error.message).toBe("Usage limit exceeded: 'apps'")
        expect(error.code).toBe(APIWarningCode.USAGE_LIMIT_EXCEEDED)
        expect(error.limitName).toBe("apps")
      })
    })
  })

  /**
   * Our quota system currently works by reading current usage, incrementing it,
   * and then writing it back to the database. This means that if two requests
   * come in at the same time, they could both read the same value, increment it,
   * and then write it back, resulting in only one increment being recorded.
   *
   * We should fix this, but until then this test is skipped.
   */
  it.skip("increments safely under high load", async () => {
    await config.doInWorkspace(async () => {
      const count = 100
      const promises = []
      for (let i = 0; i < count; i++) {
        promises.push(
          quotas.increment(StaticQuotaName.ROWS, QuotaUsageType.STATIC)
        )
      }
      await Promise.all(promises)

      let usage = await db.quotas.getCurrentUsageValues(
        QuotaUsageType.STATIC,
        StaticQuotaName.ROWS
      )

      expect(usage.total).toBe(count)
      expect(usage.app).toBe(count)
    })
  })

  describe("per app", () => {
    it("increment a few different quotas across two apps", async () => {
      const app1 = config.newWorkspace()
      await config.doInWorkspace(async () => {
        await quotas.increment(
          MonthlyQuotaName.AUTOMATIONS,
          QuotaUsageType.MONTHLY
        )
        await quotas.increment(StaticQuotaName.ROWS, QuotaUsageType.STATIC)
      })
      const app2 = config.newWorkspace()
      await config.doInWorkspace(async () => {
        await quotas.increment(
          MonthlyQuotaName.AUTOMATIONS,
          QuotaUsageType.MONTHLY
        )
      })

      return config.doInTenant(async () => {
        const usage = await db.quotas.getQuotaUsage()
        const month = db.quotas.utils.getCurrentMonthString()
        // check overall totals
        expect(usage.usageQuota[StaticQuotaName.ROWS]).toBe(1)
        expect(usage.monthly[month][MonthlyQuotaName.AUTOMATIONS]).toBe(2)

        // check app1 usage
        const app1Usage = usage.apps?.[app1],
          app2Usage = usage.apps?.[app2]
        expect(app1Usage?.usageQuota[StaticQuotaName.ROWS]).toBe(1)
        expect(app1Usage?.monthly[month][MonthlyQuotaName.AUTOMATIONS]).toBe(1)

        // check app2 usage
        expect(app2Usage?.monthly[month][MonthlyQuotaName.AUTOMATIONS]).toBe(1)
        expect(app2Usage?.usageQuota[StaticQuotaName.ROWS]).toBe(0)
      })
    })
  })

  it("retrieve two different apps query usage", async () => {
    const app1 = config.workspaceId
    await config.doInWorkspace(() => {
      return quotas.increment(StaticQuotaName.ROWS, QuotaUsageType.STATIC)
    })

    const app2 = config.newWorkspace()
    await config.doInWorkspace(() => {
      return quotas.increment(StaticQuotaName.ROWS, QuotaUsageType.STATIC)
    })

    const usage1 = await config.doInWorkspace(() => {
      return db.quotas.getCurrentUsageValues(
        QuotaUsageType.STATIC,
        StaticQuotaName.ROWS
      )
    }, app1)
    const usage2 = await config.doInWorkspace(() => {
      return db.quotas.getCurrentUsageValues(
        QuotaUsageType.STATIC,
        StaticQuotaName.ROWS
      )
    }, app2)
    expect(usage1.total).toBe(2)
    expect(usage2.total).toBe(2)
    expect(usage1.app).toBe(1)
    expect(usage2.app).toBe(1)
  })

  describe("usageLimitIsExceeded", () => {
    beforeEach(async () => {
      const license: License = _.cloneDeep(CLOUD_FREE_LICENSE)
      license.quotas.usage.static.rows.value = 4
      mocks.licenses.useLicense(license)
      await config.doInWorkspace(() =>
        quotas.incrementMany({
          name: StaticQuotaName.ROWS,
          type: QuotaUsageType.STATIC,
          change: 4,
        })
      )
    })

    it("If updateUser simulation inform about a usage limit exceeded, the exception is treated and return true", async () => {
      const limitExceeded = await config.doInWorkspace(() =>
        quotas.usageLimitIsExceeded({
          name: StaticQuotaName.ROWS,
          type: QuotaUsageType.STATIC,
          usageChange: 1,
        })
      )

      expect(limitExceeded).toBe(true)
    })

    it("If updateUser simulation raises an error different than limit exceeded, an exception is raised", async () => {
      const error = new Error("Testing exception")
      jest.spyOn(tenancy, "getTenantId").mockImplementation(() => {
        throw error
      })

      await expect(async () => {
        await quotas.usageLimitIsExceeded({
          name: StaticQuotaName.ROWS,
          type: QuotaUsageType.STATIC,
          usageChange: 0,
        })
      }).rejects.toThrow(error.message)
    })
  })
})
