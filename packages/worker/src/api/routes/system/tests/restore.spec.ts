import { TestConfiguration } from "../../../../tests"

describe("/api/system/restore", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/global/restore", () => {
    it("doesn't allow restore in cloud", async () => {
      const res = await config.api.restore.restored({ status: 405 })
      expect(res.body).toEqual({
        message: "This operation is not allowed in cloud.",
        status: 405,
      })
    })

    it("restores in self host", async () => {
      config.selfHosted()
      const res = await config.api.restore.restored()
      expect(res.body).toEqual({
        message: "System prepared after restore.",
      })
      config.cloudHosted()
    })
  })
})
