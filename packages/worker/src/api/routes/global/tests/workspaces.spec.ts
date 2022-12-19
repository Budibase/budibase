import { TestConfiguration } from "../../../../tests"

// TODO

describe("/api/global/workspaces", () => {
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

  describe("GET /api/global/workspaces", () => {
    it("retrieves workspaces", () => {})
  })

  describe("DELETE /api/global/workspaces/:id", () => {})

  describe("GET /api/global/workspaces", () => {})

  describe("GET /api/global/workspaces/:id", () => {})
})
