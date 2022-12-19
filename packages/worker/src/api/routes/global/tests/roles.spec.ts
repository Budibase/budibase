import { TestConfiguration } from "../../../../tests"

// TODO

describe("/api/global/roles", () => {
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

  describe("GET /api/global/roles", () => {
    it("retrieves roles", () => {})
  })

  describe("GET /api/global/roles/:appId", () => {})

  describe("DELETE /api/global/roles/:appId", () => {})
})
