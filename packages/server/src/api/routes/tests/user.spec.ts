import { roles, utils } from "@budibase/backend-core"
import { checkPermissionsEndpoint } from "./utilities/TestFunctions"
import * as setup from "./utilities"
import { UserMetadata } from "@budibase/types"

jest.mock("../../../utilities/workerRequests", () => ({
  getGlobalUsers: jest.fn(() => {
    return {}
  }),
  getGlobalSelf: jest.fn(() => {
    return {}
  }),
  deleteGlobalUser: jest.fn(),
}))

describe("/users", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  describe("fetch", () => {
    it("returns a list of users from an instance db", async () => {
      const id1 = `us_${utils.newid()}`
      const id2 = `us_${utils.newid()}`
      await config.createUser({ _id: id1 })
      await config.createUser({ _id: id2 })

      const res = await config.api.user.fetch()
      expect(res.length).toBe(3)

      const ids = res.map(u => u._id)
      expect(ids).toContain(`ro_ta_users_${id1}`)
      expect(ids).toContain(`ro_ta_users_${id2}`)
    })

    it("should apply authorization to endpoint", async () => {
      await config.createUser()
      await checkPermissionsEndpoint({
        config,
        request,
        method: "GET",
        url: `/api/users/metadata`,
        passRole: roles.BUILTIN_ROLE_IDS.ADMIN,
        failRole: roles.BUILTIN_ROLE_IDS.PUBLIC,
      })
    })
  })

  describe("update", () => {
    it("should be able to update the user", async () => {
      const user: UserMetadata = await config.createUser({
        _id: `us_update${utils.newid()}`,
      })
      user.roleId = roles.BUILTIN_ROLE_IDS.BASIC
      delete user._rev
      const res = await config.api.user.update(user)
      expect(res.ok).toEqual(true)
    })

    it("should be able to update the user multiple times", async () => {
      const user = await config.createUser()
      delete user._rev

      const res1 = await config.api.user.update({
        ...user,
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
      })
      const res2 = await config.api.user.update({
        ...user,
        _rev: res1.rev,
        roleId: roles.BUILTIN_ROLE_IDS.POWER,
      })
      expect(res2.ok).toEqual(true)
    })

    it("should require the _rev field for multiple updates", async () => {
      const user = await config.createUser()
      delete user._rev

      await config.api.user.update({
        ...user,
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
      })
      await config.api.user.update(
        { ...user, roleId: roles.BUILTIN_ROLE_IDS.POWER },
        { status: 409 }
      )
    })
  })

  describe("destroy", () => {
    it("should be able to delete the user", async () => {
      const user = await config.createUser()
      const res = await config.api.user.destroy(user._id!)
      expect(res.message).toBeDefined()
    })
  })

  describe("find", () => {
    it("should be able to find the user", async () => {
      const user = await config.createUser()
      const res = await config.api.user.find(user._id!)
      expect(res._id).toEqual(user._id)
      expect(res.roleId).toEqual(roles.BUILTIN_ROLE_IDS.ADMIN)
      expect(res.tableId).toBeDefined()
    })
  })

  describe("setFlag", () => {
    it("should throw an error if a flag is not provided", async () => {
      await config.createUser()
      const res = await request
        .post(`/api/users/flags`)
        .set(config.defaultHeaders())
        .send({ value: "test" })
        .expect(400)
        .expect("Content-Type", /json/)
      expect(res.body.message).toEqual(
        "Must supply a 'flag' field in request body."
      )
    })

    it("should be able to set a flag on the user", async () => {
      await config.createUser()
      const res = await config.api.user.setFlag("test", true)
      expect(res.message).toEqual("Flag set successfully")
    })
  })

  describe("getFlags", () => {
    it("should get flags for a specific user", async () => {
      await config.createUser()
      await config.api.user.setFlag("test", "test")

      const res = await config.api.user.getFlags()
      expect(res.test).toEqual("test")
    })
  })
})
