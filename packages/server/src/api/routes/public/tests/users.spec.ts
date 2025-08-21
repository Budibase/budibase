import * as setup from "../../tests/utilities"
import { User } from "@budibase/types"
import { generator, mocks } from "@budibase/backend-core/tests"
import nock from "nock"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { mockWorkerUserAPI } from "./utils"

describe("public users API", () => {
  const config = new TestConfiguration()
  let globalUser: User

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  beforeEach(async () => {
    globalUser = await config.globalUser()

    nock.cleanAll()
    mockWorkerUserAPI(globalUser)
  })

  describe("read", () => {
    it("should allow a user to read themselves", async () => {
      const user = await config.api.user.find(globalUser._id!)
      expect(user._id).toBe(globalUser._id)
    })

    it("should allow a user to read another user", async () => {
      const otherUser = await config.api.public.user.create({
        email: generator.email({ domain: "example.com" }),
        roles: {},
      })
      const user = await config.withUser(globalUser, () =>
        config.api.public.user.find(otherUser._id!)
      )
      expect(user._id).toBe(otherUser._id)
    })
  })

  describe("create", () => {
    it("can successfully create a new user", async () => {
      const email = generator.email({ domain: "example.com" })
      const newUser = await config.api.public.user.create({
        email,
        roles: {},
      })
      expect(newUser.email).toBe(email)
      expect(newUser._id).toBeDefined()
    })

    describe("role creation on free tier", () => {
      it("should not allow 'roles' to be updated", async () => {
        const newUser = await config.api.public.user.create({
          email: generator.email({ domain: "example.com" }),
          roles: { app_a: "BASIC" },
        })
        expect(newUser.roles["app_a"]).toBeUndefined()
      })

      it("should not allow 'admin' to be updated", async () => {
        const newUser = await config.api.public.user.create({
          email: generator.email({ domain: "example.com" }),
          roles: {},
          admin: { global: true },
        })
        expect(newUser.admin).toBeUndefined()
      })

      it("should not allow 'builder' to be updated", async () => {
        const newUser = await config.api.public.user.create({
          email: generator.email({ domain: "example.com" }),
          roles: {},
          builder: { global: true },
        })
        expect(newUser.builder).toBeUndefined()
      })
    })

    describe("role creation on business tier", () => {
      beforeAll(() => {
        mocks.licenses.useExpandedPublicApi()
      })

      it("should allow 'roles' to be updated", async () => {
        const newUser = await config.api.public.user.create({
          email: generator.email({ domain: "example.com" }),
          roles: { app_a: "BASIC" },
        })
        expect(newUser.roles["app_a"]).toBe("BASIC")
      })

      it("should allow 'admin' to be updated", async () => {
        const newUser = await config.api.public.user.create({
          email: generator.email({ domain: "example.com" }),
          roles: {},
          admin: { global: true },
        })
        expect(newUser.admin?.global).toBe(true)
      })

      it("should allow 'builder' to be updated", async () => {
        const newUser = await config.api.public.user.create({
          email: generator.email({ domain: "example.com" }),
          roles: {},
          builder: { global: true },
        })
        expect(newUser.builder?.global).toBe(true)
      })
    })
  })

  describe("update", () => {
    it("can update a user", async () => {
      const updatedUser = await config.api.public.user.update({
        ...globalUser,
        email: `updated-${globalUser.email}`,
      })
      expect(updatedUser.email).toBe(`updated-${globalUser.email}`)
    })

    it("should not allow a user to update their own roles", async () => {
      await config.withUser(globalUser, () =>
        config.api.public.user.update({
          ...globalUser,
          roles: { app_1: "ADMIN" },
        })
      )
      const updatedUser = await config.api.user.find(globalUser._id!)
      expect(updatedUser.roles?.app_1).toBeUndefined()
    })
  })

  describe("delete", () => {
    it("should not allow a user to delete themselves", async () => {
      await config.withUser(globalUser, () =>
        config.api.public.user.destroy(globalUser._id!, { status: 405 })
      )
    })
  })
})
