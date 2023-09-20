import _ from "lodash"
import * as backendCore from "@budibase/backend-core"
import { FieldSubtype, User } from "@budibase/types"
import {
  processInputBBReferences,
  processOutputBBReferences,
} from "../bbReferenceProcessor"
import {
  DBTestConfiguration,
  generator,
  structures,
} from "@budibase/backend-core/tests"
import { InvalidBBRefError } from "../errors"

jest.mock("@budibase/backend-core", (): typeof backendCore => {
  const actual: typeof backendCore = jest.requireActual(
    "@budibase/backend-core"
  )
  return {
    ...actual,
    cache: {
      ...actual.cache,
      user: {
        ...actual.cache.user,
        getUsers: jest.fn(actual.cache.user.getUsers),
      },
    },
  }
})

const config = new DBTestConfiguration()

describe("bbReferenceProcessor", () => {
  const cacheGetUsersSpy = backendCore.cache.user
    .getUsers as jest.MockedFunction<typeof backendCore.cache.user.getUsers>

  const users: User[] = []
  beforeAll(async () => {
    const userCount = 10
    const userIds = generator.arrayOf(() => generator.guid(), {
      min: userCount,
      max: userCount,
    })

    await config.doInTenant(async () => {
      const db = backendCore.context.getGlobalDB()
      for (const userId of userIds) {
        const user = structures.users.user({ _id: userId })
        await db.put(user)
        users.push(user)
      }
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("processInputBBReferences", () => {
    describe("subtype user", () => {
      it("validate valid string id", async () => {
        const user = _.sample(users)
        const userId = user!._id!

        const result = await config.doInTenant(() =>
          processInputBBReferences(userId, FieldSubtype.USER)
        )

        expect(result).toEqual(userId)
        expect(cacheGetUsersSpy).toBeCalledTimes(1)
        expect(cacheGetUsersSpy).toBeCalledWith([userId])
      })

      it("throws an error given an invalid id", async () => {
        const userId = generator.guid()

        await expect(
          config.doInTenant(() =>
            processInputBBReferences(userId, FieldSubtype.USER)
          )
        ).rejects.toThrowError(new InvalidBBRefError(userId, FieldSubtype.USER))
        expect(cacheGetUsersSpy).toBeCalledTimes(1)
        expect(cacheGetUsersSpy).toBeCalledWith([userId])
      })

      it("validates valid user ids as csv", async () => {
        const userIds = _.sampleSize(users, 5).map(x => x._id!)

        const userIdCsv = userIds.join(" ,  ")
        const result = await config.doInTenant(() =>
          processInputBBReferences(userIdCsv, FieldSubtype.USER)
        )

        expect(result).toEqual(userIds.join(","))
        expect(cacheGetUsersSpy).toBeCalledTimes(1)
        expect(cacheGetUsersSpy).toBeCalledWith(userIds)
      })

      it("throws an error given an invalid id in a csv", async () => {
        const expectedUsers = _.sampleSize(users, 2).map(x => x._id!)
        const wrongId = generator.guid()

        const userIdCsv = [expectedUsers[0], wrongId, expectedUsers[1]].join(
          " ,  "
        )

        await expect(
          config.doInTenant(() =>
            processInputBBReferences(userIdCsv, FieldSubtype.USER)
          )
        ).rejects.toThrowError(
          new InvalidBBRefError(wrongId, FieldSubtype.USER)
        )
      })

      it("validate valid user object", async () => {
        const userId = _.sample(users)!._id!

        const result = await config.doInTenant(() =>
          processInputBBReferences({ _id: userId }, FieldSubtype.USER)
        )

        expect(result).toEqual(userId)
        expect(cacheGetUsersSpy).toBeCalledTimes(1)
        expect(cacheGetUsersSpy).toBeCalledWith([userId])
      })

      it("validate valid user object array", async () => {
        const userIds = _.sampleSize(users, 3).map(x => x._id!)

        const result = await config.doInTenant(() =>
          processInputBBReferences(userIds, FieldSubtype.USER)
        )

        expect(result).toEqual(userIds.join(","))
        expect(cacheGetUsersSpy).toBeCalledTimes(1)
        expect(cacheGetUsersSpy).toBeCalledWith(userIds)
      })
    })
  })

  describe("processOutputBBReferences", () => {
    describe("subtype user", () => {
      it("fetches user given a valid string id", async () => {
        const userId = generator.guid()

        const userFromCache = structures.users.user()
        mockedCacheGetUser.mockResolvedValueOnce(userFromCache)

        const result = await processOutputBBReferences(
          userId,
          FieldSubtype.USER
        )

        expect(result).toEqual([userFromCache])
        expect(mockedCacheGetUser).toBeCalledTimes(1)
        expect(mockedCacheGetUser).toBeCalledWith(userId)
      })

      it("fetches user given a valid string id csv", async () => {
        const userId1 = generator.guid()
        const userId2 = generator.guid()

        const userFromCache1 = structures.users.user({ _id: userId1 })
        const userFromCache2 = structures.users.user({ _id: userId2 })
        mockedCacheGetUser.mockResolvedValueOnce(userFromCache1)
        mockedCacheGetUser.mockResolvedValueOnce(userFromCache2)

        const result = await processOutputBBReferences(
          [userId1, userId2].join(","),
          FieldSubtype.USER
        )

        expect(result).toEqual([userFromCache1, userFromCache2])
        expect(mockedCacheGetUser).toBeCalledTimes(2)
        expect(mockedCacheGetUser).toBeCalledWith(userId1)
        expect(mockedCacheGetUser).toBeCalledWith(userId2)
      })
    })
  })
})
