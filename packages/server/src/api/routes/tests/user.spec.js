const { roles } = require("@budibase/backend-core")
const { checkPermissionsEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { BUILTIN_ROLE_IDS } = roles

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

  beforeEach(async () => {
    await config.init()
  })

  describe("fetch", () => {
    it("returns a list of users from an instance db", async () => {
      await config.createUser("uuidx")
      await config.createUser("uuidy")
      const res = await request
        .get(`/api/users/metadata`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toBe(3)
      expect(res.body.find(u => u._id === `ro_ta_users_us_uuidx`)).toBeDefined()
      expect(res.body.find(u => u._id === `ro_ta_users_us_uuidy`)).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await config.createUser()
      await checkPermissionsEndpoint({
        config,
        request,
        method: "GET",
        url: `/api/users/metadata`,
        passRole: BUILTIN_ROLE_IDS.ADMIN,
        failRole: BUILTIN_ROLE_IDS.PUBLIC,
      })
    })
  })

  describe("update", () => {
    it("should be able to update the user", async () => {
      const user = await config.createUser()
      user.roleId = BUILTIN_ROLE_IDS.BASIC
      const res = await request
        .put(`/api/users/metadata`)
        .set(config.defaultHeaders())
        .send(user)
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.ok).toEqual(true)
    })
  })

  describe("destroy", () => {
    it("should be able to delete the user", async () => {
      const user = await config.createUser()
      const res = await request
        .delete(`/api/users/metadata/${user._id}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.message).toBeDefined()
    })
  })

  describe("find", () => {
    it("should be able to find the user", async () => {
      const user = await config.createUser()
      const res = await request
        .get(`/api/users/metadata/${user._id}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body._id).toEqual(user._id)
      expect(res.body.roleId).toEqual(BUILTIN_ROLE_IDS.ADMIN)
      expect(res.body.tableId).toBeDefined()
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
      expect(res.body.message).toEqual("Must supply a 'flag' field in request body.")

    })

    it("should be able to set a flag on the user", async () => {
      await config.createUser()
      const res = await request
        .post(`/api/users/flags`)
        .set(config.defaultHeaders())
        .send({ value: "test", flag: "test" })
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.message).toEqual("Flag set successfully")
    })
  })

  describe("getFlags", () => {
    it("should get flags for a specific user", async () => {
      let flagData = { value: "test", flag: "test" }
      await config.createUser()
      await request
        .post(`/api/users/flags`)
        .set(config.defaultHeaders())
        .send(flagData)
        .expect(200)
        .expect("Content-Type", /json/)

      const res = await request
        .get(`/api/users/flags`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body[flagData.value]).toEqual(flagData.flag)
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
      expect(res.body.message).toEqual("Must supply a 'flag' field in request body.")

    })

    it("should be able to set a flag on the user", async () => {
      await config.createUser()
      const res = await request
        .post(`/api/users/flags`)
        .set(config.defaultHeaders())
        .send({ value: "test", flag: "test" })
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.message).toEqual("Flag set successfully")
    })
  })

  describe("syncUser", () => {
    it("should sync the user", async () => {
      let user = await config.createUser()
      await config.createApp('New App')
      let res = await request
        .post(`/api/users/metadata/sync/${user._id}`)
        .set(config.defaultHeaders())
        .expect(200)
        .expect("Content-Type", /json/)
      expect(res.body.message).toEqual('User synced.')
    })


    it("should sync the user when a previous user is specified", async () => {
      const app1 = await config.createApp('App 1')
      const app2 = await config.createApp('App 2')

      let user = await config.createUser(
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        true,
        { [app1.appId]: 'ADMIN' })
      let res = await request
        .post(`/api/users/metadata/sync/${user._id}`)
        .set(config.defaultHeaders())
        .send({ previousUser: { ...user, roles: { ...user.roles, [app2.appId]: 'BASIC' } } })
        .expect(200)
        .expect("Content-Type", /json/)

      expect(res.body.message).toEqual('User synced.')
    })
  })
})
