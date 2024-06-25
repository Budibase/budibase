import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"

describe("/api/keys", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  describe("fetch", () => {
    it("should allow fetching", async () => {
      await config.withEnv({ SELF_HOSTED: "true" }, async () => {
        const res = await config
          .request!.get(`/api/keys`)
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
      await config.withEnv({ SELF_HOSTED: "true" }, async () => {
        const res = await config
          .request!.put(`/api/keys/TEST`)
          .send({
            value: "test",
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
