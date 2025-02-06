import _ from "lodash"
import * as backendCore from "@budibase/backend-core"
import { BBReferenceFieldSubType, User } from "@budibase/types"
import {
  processInputBBReference,
  processInputBBReferences,
  processOutputBBReference,
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
        getUser: jest.fn(actual.cache.user.getUser),
        getUsers: jest.fn(actual.cache.user.getUsers),
      },
    },
  }
})

const config = new DBTestConfiguration()

describe("bbReferenceProcessor", () => {
  const cacheGetUserSpy = backendCore.cache.user.getUser as jest.MockedFunction<
    typeof backendCore.cache.user.getUser
  >
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

  describe("processInputBBReference", () => {
    describe("subtype user", () => {
      it("validate valid string id", async () => {
        const user = _.sample(users)
        const userId = user!._id!

        const result = await config.doInTenant(() =>
          processInputBBReference(userId, BBReferenceFieldSubType.USER)
        )

        expect(result).toEqual(userId)
        expect(cacheGetUserSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUserSpy).toHaveBeenCalledWith({
          userId,
        })
      })

      it("throws an error given an invalid id", async () => {
        const userId = generator.guid()

        await expect(
          config.doInTenant(() =>
            processInputBBReference(userId, BBReferenceFieldSubType.USER)
          )
        ).rejects.toThrow(
          new InvalidBBRefError(userId, BBReferenceFieldSubType.USER)
        )
      })

      it("validate valid user object", async () => {
        const userId = _.sample(users)!._id!

        const result = await config.doInTenant(() =>
          processInputBBReference({ _id: userId }, BBReferenceFieldSubType.USER)
        )

        expect(result).toEqual(userId)
        expect(cacheGetUserSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUserSpy).toHaveBeenCalledWith({
          userId,
        })
      })

      it("empty strings will return null", async () => {
        const result = await config.doInTenant(() =>
          processInputBBReference("", BBReferenceFieldSubType.USER)
        )

        expect(result).toEqual(null)
      })

      it("should convert user medata IDs to global IDs", async () => {
        const userId = _.sample(users)!._id!
        const userMetadataId = backendCore.db.generateUserMetadataID(userId)
        const result = await config.doInTenant(() =>
          processInputBBReference(userMetadataId, BBReferenceFieldSubType.USER)
        )
        expect(result).toBe(userId)
      })
    })
  })

  describe("processInputBBReferences", () => {
    describe("subtype user", () => {
      it("validate valid string id", async () => {
        const user = _.sample(users)
        const userId = user!._id!

        const result = await config.doInTenant(() =>
          processInputBBReferences(userId, BBReferenceFieldSubType.USER)
        )

        expect(result).toEqual([userId])
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith([userId])
      })

      it("throws an error given an invalid id", async () => {
        const userId = generator.guid()

        await expect(
          config.doInTenant(() =>
            processInputBBReferences(userId, BBReferenceFieldSubType.USER)
          )
        ).rejects.toThrow(
          new InvalidBBRefError(userId, BBReferenceFieldSubType.USER)
        )
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith([userId])
      })

      it("validates valid user ids as csv", async () => {
        const userIds = _.sampleSize(users, 5).map(x => x._id!)

        const userIdCsv = userIds.join(" ,  ")
        const result = await config.doInTenant(() =>
          processInputBBReferences(userIdCsv, BBReferenceFieldSubType.USER)
        )

        expect(result).toEqual(userIds)
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith(userIds)
      })

      it("throws an error given an invalid id in a csv", async () => {
        const expectedUserIds = _.sampleSize(users, 2).map(x => x._id!)
        const wrongId = generator.guid()

        const userIdCsv = [
          expectedUserIds[0],
          wrongId,
          expectedUserIds[1],
        ].join(" ,  ")

        await expect(
          config.doInTenant(() =>
            processInputBBReferences(userIdCsv, BBReferenceFieldSubType.USER)
          )
        ).rejects.toThrow(
          new InvalidBBRefError(wrongId, BBReferenceFieldSubType.USER)
        )
      })

      it("validate valid user object array", async () => {
        const inputUsers = _.sampleSize(users, 3).map(u => ({ _id: u._id! }))
        const userIds = inputUsers.map(u => u._id)

        const result = await config.doInTenant(() =>
          processInputBBReferences(inputUsers, BBReferenceFieldSubType.USER)
        )

        expect(result).toEqual(userIds)
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith(userIds)
      })

      it("empty strings will return null", async () => {
        const result = await config.doInTenant(() =>
          processInputBBReferences(
            "",

            BBReferenceFieldSubType.USER
          )
        )

        expect(result).toEqual(null)
      })

      it("empty arrays will return null", async () => {
        const result = await config.doInTenant(() =>
          processInputBBReferences([], BBReferenceFieldSubType.USER)
        )

        expect(result).toEqual(null)
      })

      it("should convert user medata IDs to global IDs", async () => {
        const userId = _.sample(users)!._id!
        const userMetadataId = backendCore.db.generateUserMetadataID(userId)
        const result = await config.doInTenant(() =>
          processInputBBReferences(userMetadataId, BBReferenceFieldSubType.USER)
        )
        expect(result).toEqual([userId])
      })
    })
  })

  describe("processOutputBBReference", () => {
    describe("subtype user", () => {
      it("fetches user given a valid string id", async () => {
        const user = _.sample(users)!
        const userId = user._id!

        const result = await config.doInTenant(() =>
          processOutputBBReference(userId, BBReferenceFieldSubType.USER)
        )

        expect(result).toEqual({
          _id: user._id,
          primaryDisplay: user.email,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        })
        expect(cacheGetUserSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUserSpy).toHaveBeenCalledWith({
          userId,
        })
      })

      it("returns undefined given an unexisting user", async () => {
        const userId = generator.guid()

        const result = await config.doInTenant(() =>
          processOutputBBReference(userId, BBReferenceFieldSubType.USER)
        )

        expect(result).toBeUndefined()
        expect(cacheGetUserSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUserSpy).toHaveBeenCalledWith({
          userId,
        })
      })
    })
  })

  describe("processOutputBBReferences", () => {
    describe("subtype user", () => {
      it("fetches user given a valid string id", async () => {
        const user = _.sample(users)!
        const userId = user._id!

        const result = await config.doInTenant(() =>
          processOutputBBReferences(userId, BBReferenceFieldSubType.USER)
        )

        expect(result).toEqual([
          {
            _id: user._id,
            primaryDisplay: user.email,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        ])
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith([userId])
      })

      it("fetches user given a valid string id csv", async () => {
        const [user1, user2] = _.sampleSize(users, 2)
        const userId1 = user1._id!
        const userId2 = user2._id!

        const result = await config.doInTenant(() =>
          processOutputBBReferences(
            [userId1, userId2].join(","),
            BBReferenceFieldSubType.USER
          )
        )

        expect(result).toHaveLength(2)
        expect(result).toEqual(
          expect.arrayContaining(
            [user1, user2].map(u => ({
              _id: u._id,
              primaryDisplay: u.email,
              email: u.email,
              firstName: u.firstName,
              lastName: u.lastName,
            }))
          )
        )
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith([userId1, userId2])
      })

      it("trims unexisting users user given a valid string id csv", async () => {
        const [user1, user2] = _.sampleSize(users, 2)
        const userId1 = user1._id!
        const userId2 = user2._id!

        const unexistingUserId1 = generator.guid()
        const unexistingUserId2 = generator.guid()

        const input = [
          unexistingUserId1,
          userId1,
          unexistingUserId2,
          userId2,
        ].join(",")

        const result = await config.doInTenant(() =>
          processOutputBBReferences(input, BBReferenceFieldSubType.USER)
        )

        expect(result).toHaveLength(2)
        expect(result).toEqual(
          expect.arrayContaining(
            [user1, user2].map(u => ({
              _id: u._id,
              primaryDisplay: u.email,
              email: u.email,
              firstName: u.firstName,
              lastName: u.lastName,
            }))
          )
        )
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith([
          unexistingUserId1,
          userId1,
          unexistingUserId2,
          userId2,
        ])
      })
    })
  })
})
