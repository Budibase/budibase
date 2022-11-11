import { TestConfiguration } from "../../../../tests"

// TODO

describe("/api/global/template", () => {
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

  describe("GET /api/global/template/definitions", () => {
    it("retrieves definitions", () => {})
  })

  describe("POST /api/global/template", () => {})

  describe("GET /api/global/template", () => {})

  describe("GET /api/global/template/:type", () => {})

  describe("GET /api/global/template/:ownerId", () => {})

  describe("GET /api/global/template/:id", () => {})

  describe("DELETE /api/global/template/:id/:rev", () => {})
})
