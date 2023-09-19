import * as backendCore from "@budibase/backend-core"
import { FieldSubtype, User } from "@budibase/types"
import {
  processInputBBReferences,
  processOutputBBReferences,
} from "../bbReferenceProcessor"
import { generator, structures } from "@budibase/backend-core/tests"
import { InvalidBBRefError } from "../errors"

jest.mock("@budibase/backend-core", (): typeof backendCore => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    cache: {
      ...actual.cache,
      user: {
        getUser: jest.fn(),
        invalidateUser: jest.fn(),
      },
    },
  }
})

describe("bbReferenceProcessor", () => {
  const mockedCacheGetUser = backendCore.cache.user.getUser as jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("processInputBBReferences", () => {
    describe("subtype user", () => {
      it("validate valid string id", async () => {
        const userId = generator.guid()

        const userFromCache = structures.users.user()
        mockedCacheGetUser.mockResolvedValueOnce(userFromCache)

        const result = await processInputBBReferences(userId, FieldSubtype.USER)

        expect(result).toEqual(userId)
        expect(mockedCacheGetUser).toBeCalledTimes(1)
        expect(mockedCacheGetUser).toBeCalledWith(userId)
      })

      it("throws an error given an invalid id", async () => {
        const userId = generator.guid()

        mockedCacheGetUser.mockRejectedValue({
          status: 404,
          error: "not_found",
        })

        await expect(
          processInputBBReferences(userId, FieldSubtype.USER)
        ).rejects.toThrowError(new InvalidBBRefError(userId, FieldSubtype.USER))
      })

      it("validates valid user ids as csv", async () => {
        const userIds: string[] = []
        for (let i = 0; i < 5; i++) {
          const userId = generator.guid()
          const user = structures.users.user({ _id: userId })
          mockedCacheGetUser.mockResolvedValueOnce(user)
          userIds.push(userId)
        }

        const userIdCsv = userIds.join(" ,  ")
        const result = await processInputBBReferences(
          userIdCsv,
          FieldSubtype.USER
        )

        expect(result).toEqual(userIds.join(","))
        expect(mockedCacheGetUser).toBeCalledTimes(5)
        userIds.forEach(userId => {
          expect(mockedCacheGetUser).toBeCalledWith(userId)
        })
      })

      it("throws an error given an invalid id in a csv", async () => {
        const userId1 = generator.guid()
        const userId2 = generator.guid()
        const userId3 = generator.guid()
        mockedCacheGetUser.mockResolvedValueOnce(
          structures.users.user({ _id: userId1 })
        )
        mockedCacheGetUser.mockResolvedValueOnce(
          structures.users.user({ _id: userId2 })
        )

        const userIdCsv = [userId1, userId2, userId3].join(" ,  ")

        await expect(
          processInputBBReferences(userIdCsv, FieldSubtype.USER)
        ).rejects.toThrowError(
          new InvalidBBRefError(userId3, FieldSubtype.USER)
        )
      })

      it("validate valid user object", async () => {
        const userId = generator.guid()

        const userFromCache = structures.users.user()
        mockedCacheGetUser.mockResolvedValueOnce(userFromCache)

        const result = await processInputBBReferences(
          { _id: userId },
          FieldSubtype.USER
        )

        expect(result).toEqual(userId)
        expect(mockedCacheGetUser).toBeCalledTimes(1)
        expect(mockedCacheGetUser).toBeCalledWith(userId)
      })

      it("validate valid user object array", async () => {
        const users = Array.from({ length: 3 }, () => ({
          _id: generator.guid(),
        }))

        mockedCacheGetUser.mockResolvedValue(structures.users.user())

        const result = await processInputBBReferences(users, FieldSubtype.USER)

        expect(result).toEqual(users.map(x => x._id).join(","))
        expect(mockedCacheGetUser).toBeCalledTimes(3)
        for (const user of users) {
          expect(mockedCacheGetUser).toBeCalledWith(user._id)
        }
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
