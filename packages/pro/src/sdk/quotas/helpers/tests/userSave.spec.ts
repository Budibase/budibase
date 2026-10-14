import nock from "nock"
import { context, env, users } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import type { User, UserGroup } from "@budibase/types"
import { DBTestConfiguration, generator, mocks } from "../../../../../tests"
import * as db from "../../../../db"
import * as licensing from "../../../licensing"
import * as quotas from "../../index"

jest.mock("../../../licensing/licenses/client")
jest.mock("../../../../db/quotas/quotas", () => {
  const actual = jest.requireActual<
    typeof import("../../../../db/quotas/quotas")
  >("../../../../db/quotas/quotas")
  return { ...actual, setAllUsage: jest.fn(actual.setAllUsage) }
})

describe("User save quotas", () => {
  const config = new DBTestConfiguration()
  let user: User

  beforeAll(() => {
    users.UserDB.init(
      quotas,
      {
        addUsers: jest.fn(),
        getBulk: jest.fn(),
        getGroupBuilderAppIds: jest.fn(),
      },
      { isSSOEnforced: jest.fn().mockResolvedValue(false) }
    )
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    mocks.licenses.useUnlimited()
    config.newTenant()
    nock(env.INTERNAL_ACCOUNT_PORTAL_URL)
      .persist()
      .post("/api/accounts/search")
      .reply(200, [])
    await config.doInTenant(async () => {
      const group: UserGroup = {
        ...structures.userGroups.userGroup(),
        _id: `gr_${generator.guid()}`,
        roles: { app_example: "CREATOR" },
      }
      await context.getGlobalDB().put(group)
      user = await users.UserDB.save(
        structures.users.user({
          tenantId: config.getTenantId(),
          userGroups: [group._id!],
        })
      )
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it("decrements creator usage when a creator group is removed", async () => {
    await config.doInTenant(async () => {
      const saved = await users.UserDB.save({ ...user, userGroups: [] })

      expect(saved.userGroups).toEqual([])
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 1, creators: 0 })
    })
  })

  it("does not persist a demotion when the quota check fails", async () => {
    await config.doInTenant(async () => {
      jest
        .mocked(licensing.cache.getCachedLicense)
        .mockRejectedValueOnce(new Error("Quota check failed"))

      await expect(
        users.UserDB.save({ ...user, userGroups: [] })
      ).rejects.toThrow("Quota check failed")

      const persistedUser = await users.UserDB.getUser(user._id!)
      expect(persistedUser).toMatchObject({
        _rev: user._rev,
        userGroups: user.userGroups,
      })
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 1, creators: 1 })
    })
  })

  it("allows demotion while creator usage exceeds the quota", async () => {
    await config.doInTenant(async () => {
      await users.UserDB.save(
        structures.users.user({
          tenantId: config.getTenantId(),
          userGroups: user.userGroups,
        })
      )
      await mocks.licenses.setCreatorsQuota(0)

      const saved = await users.UserDB.save({ ...user, userGroups: [] })

      expect(saved.userGroups).toEqual([])
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 2, creators: 1 })
    })
  })

  it("does not decrement creator usage when the save fails", async () => {
    await config.doInTenant(async () => {
      await expect(
        users.UserDB.save({ ...user, _rev: "1-stale", userGroups: [] })
      ).rejects.toBe("User exists already")

      const persistedUser = await users.UserDB.getUser(user._id!)
      expect(persistedUser).toMatchObject({
        _rev: user._rev,
        userGroups: user.userGroups,
      })
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 1, creators: 1 })
    })
  })

  const failQuotaWriteDuringDemotion = async () => {
    jest
      .mocked(db.quotas.setAllUsage)
      .mockRejectedValueOnce(new Error("Quota write failed"))

    await expect(
      users.UserDB.save({ ...user, userGroups: [] })
    ).rejects.toThrow("Quota write failed")
  }

  it("persists the demotion when the subsequent quota write fails", async () => {
    await config.doInTenant(async () => {
      await failQuotaWriteDuringDemotion()

      const persistedUser = await users.UserDB.getUser(user._id!)
      expect(persistedUser.userGroups).toEqual([])
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 1, creators: 1 })
    })
  })

  it("leaves creator usage stale when retrying an already persisted demotion", async () => {
    await config.doInTenant(async () => {
      await failQuotaWriteDuringDemotion()

      const persistedUser = await users.UserDB.getUser(user._id!)
      await users.UserDB.save({ ...persistedUser, userGroups: [] })

      const retriedUser = await users.UserDB.getUser(user._id!)
      expect(retriedUser.userGroups).toEqual([])
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 1, creators: 1 })
    })
  })

  it("reconciles stale creator usage on the next creator membership change", async () => {
    await config.doInTenant(async () => {
      const otherCreator = await users.UserDB.save(
        structures.users.user({
          tenantId: config.getTenantId(),
          userGroups: user.userGroups,
        })
      )
      await failQuotaWriteDuringDemotion()

      await users.UserDB.save({ ...otherCreator, userGroups: [] })

      const persistedUser = await users.UserDB.getUser(user._id!)
      expect(persistedUser.userGroups).toEqual([])
      const persistedOtherCreator = await users.UserDB.getUser(
        otherCreator._id!
      )
      expect(persistedOtherCreator.userGroups).toEqual([])
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 2, creators: 0 })
    })
  })
})
