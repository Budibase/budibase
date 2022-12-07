import { TestConfiguration } from "../../../../tests"

describe("/api/global/license", () => {
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

  describe("POST /api/global/license/activate", () => {})

  describe("POST /api/global/license/refresh", () => {})

  describe("GET /api/global/license/info", () => {})

  describe("DELETE /api/global/license/info", () => {})

  describe("GET /api/global/license/usage", () => {})
})
