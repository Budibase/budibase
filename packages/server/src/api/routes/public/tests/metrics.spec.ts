import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("/metrics", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  describe("get", () => {
    it("returns a list of metrics", async () => {
      const res = await config
        .request!.get(`/api/public/v1/metrics`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /text\/plain/)
        .expect(200)
      expect(res.text).toContain("budibase_tenant_user_count")
    })

    it("endpoint should not be publicly exposed", async () => {
      await config
        .request!.get(`/api/public/v1/metrics`)
        .set(config.publicHeaders())
        .expect(403)
    })
  })
})
