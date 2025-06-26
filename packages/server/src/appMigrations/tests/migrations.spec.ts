import { Header } from "@budibase/backend-core"
import * as setup from "../../api/routes/tests/utilities"
import * as migrations from "../migrations"
import {
  AppMigration,
  getLatestEnabledMigrationId,
  checkMissingMigrations,
} from "../index"
import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "../appMigrationMetadata"

jest.mock<typeof migrations>("../migrations", () => ({
  MIGRATIONS: [
    {
      id: "20231211101320_test",
      func: migrationLogic(),
    },
  ],
}))

function migrationLogic(executionMS = 0): () => Promise<void> {
  return () => new Promise(r => setTimeout(r, executionMS))
}

describe("migrations", () => {
  it("new apps are created with the latest app migration version set", async () => {
    const config = setup.getConfig()
    await config.init()

    await config.doInContext(config.getAppId(), async () => {
      const migrationVersion = await getAppMigrationVersion(config.getAppId())

      expect(migrationVersion).toEqual("20231211101320_test")
    })
  })

  it("accessing an app that has no pending migrations will not attach the migrating header", async () => {
    const config = setup.getConfig()
    await config.init()

    const appId = config.getAppId()

    await config.api.application.get(appId, {
      headersNotPresent: [Header.MIGRATING_APP],
    })
  })

  it("accessing an app that has pending migrations will attach the migrating header", async () => {
    const config = setup.getConfig()
    await config.init()

    const appId = config.getAppId()

    migrations.MIGRATIONS.push({
      id: "20231211105812_new-test",
      func: migrationLogic(5000),
    })

    await config.api.application.get(appId, {
      headers: {
        [Header.MIGRATING_APP]: appId,
      },
    })
  })

  it("should disable all migrations after one that is disabled", () => {
    const MIGRATION_ID1 = "20231211105810_new-test",
      MIGRATION_ID2 = "20231211105812_new-test",
      MIGRATION_ID3 = "20231211105814_new-test"
    // create some migrations to test with
    const migrations: AppMigration[] = [
      {
        id: MIGRATION_ID1,
        func: migrationLogic(),
      },
      {
        id: MIGRATION_ID2,
        func: migrationLogic(),
      },
      {
        id: MIGRATION_ID3,
        func: migrationLogic(),
      },
    ]

    expect(getLatestEnabledMigrationId(migrations)).toBe(MIGRATION_ID3)
    migrations[1].disabled = true
    expect(getLatestEnabledMigrationId(migrations)).toBe(MIGRATION_ID1)
  })

  describe("index-based migration comparison", () => {
    beforeEach(() => {
      // Reset migrations array to known state
      migrations.MIGRATIONS.length = 0
      migrations.MIGRATIONS.push(
        { id: "20231211101320_test", func: migrationLogic(1000) },
        { id: "20231211101330_test2", func: migrationLogic(1000) },
        { id: "20231211101340_test3", func: migrationLogic(1000) }
      )
    })

    it("should trigger migration when there are future migrations based on the current version", async () => {
      const config = setup.getConfig()
      await config.init()
      const appId = config.getAppId()

      // Set app to first migration
      await config.doInContext(appId, async () => {
        await updateAppMigrationMetadata({
          appId,
          version: "20231211101320_test",
        })
      })

      const mockNext = jest.fn()
      const ctx = { response: { set: jest.fn() } } as any

      await config.doInContext(appId, () =>
        checkMissingMigrations(ctx, mockNext, appId)
      )

      expect(ctx.response.set).toHaveBeenCalledWith(Header.MIGRATING_APP, appId)
      expect(mockNext).toHaveBeenCalled()
    })

    it("should not trigger migration when current version is latest", async () => {
      const config = setup.getConfig()
      await config.init()
      const appId = config.getAppId()

      // Set app to latest migration
      await config.doInContext(appId, async () => {
        await updateAppMigrationMetadata({
          appId,
          version: "20231211101340_test3",
        })
      })

      const mockNext = jest.fn()
      const ctx = { response: { set: jest.fn() } } as any

      await config.doInContext(appId, () =>
        checkMissingMigrations(ctx, mockNext, appId)
      )

      expect(ctx.response.set).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalled()
    })

    it("should trigger migration when current version not found in array", async () => {
      const config = setup.getConfig()
      await config.init()
      const appId = config.getAppId()

      // Set app to non-existent migration
      await config.doInContext(appId, async () => {
        await updateAppMigrationMetadata({
          appId,
          version: "nonexistent_migration",
        })
      })

      const mockNext = jest.fn()
      const ctx = { response: { set: jest.fn() } } as any

      await config.doInContext(appId, () =>
        checkMissingMigrations(ctx, mockNext, appId)
      )

      expect(ctx.response.set).toHaveBeenCalledWith(Header.MIGRATING_APP, appId)
      expect(mockNext).toHaveBeenCalled()
    })
  })

  it("should handle rapid migration completion", async () => {
    migrations.MIGRATIONS.length = 0
    migrations.MIGRATIONS.push({
      id: "20250626103320_test",
      func: migrationLogic(),
    })

    const config = setup.getConfig()
    await config.init()
    const appId = config.getAppId()

    const mockNext = jest.fn()
    const ctx = { response: { set: jest.fn() } } as any

    await config.doInContext(appId, () =>
      checkMissingMigrations(ctx, mockNext, appId)
    )

    expect(ctx.response.set).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })
})
