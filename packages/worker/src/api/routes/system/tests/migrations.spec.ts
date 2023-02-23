const migrateFn = jest.fn()

import { TestConfiguration } from "../../../../tests"

jest.mock("../../../../migrations", () => {
  return {
    ...jest.requireActual("../../../../migrations"),
    migrate: migrateFn,
  }
})

describe("/api/system/migrations", () => {
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

  describe("POST /api/system/migrations/run", () => {
    it("fails with no internal api key", async () => {
      const res = await config.api.migrations.runMigrations({
        headers: {},
        status: 403,
      })
      expect(res.body).toEqual({ message: "Unauthorized", status: 403 })
      expect(migrateFn).toBeCalledTimes(0)
    })

    it("runs migrations", async () => {
      const res = await config.api.migrations.runMigrations()
      expect(res.text).toBe("OK")
      expect(migrateFn).toBeCalledTimes(1)
    })
  })

  describe("DELETE /api/system/migrations/definitions", () => {
    it("fails with no internal api key", async () => {
      const res = await config.api.migrations.getMigrationDefinitions({
        headers: {},
        status: 403,
      })
      expect(res.body).toEqual({ message: "Unauthorized", status: 403 })
    })

    it("returns definitions", async () => {
      const res = await config.api.migrations.getMigrationDefinitions()
      expect(res.body).toEqual([
        {
          name: "global_info_sync_users",
          type: "global",
        },
      ])
    })
  })
})
