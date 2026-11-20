import {
  APIWarningCode,
  ActionType,
  License,
  LockName,
  MonthlyQuotaName,
  QuotaUsageType,
  QuotaUsage,
  StaticQuotaName,
} from "@budibase/types"
import { DBTestConfiguration, mocks } from "../../../../tests"

import { tenancy } from "@budibase/backend-core"
import _ from "lodash"
import Redlock from "redlock"
import { CLOUD_FREE_LICENSE } from "../../../constants/licenses"
import * as db from "../../../db"
import * as licensing from "../../licensing"
import * as quotas from "../quotas"

const deferred = () => {
  let resolve!: () => void
  const promise = new Promise<void>(done => {
    resolve = done
  })
  return { promise, resolve }
}

const withTestDeadline = async <T>(task: Promise<T>): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      task,
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(
          () => reject(new Error("Quota test timed out")),
          5000
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

describe("quotas", () => {
  const config = new DBTestConfiguration()

  beforeEach(async () => {
    jest.clearAllMocks()
    config.newTenant()
  })

  describe("empty updates", () => {
    it("does not resolve licenses or initialize usage for an empty action list", async () => {
      await config.doInTenant(async () => {
        jest.mocked(licensing.cache.getCachedLicense).mockClear()

        await quotas.updateUsage([])

        expect(licensing.cache.getCachedLicense).not.toHaveBeenCalled()
        expect(
          await tenancy.getGlobalDB().tryGet(db.quotas.utils.getQuotaDocId())
        ).toBeUndefined()
      })
    })
  })

  describe("workspace validation", () => {
    it.each([false, true])(
      "rejects missing workspace before resolving licenses (mixed batch: %s)",
      async mixed => {
        mocks.licenses.useUnlimited()
        await config.doInTenant(async () => {
          const appAction = {
            usageChange: 1,
            name: StaticQuotaName.ROWS,
            type: QuotaUsageType.STATIC,
          }
          const params = mixed
            ? [
                {
                  usageChange: 1,
                  name: MonthlyQuotaName.ACTIONS,
                  type: QuotaUsageType.MONTHLY,
                },
                appAction,
              ]
            : appAction
          jest.mocked(licensing.cache.getCachedLicense).mockClear()

          await expect(quotas.updateUsage(params)).rejects.toThrow(
            "App context required for quota update"
          )

          expect(licensing.cache.getCachedLicense).not.toHaveBeenCalled()
          expect(
            await tenancy.getGlobalDB().tryGet(db.quotas.utils.getQuotaDocId())
          ).toBeUndefined()
        })
      }
    )

    it("allows tenant quotas without a workspace", async () => {
      mocks.licenses.useUnlimited()
      await config.doInTenant(async () => {
        await quotas.updateUsage({
          usageChange: 1,
          name: MonthlyQuotaName.ACTIONS,
          type: QuotaUsageType.MONTHLY,
        })
        const usage = await db.quotas.getCurrentUsageValues(
          QuotaUsageType.MONTHLY,
          MonthlyQuotaName.ACTIONS
        )
        expect(usage.total).toBe(1)
      })
    })
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

  it("increments safely under high load", async () => {
    mocks.licenses.useUnlimited()
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

  describe("concurrent usage updates", () => {
    beforeEach(() => {
      mocks.licenses.useUnlimited()
    })

    it("keeps tenants independent while another tenant holds its usage lock", async () => {
      const otherTenant = new DBTestConfiguration()
      await config.doInTenant(async () => {
        await db.quotas.setAllUsage(async () => {
          // Tenant B must finish before A releases its lock, not just afterwards.
          await withTestDeadline(
            otherTenant.doInTenant(() =>
              quotas.updateUsage({
                name: MonthlyQuotaName.ACTIONS,
                type: QuotaUsageType.MONTHLY,
                usageChange: 7,
                opts: { id: ActionType.AUTOMATION_STEP },
              })
            )
          )
          return [
            {
              name: MonthlyQuotaName.ACTIONS,
              type: QuotaUsageType.MONTHLY,
              values: { total: 3, breakdown: 3 },
              opts: { id: ActionType.AI_AGENT },
            },
          ]
        })
      })

      for (const { tenant, actions, actionType } of [
        { tenant: config, actions: 3, actionType: ActionType.AI_AGENT },
        {
          tenant: otherTenant,
          actions: 7,
          actionType: ActionType.AUTOMATION_STEP,
        },
      ]) {
        await tenant.doInTenant(async () => {
          const cached = await db.quotas.getQuotaUsage()
          const persisted = await tenancy
            .getGlobalDB()
            .tryGet<QuotaUsage>(db.quotas.utils.getQuotaDocId())
          const month = db.quotas.utils.getCurrentMonthString()
          for (const usage of [cached, persisted]) {
            expect(usage?.monthly[month].actions).toBe(actions)
            expect(usage?.monthly[month].breakdown?.actions?.values).toEqual({
              [actionType]: actions,
            })
          }
        })
      }
    })

    it("preserves queued action increments when an older credit write resumes", async () => {
      await config.doInTenant(async () => {
        await db.quotas.setUsage(
          1192,
          MonthlyQuotaName.ACTIONS,
          QuotaUsageType.MONTHLY
        )
        const database = tenancy.getGlobalDB()
        const originalPut = database.put.bind(database)
        const writing = deferred()
        const releaseWrite = deferred()
        const contendersStarted = deferred()
        let lockAttempts = 0
        let observeContenders = false
        const getDatabase = jest
          .spyOn(tenancy, "getGlobalDB")
          .mockReturnValue(database)
        const usageLockName = `lock:${tenancy.getTenantId()}_${LockName.UPDATE_QUOTA_USAGE}_${database.name}:${db.quotas.utils.getQuotaDocId()}`
        const originalLock = Redlock.prototype.lock
        const lock = jest
          .spyOn(Redlock.prototype, "lock")
          .mockImplementation(function (this: Redlock, ...args) {
            const pendingLock = originalLock.apply(this, args)
            if (
              observeContenders &&
              args[0] === usageLockName &&
              ++lockAttempts === 2
            ) {
              contendersStarted.resolve()
            }
            return pendingLock
          })
        const put = jest
          .spyOn(database, "put")
          .mockImplementationOnce(async (...args) => {
            writing.resolve()
            await releaseWrite.promise
            return originalPut(...args)
          })
        const writes: Promise<void>[] = []
        try {
          writes.push(
            quotas.updateUsage({
              name: MonthlyQuotaName.BUDIBASE_AI_CREDITS,
              type: QuotaUsageType.MONTHLY,
              usageChange: 10,
            })
          )
          await withTestDeadline(writing.promise)
          observeContenders = true
          for (let i = 0; i < 2; i++) {
            writes.push(
              quotas.updateUsage({
                name: MonthlyQuotaName.ACTIONS,
                type: QuotaUsageType.MONTHLY,
                usageChange: 1,
                opts: { id: ActionType.AI_AGENT },
              })
            )
          }
          // Both updates have reached the usage-lock boundary while persistence is paused.
          await withTestDeadline(contendersStarted.promise)
          releaseWrite.resolve()
          await withTestDeadline(Promise.all(writes))

          const cached = await db.quotas.getQuotaUsage()
          const persisted = await database.tryGet<QuotaUsage>(
            db.quotas.utils.getQuotaDocId()
          )
          const month = db.quotas.utils.getCurrentMonthString()
          for (const usage of [cached, persisted]) {
            expect(usage?.monthly[month]).toMatchObject({
              actions: 1194,
              budibaseAICredits: 10,
              breakdown: { actions: { values: { aiAgent: 2 } } },
            })
          }
        } finally {
          releaseWrite.resolve()
          try {
            await withTestDeadline(Promise.allSettled(writes))
          } finally {
            put.mockRestore()
            lock.mockRestore()
            getDatabase.mockRestore()
          }
        }
      })
    })

    it("preserves action and credit increments in cache and database", async () => {
      await config.doInTenant(async () => {
        await db.quotas.getQuotaUsage()
        await Promise.all(
          Array.from({ length: 8 }, () => [
            quotas.increment(MonthlyQuotaName.ACTIONS, QuotaUsageType.MONTHLY, {
              id: ActionType.AI_AGENT,
            }),
            quotas.incrementMany({
              change: 10,
              name: MonthlyQuotaName.BUDIBASE_AI_CREDITS,
              type: QuotaUsageType.MONTHLY,
            }),
          ]).flat()
        )

        const cached = await db.quotas.getQuotaUsage()
        const persisted = await tenancy
          .getGlobalDB()
          .get<QuotaUsage>(db.quotas.utils.getQuotaDocId())
        const month = db.quotas.utils.getCurrentMonthString()
        for (const usage of [cached, persisted]) {
          expect(usage.monthly[month]).toMatchObject({
            actions: 8,
            budibaseAICredits: 80,
            breakdown: { actions: { values: { aiAgent: 8 } } },
          })
        }
      })
    })

    it("does not hold the usage lock while executing nested quota operations", async () => {
      await config.doInTenant(async () => {
        await quotas.increment(
          MonthlyQuotaName.ACTIONS,
          QuotaUsageType.MONTHLY,
          {
            id: ActionType.AI_AGENT,
            fn: () =>
              quotas.increment(
                MonthlyQuotaName.ACTIONS,
                QuotaUsageType.MONTHLY,
                { id: ActionType.AUTOMATION_STEP }
              ),
          }
        )

        const usage = await db.quotas.getQuotaUsage()
        const month = db.quotas.utils.getCurrentMonthString()
        expect(usage.monthly[month]).toMatchObject({
          actions: 2,
          breakdown: { actions: { values: { aiAgent: 1, automationStep: 1 } } },
        })
      })
    })

    it("allows license refresh to reconcile usage before acquiring the update lock", async () => {
      const license = mocks.licenses.useUnlimited()
      jest
        .mocked(licensing.cache.getCachedLicense)
        .mockImplementationOnce(async () => {
          await db.quotas.setUsage(
            3,
            StaticQuotaName.CREATORS,
            QuotaUsageType.STATIC
          )
          return license
        })

      await config.doInTenant(async () => {
        await quotas.increment(MonthlyQuotaName.ACTIONS, QuotaUsageType.MONTHLY)
        const usage = await db.quotas.getQuotaUsage()
        expect(usage.usageQuota.creators).toBe(3)
        expect(
          usage.monthly[db.quotas.utils.getCurrentMonthString()].actions
        ).toBe(1)
      })
    })

    it("preserves updates from direct setters alongside action increments", async () => {
      await config.doInTenant(async () => {
        await Promise.all([
          db.quotas.setUsage(
            3,
            StaticQuotaName.CREATORS,
            QuotaUsageType.STATIC
          ),
          db.quotas.setUsagePerApp(
            { app_1: 4 },
            StaticQuotaName.ROWS,
            QuotaUsageType.STATIC
          ),
          quotas.increment(MonthlyQuotaName.ACTIONS, QuotaUsageType.MONTHLY),
        ])
        const usage = await db.quotas.getQuotaUsage()
        expect(usage.usageQuota).toMatchObject({ creators: 3, rows: 4 })
        expect(usage.apps?.app_1.usageQuota.rows).toBe(4)
        expect(
          usage.monthly[db.quotas.utils.getCurrentMonthString()].actions
        ).toBe(1)
      })
    })

    it("releases the usage lock after an update fails", async () => {
      await config.doInTenant(async () => {
        await expect(
          db.quotas.setAllUsage(async () => {
            throw new Error("Failed update")
          })
        ).rejects.toThrow("Failed update")
        await quotas.increment(MonthlyQuotaName.ACTIONS, QuotaUsageType.MONTHLY)
        const usage = await db.quotas.getCurrentUsageValues(
          QuotaUsageType.MONTHLY,
          MonthlyQuotaName.ACTIONS
        )
        expect(usage.total).toBe(1)
      })
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
