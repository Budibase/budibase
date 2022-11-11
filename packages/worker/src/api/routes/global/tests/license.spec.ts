import { TestConfiguration, API } from "../../../../tests"

describe("/api/global/license", () => {
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

  describe("POST /api/global/license/activate", () => {})

  describe("POST /api/global/license/refresh", () => {})

  describe("GET /api/global/license/info", () => {})

  describe("DELETE /api/global/license/info", () => {})

  describe("GET /api/global/license/usage", () => {})
})
