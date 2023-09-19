import { User } from "@budibase/types"
import { cache, tenancy } from "../.."
import { generator, structures } from "../../../tests"
import { DBTestConfiguration } from "../../../tests/extra"
import { getUsers } from "../user"
import { getGlobalDB, getGlobalDBName } from "../../context"
import _ from "lodash"
import { getDB } from "../../db"
import type * as TenancyType from "../../tenancy"
import * as redis from "../../redis/init"

const config = new DBTestConfiguration()

// This mock is required to ensure that getTenantDB returns always as a singleton.
// This will allow us to spy on the db
const staticDb = getDB(getGlobalDBName(config.tenantId))
jest.mock("../../tenancy", (): typeof TenancyType => ({
  ...jest.requireActual("../../tenancy"),
  getTenantDB: jest.fn().mockImplementation(() => staticDb),
}))

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

      jest.spyOn(staticDb, "allDocs")

      const results = await getUsers(userIdsToRequest, config.tenantId)

      expect(results).toHaveLength(5)
      expect(results).toEqual(
        usersToRequest.map(u => ({
          ...u,
          budibaseAccess: true,
          _rev: expect.any(String),
        }))
      )

      expect(tenancy.getTenantDB).toBeCalledTimes(1)
      expect(tenancy.getTenantDB).toBeCalledWith(config.tenantId)
      expect(staticDb.allDocs).toBeCalledTimes(1)
      expect(staticDb.allDocs).toBeCalledWith({
        keys: userIdsToRequest,
        include_docs: true,
        limit: 5,
      })
    })

    it("on a second all, all of them are retrieved from cache", async () => {
      const usersToRequest = _.sampleSize(users, 5)

      const userIdsToRequest = usersToRequest.map(x => x._id!)

      jest.spyOn(staticDb, "allDocs")

      await getUsers(userIdsToRequest, config.tenantId)
      const resultsFromCache = await getUsers(userIdsToRequest, config.tenantId)

      expect(resultsFromCache).toHaveLength(5)
      expect(resultsFromCache).toEqual(
        expect.arrayContaining(
          usersToRequest.map(u => ({
            ...u,
            budibaseAccess: true,
            _rev: expect.any(String),
          }))
        )
      )

      expect(staticDb.allDocs).toBeCalledTimes(1)
    })

    it("when some users are cached, only the missing ones are retrieved from db", async () => {
      const usersToRequest = _.sampleSize(users, 5)

      const userIdsToRequest = usersToRequest.map(x => x._id!)

      jest.spyOn(staticDb, "allDocs")

      await getUsers(
        [userIdsToRequest[0], userIdsToRequest[3]],
        config.tenantId
      )
      ;(staticDb.allDocs as jest.Mock).mockClear()

      const results = await getUsers(userIdsToRequest, config.tenantId)

      expect(results).toHaveLength(5)
      expect(results).toEqual(
        expect.arrayContaining(
          usersToRequest.map(u => ({
            ...u,
            budibaseAccess: true,
            _rev: expect.any(String),
          }))
        )
      )

      expect(staticDb.allDocs).toBeCalledTimes(1)
      expect(staticDb.allDocs).toBeCalledWith({
        keys: [userIdsToRequest[1], userIdsToRequest[2], userIdsToRequest[4]],
        include_docs: true,
        limit: 3,
      })
    })
  })
})
