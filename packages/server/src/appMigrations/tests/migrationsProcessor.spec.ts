import * as setup from "../../api/routes/tests/utilities"
import { processMigrations } from "../migrationsProcessor"
import { getAppMigrationVersion } from "../appMigrationMetadata"
import { context } from "@budibase/backend-core"

describe("migrationsProcessor", () => {
  it("running migrations will update the latest applied migration", async () => {
    const testMigrations: {
      migrationId: string
      migrationFunc: () => Promise<void>
    }[] = [
      { migrationId: "123", migrationFunc: async () => {} },
      { migrationId: "124", migrationFunc: async () => {} },
      { migrationId: "125", migrationFunc: async () => {} },
    ]

    const config = setup.getConfig()
    await config.init()

    const appId = config.getAppId()

    await config.doInContext(appId, () =>
      processMigrations(appId, testMigrations)
    )

    expect(
      await config.doInContext(appId, () => getAppMigrationVersion(appId))
    ).toBe("125")
  })

  it("no context can be initialised within a migration", async () => {
    const testMigrations: {
      migrationId: string
      migrationFunc: () => Promise<void>
    }[] = [
      {
        migrationId: "123",
        migrationFunc: async () => {
          await context.doInAppMigrationContext("any", () => {})
        },
      },
    ]

    const config = setup.getConfig()
    await config.init()

    const appId = config.getAppId()

    await expect(
      config.doInContext(appId, () => processMigrations(appId, testMigrations))
    ).rejects.toThrowError(
      "The context cannot be changed, a migration is currently running"
    )
  })
})
