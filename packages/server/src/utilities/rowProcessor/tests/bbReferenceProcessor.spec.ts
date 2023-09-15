import * as backendCore from "@budibase/backend-core"
import { FieldSubtype, User } from "@budibase/types"
import { processInputBBReferences } from "../bbReferenceProcessor"
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
        const input = generator.guid()

        const userFromCache = structures.users.user()
        mockedCacheGetUser.mockResolvedValueOnce(userFromCache)

        const result = await processInputBBReferences(input, FieldSubtype.USER)

        expect(result).toEqual(input)
        expect(mockedCacheGetUser).toBeCalledTimes(1)
        expect(mockedCacheGetUser).toBeCalledWith(input)
      })

      it("throws an error given an invalid id", async () => {
        const input = generator.guid()

        await expect(
          processInputBBReferences(input, FieldSubtype.USER)
        ).rejects.toThrowError(new InvalidBBRefError(input, FieldSubtype.USER))
      })

      it("validates valid user ids as csv", async () => {
        const userIds: string[] = []
        for (let i = 0; i < 5; i++) {
          const userId = generator.guid()
          const user = structures.users.user({ _id: userId, userId })
          mockedCacheGetUser.mockResolvedValueOnce(user)
          userIds.push(userId)
        }

        const input = userIds.join(" ,  ")
        const result = await processInputBBReferences(input, FieldSubtype.USER)

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

        const input = [userId1, userId2, userId3].join(" ,  ")

        await expect(
          processInputBBReferences(input, FieldSubtype.USER)
        ).rejects.toThrowError(
          new InvalidBBRefError(userId3, FieldSubtype.USER)
        )
      })
    })
  })
})
