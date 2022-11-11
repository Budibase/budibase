import { TestConfiguration } from "../../../../tests"

// TODO

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

  describe("POST /api/global/license/activate", () => {
    it("activates license", () => {})
  })

  describe("POST /api/global/license/refresh", () => {})

  describe("GET /api/global/license/info", () => {})

  describe("DELETE /api/global/license/info", () => {})

  describe("GET /api/global/license/usage", () => {})
})
