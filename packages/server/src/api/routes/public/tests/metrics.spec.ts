import * as setup from "../../tests/utilities"

describe("/metrics", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  // For some reason this cannot be a beforeAll or the test "should be able to update the user" fail
  beforeEach(async () => {
    await config.init()
  })

  describe("get", () => {
    it("returns a list of metrics", async () => {
      const res = await request
        .get(`/api/public/v1/metrics`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /text\/plain/)
        .expect(200)
      expect(res.text).toContain("budibase_tenant_user_count")
    })

    it("endpoint should not be publicly exposed", async () => {
      await request
        .get(`/api/public/v1/metrics`)
        .set(config.publicHeaders())
        .expect(403)
    })
  })
})
