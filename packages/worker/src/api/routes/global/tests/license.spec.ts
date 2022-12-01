/*
This needs the account portal to be working in order to test properly 
*/

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

  describe("POST /api/global/license/activate", () => {
    it("activates license", async () => {
      //let result = await config.api.license.activate("test")
      //expect(result.status).toEqual(200)
    })
  })

  describe("POST /api/global/license/refresh", () => {})

  describe("GET /api/global/license/info", () => {})

  describe("DELETE /api/global/license/info", () => {})

  describe("GET /api/global/license/usage", () => {})
})
