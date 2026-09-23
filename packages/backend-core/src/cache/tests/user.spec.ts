import { User } from "@budibase/types"
import { generator, structures } from "../../../tests"
import { DBTestConfiguration } from "../../../tests/extra"
import { getUser, getUsers } from "../user"
import { getGlobalDB } from "../../context"
import _ from "lodash"

import * as accounts from "../../accounts"
import { withEnv } from "../../environment"
import * as redis from "../../redis/init"
import { UserDB } from "../../users"

const config = new DBTestConfiguration()

const withAccountPortal = <T>(f: () => Promise<T>) =>
  withEnv({ SELF_HOSTED: false, DISABLE_ACCOUNT_PORTAL: "" }, f)

describe("user cache", () => {
  describe("getUsers", () => {
    const users: User[] = []
    beforeAll(async () => {
      const userCount = 10
      const userIds = generator.arrayOf(() => generator.guid(), {
        min: userCount,
        max: userCount,
      })

      await config.doInTenant(async () => {
        const db = getGlobalDB()
        for (const userId of userIds) {
          const user = structures.users.user({ _id: userId })
          await db.put(user)
          users.push(user)
        }
      })
    })

    beforeEach(async () => {
      jest.clearAllMocks()

      const redisClient = await redis.getUserClient()
      await redisClient.clear()
    })

    it("when no user is in cache, all of them are retrieved from db", async () => {
      const usersToRequest = _.sampleSize(users, 5)

      const userIdsToRequest = usersToRequest.map(x => x._id!)

      jest.spyOn(UserDB, "bulkGet")

      const results = await config.doInTenant(() => getUsers(userIdsToRequest))

      expect(results.users).toHaveLength(5)
      expect(results).toEqual({
        users: usersToRequest.map(u => ({
          ...u,
          budibaseAccess: true,
          _rev: expect.any(String),
        })),
      })

      expect(UserDB.bulkGet).toHaveBeenCalledTimes(1)
      expect(UserDB.bulkGet).toHaveBeenCalledWith(userIdsToRequest)
    })

    it("on a second all, all of them are retrieved from cache", async () => {
      const usersToRequest = _.sampleSize(users, 5)

      const userIdsToRequest = usersToRequest.map(x => x._id!)

      jest.spyOn(UserDB, "bulkGet")

      await config.doInTenant(() => getUsers(userIdsToRequest))
      const resultsFromCache = await config.doInTenant(() =>
        getUsers(userIdsToRequest)
      )

      expect(resultsFromCache.users).toHaveLength(5)
      expect(resultsFromCache).toEqual({
        users: expect.arrayContaining(
          usersToRequest.map(u => ({
            ...u,
            budibaseAccess: true,
            _rev: expect.any(String),
          }))
        ),
      })

      expect(UserDB.bulkGet).toHaveBeenCalledTimes(1)
    })

    it("when some users are cached, only the missing ones are retrieved from db", async () => {
      const usersToRequest = _.sampleSize(users, 5)

      const userIdsToRequest = usersToRequest.map(x => x._id!)

      jest.spyOn(UserDB, "bulkGet")

      await config.doInTenant(() =>
        getUsers([userIdsToRequest[0], userIdsToRequest[3]])
      )
      ;(UserDB.bulkGet as jest.Mock).mockClear()

      const results = await config.doInTenant(() => getUsers(userIdsToRequest))

      expect(results.users).toHaveLength(5)
      expect(results).toEqual({
        users: expect.arrayContaining(
          usersToRequest.map(u => ({
            ...u,
            budibaseAccess: true,
            _rev: expect.any(String),
          }))
        ),
      })

      expect(UserDB.bulkGet).toHaveBeenCalledTimes(1)
      expect(UserDB.bulkGet).toHaveBeenCalledWith([
        userIdsToRequest[1],
        userIdsToRequest[2],
        userIdsToRequest[4],
      ])
    })

    describe("account portal", () => {
      afterEach(() => {
        jest.restoreAllMocks()
      })

      it("a single failing account lookup does not fail the whole batch", async () => {
        const usersToRequest = _.sampleSize(users, 3)
        const userIdsToRequest = usersToRequest.map(x => x._id!)
        const failingUser = usersToRequest[1]
        const account = structures.accounts.cloudAccount()

        jest
          .spyOn(accounts, "getAccount")
          .mockImplementation(async (email: string) => {
            if (email === failingUser.email) {
              throw new Error(`Error getting account by email ${email}`)
            }
            return account
          })

        const results = await withAccountPortal(() =>
          config.doInTenant(() => getUsers(userIdsToRequest))
        )

        expect(results.users).toHaveLength(3)
        expect(_.sortBy(results.users, "_id")).toEqual(
          _.sortBy(
            usersToRequest.map(u => ({
              ...u,
              budibaseAccess: true,
              _rev: expect.any(String),
              ...(u._id === failingUser._id
                ? {}
                : { account, accountPortalAccess: true }),
            })),
            "_id"
          )
        )
      })

      it("a user with a failed account lookup is not cached", async () => {
        const usersToRequest = _.sampleSize(users, 3)
        const userIdsToRequest = usersToRequest.map(x => x._id!)
        const failingUser = usersToRequest[1]
        const account = structures.accounts.cloudAccount()

        const getAccountSpy = jest
          .spyOn(accounts, "getAccount")
          .mockImplementation(async (email: string) => {
            if (email === failingUser.email) {
              throw new Error(`Error getting account by email ${email}`)
            }
            return account
          })

        await withAccountPortal(() =>
          config.doInTenant(() => getUsers(userIdsToRequest))
        )

        getAccountSpy.mockResolvedValue(account)
        jest.spyOn(UserDB, "bulkGet")

        const results = await withAccountPortal(() =>
          config.doInTenant(() => getUsers(userIdsToRequest))
        )

        expect(UserDB.bulkGet).toHaveBeenCalledTimes(1)
        expect(UserDB.bulkGet).toHaveBeenCalledWith([failingUser._id])
        expect(results.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: failingUser._id,
              account,
              accountPortalAccess: true,
            }),
          ])
        )
      })
    })

    it("requesting existing and unexisting ids will return found ones", async () => {
      const usersToRequest = _.sampleSize(users, 3)
      const missingIds = [generator.guid(), generator.guid()]

      const userIdsToRequest = _.shuffle([
        ...missingIds,
        ...usersToRequest.map(x => x._id!),
      ])

      const results = await config.doInTenant(() => getUsers(userIdsToRequest))

      expect(results.users).toHaveLength(3)
      expect(results).toEqual({
        users: expect.arrayContaining(
          usersToRequest.map(u => ({
            ...u,
            budibaseAccess: true,
            _rev: expect.any(String),
          }))
        ),
        notFoundIds: expect.arrayContaining(missingIds),
      })
    })
  })

  describe("getUser", () => {
    let user: User

    beforeAll(async () => {
      await config.doInTenant(async () => {
        user = structures.users.user({ _id: generator.guid() })
        await getGlobalDB().put(user)
      })
    })

    beforeEach(async () => {
      jest.restoreAllMocks()

      const redisClient = await redis.getUserClient()
      await redisClient.clear()
    })

    it("a failing account lookup does not fail the lookup", async () => {
      jest
        .spyOn(accounts, "getAccount")
        .mockRejectedValue(new Error("account portal is down"))

      const result = await withAccountPortal(() =>
        config.doInTenant(() => getUser({ userId: user._id! }))
      )

      expect(result).toEqual({
        ...user,
        budibaseAccess: true,
        _rev: expect.any(String),
      })
    })

    it("a user with a failed account lookup is not cached", async () => {
      const account = structures.accounts.cloudAccount()
      const getAccountSpy = jest
        .spyOn(accounts, "getAccount")
        .mockRejectedValue(new Error("account portal is down"))

      await withAccountPortal(() =>
        config.doInTenant(() => getUser({ userId: user._id! }))
      )

      getAccountSpy.mockResolvedValue(account)

      const result = await withAccountPortal(() =>
        config.doInTenant(() => getUser({ userId: user._id! }))
      )

      expect(result).toEqual(
        expect.objectContaining({ account, accountPortalAccess: true })
      )
    })
  })
})
