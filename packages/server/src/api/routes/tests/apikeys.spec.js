const setup = require("./utilities")
const { checkBuilderEndpoint } = require("./utilities/TestFunctions")

describe("/api/keys", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  describe("fetch", () => {
    it("should allow fetching", async () => {
      await setup.switchToSelfHosted(async () => {
        const res = await request
          .get(`/api/keys`)
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)
        expect(res.body).toBeDefined()
      })
    })

    it("should check authorization for builder", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/keys`,
      })
    })
  })

  describe("update", () => {
    it("should allow updating a value", async () => {
      await setup.switchToSelfHosted(async () => {
        const res = await request
          .put(`/api/keys/TEST`)
          .send({
            value: "test"
          })
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)
        expect(res.body._id).toBeDefined()
        expect(res.body._rev).toBeDefined()
      })
    })

    it("should check authorization for builder", async () => {
      await checkBuilderEndpoint({
        config,
        method: "PUT",
        url: `/api/keys/TEST`,
      })
    })
  })
})