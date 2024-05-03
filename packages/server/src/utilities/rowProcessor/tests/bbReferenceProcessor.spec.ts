import _ from "lodash"
import * as backendCore from "@budibase/backend-core"
import { BBReferenceFieldSubType, FieldType, User } from "@budibase/types"
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
          processInputBBReferences(
            userId,
            FieldType.BB_REFERENCE,
            BBReferenceFieldSubType.USER
          )
        )

        expect(result).toEqual(userId)
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith([userId])
      })

      it("throws an error given an invalid id", async () => {
        const userId = generator.guid()

        await expect(
          config.doInTenant(() =>
            processInputBBReferences(
              userId,
              FieldType.BB_REFERENCE,
              BBReferenceFieldSubType.USER
            )
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
          processInputBBReferences(
            userIdCsv,
            FieldType.BB_REFERENCE,
            BBReferenceFieldSubType.USER
          )
        )

        expect(result).toEqual(userIds.join(","))
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
            processInputBBReferences(
              userIdCsv,
              FieldType.BB_REFERENCE,
              BBReferenceFieldSubType.USER
            )
          )
        ).rejects.toThrow(
          new InvalidBBRefError(wrongId, BBReferenceFieldSubType.USER)
        )
      })

      it("validate valid user object", async () => {
        const userId = _.sample(users)!._id!

        const result = await config.doInTenant(() =>
          processInputBBReferences(
            { _id: userId },
            FieldType.BB_REFERENCE,
            BBReferenceFieldSubType.USER
          )
        )

        expect(result).toEqual(userId)
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith([userId])
      })

      it("validate valid user object array", async () => {
        const userIds = _.sampleSize(users, 3).map(x => x._id!)

        const result = await config.doInTenant(() =>
          processInputBBReferences(
            userIds,
            FieldType.BB_REFERENCE,
            BBReferenceFieldSubType.USER
          )
        )

        expect(result).toEqual(userIds.join(","))
        expect(cacheGetUsersSpy).toHaveBeenCalledTimes(1)
        expect(cacheGetUsersSpy).toHaveBeenCalledWith(userIds)
      })

      it("empty strings will return null", async () => {
        const result = await config.doInTenant(() =>
          processInputBBReferences(
            "",
            FieldType.BB_REFERENCE,
            BBReferenceFieldSubType.USER
          )
        )

        expect(result).toEqual(null)
      })

      it("empty arrays will return null", async () => {
        const result = await config.doInTenant(() =>
          processInputBBReferences(
            [],
            FieldType.BB_REFERENCE,
            BBReferenceFieldSubType.USER
          )
        )

        expect(result).toEqual(null)
      })

      it("should convert user medata IDs to global IDs", async () => {
        const userId = _.sample(users)!._id!
        const userMetadataId = backendCore.db.generateUserMetadataID(userId)
        const result = await config.doInTenant(() =>
          processInputBBReferences(
            userMetadataId,
            FieldType.BB_REFERENCE,
            BBReferenceFieldSubType.USER
          )
        )
        expect(result).toBe(userId)
      })
    })
  })

  describe("processOutputBBReferences", () => {
    describe("subtype user", () => {
      it("fetches user given a valid string id", async () => {
        const user = _.sample(users)!
        const userId = user._id!

        const result = await config.doInTenant(() =>
          processOutputBBReferences(
            userId,
            FieldType.BB_REFERENCE,
            BBReferenceFieldSubType.USER
          )
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
            FieldType.BB_REFERENCE,
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
    })
  })
})
