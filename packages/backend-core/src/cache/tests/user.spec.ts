import { User } from "@budibase/types"
import { generator, structures } from "../../../tests"
import { DBTestConfiguration } from "../../../tests/extra"
import { getUsers } from "../user"
import { getGlobalDB } from "../../context"
import _ from "lodash"

import * as redis from "../../redis/init"
import { UserDB } from "../../users"

const config = new DBTestConfiguration()

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

      expect(UserDB.bulkGet).toBeCalledTimes(1)
      expect(UserDB.bulkGet).toBeCalledWith(userIdsToRequest)
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

      expect(UserDB.bulkGet).toBeCalledTimes(1)
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

      expect(UserDB.bulkGet).toBeCalledTimes(1)
      expect(UserDB.bulkGet).toBeCalledWith([
        userIdsToRequest[1],
        userIdsToRequest[2],
        userIdsToRequest[4],
      ])
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
})
