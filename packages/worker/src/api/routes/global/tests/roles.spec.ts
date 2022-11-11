import { TestConfiguration, API } from "../../../../tests"

describe("/api/global/roles", () => {
  const config = new TestConfiguration()
  const api = new API(config)

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/global/roles", () => {})

  describe("GET /api/global/roles/:appId", () => {})

  describe("DELETE /api/global/roles/:appId", () => {})
})
