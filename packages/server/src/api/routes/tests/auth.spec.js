const setup = require("./utilities")

describe("/authenticate", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("authenticate", () => {
    it("should be able to create a layout", async () => {
      await config.createUser("test@test.com", "p4ssw0rd")
      const res = await request
        .post(`/api/authenticate`)
        .send({
          email: "test@test.com",
          password: "p4ssw0rd",
        })
        .set(config.publicHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.token).toBeDefined()
      expect(res.body.email).toEqual("test@test.com")
      expect(res.body.password).toBeUndefined()
    })

    it("should error if no app specified", async () => {
      await request
        .post(`/api/authenticate`)
        .expect(400)
    })

    it("should error if no email specified", async () => {
      await request
        .post(`/api/authenticate`)
        .send({
          password: "test",
        })
        .set(config.publicHeaders())
        .expect(400)
    })

    it("should error if no password specified", async () => {
      await request
        .post(`/api/authenticate`)
        .send({
          email: "test",
        })
        .set(config.publicHeaders())
        .expect(400)
    })

    it("should error if invalid user specified", async () => {
      await request
        .post(`/api/authenticate`)
        .send({
          email: "test",
          password: "test",
        })
        .set(config.publicHeaders())
        .expect(401)
    })

    it("should throw same error if wrong password specified", async () => {
      await config.createUser("test@test.com", "password")
      await request
        .post(`/api/authenticate`)
        .send({
          email: "test@test.com",
          password: "test",
        })
        .set(config.publicHeaders())
        .expect(401)
    })

    it("should throw an error for inactive users", async () => {
      await config.createUser("test@test.com", "password")
      await config.makeUserInactive("test@test.com")
      await request
        .post(`/api/authenticate`)
        .send({
          email: "test@test.com",
          password: "password",
        })
        .set(config.publicHeaders())
        .expect(401)
    })
  })

  describe("fetch self", () => {
    it("should be able to delete the layout", async () => {
      await config.createUser("test@test.com", "p4ssw0rd")
      const headers = await config.login("test@test.com", "p4ssw0rd")
      const res = await request
        .get(`/api/self`)
        .set(headers)
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.email).toEqual("test@test.com")
    })
  })
})