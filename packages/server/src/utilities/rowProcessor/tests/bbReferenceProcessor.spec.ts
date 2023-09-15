import * as backendCore from "@budibase/backend-core"
import { FieldSubtype, User } from "@budibase/types"
import { processInputBBReferences } from "../bbReferenceProcessor"
import { generator, structures } from "@budibase/backend-core/tests"

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
      it("fetches by user id", async () => {
        const input = generator.guid()

        const userFromCache = structures.users.user()
        mockedCacheGetUser.mockResolvedValueOnce(userFromCache)

        const result = await processInputBBReferences(input, FieldSubtype.USER)

        expect(result).toEqual(userFromCache)
        expect(mockedCacheGetUser).toBeCalledTimes(1)
        expect(mockedCacheGetUser).toBeCalledWith(input)
      })

      it("fetches by user id when send as csv", async () => {
        const users: Record<string, User> = {}
        for (let i = 0; i < 5; i++) {
          const userId = generator.guid()
          const user = structures.users.user({ _id: userId, userId })
          mockedCacheGetUser.mockResolvedValueOnce(user)
          users[userId] = user
        }

        const input = Object.keys(users).join(" ,  ")
        const result = await processInputBBReferences(input, FieldSubtype.USER)

        expect(result).toEqual(Object.values(users))
        expect(mockedCacheGetUser).toBeCalledTimes(5)
        Object.keys(users).forEach(userId => {
          expect(mockedCacheGetUser).toBeCalledWith(userId)
        })
      })
    })
  })
})
