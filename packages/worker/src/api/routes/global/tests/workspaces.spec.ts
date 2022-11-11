import { TestConfiguration, API } from "../../../../tests"

describe("/api/global/workspaces", () => {
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

  describe("GET /api/global/workspaces", () => {})

  describe("DELETE /api/global/workspaces/:id", () => {})

  describe("GET /api/global/workspaces", () => {})

  describe("GET /api/global/workspaces/:id", () => {})
})
