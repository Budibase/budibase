import nock from "nock"
import { env, users } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import type { User } from "@budibase/types"
import { DBTestConfiguration, mocks } from "../../../../../tests"
import * as db from "../../../../db"
import * as quotas from "../../index"

jest.mock("../../../licensing/licenses/client")

describe("creator quota changes when saving users", () => {
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
    user = await config.doInTenant(() =>
      users.UserDB.save(
        structures.users.user({
          tenantId: config.getTenantId(),
          roles: {},
          builder: { creator: true },
        })
      )
    )
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it("allows demoting a creator when creator usage is at the limit", async () => {
    await config.doInTenant(async () => {
      await mocks.licenses.setCreatorsQuota(1)

      const saved = await users.UserDB.save({
        ...user,
        builder: { creator: false },
      })

      expect(saved.builder?.creator).toBe(false)
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 1, creators: 0 })
    })
  })

  it("allows demoting a creator when usage already exceeds the limit", async () => {
    await config.doInTenant(async () => {
      await mocks.licenses.setCreatorsQuota(0)

      await users.UserDB.save({ ...user, builder: { creator: false } })

      const saved = await users.UserDB.getUser(user._id!)
      expect(saved.builder?.creator).toBe(false)
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 1, creators: 0 })
    })
  })

  it("still rejects promotions when the creator quota is full", async () => {
    await config.doInTenant(async () => {
      const endUser = await users.UserDB.save(
        structures.users.user({
          tenantId: config.getTenantId(),
          roles: {},
        })
      )
      await mocks.licenses.setCreatorsQuota(1)

      await expect(
        users.UserDB.save({ ...endUser, builder: { creator: true } })
      ).rejects.toThrow("Usage limit exceeded: 'creators'")

      const saved = await users.UserDB.getUser(endUser._id!)
      expect(saved.builder?.creator).toBeUndefined()
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 2, creators: 1 })
    })
  })

  it("does not decrement creator usage if the user save fails", async () => {
    await config.doInTenant(async () => {
      await expect(
        users.UserDB.save({
          ...user,
          _rev: "1-stale",
          builder: { creator: false },
        })
      ).rejects.toBe("User exists already")

      const saved = await users.UserDB.getUser(user._id!)
      expect(saved.builder?.creator).toBe(true)
      const usage = await db.quotas.getQuotaUsage()
      expect(usage.usageQuota).toMatchObject({ users: 1, creators: 1 })
    })
  })
})
