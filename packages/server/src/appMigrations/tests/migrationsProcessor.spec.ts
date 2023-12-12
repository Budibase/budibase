import * as setup from "../../api/routes/tests/utilities"
import { processMigrations } from "../migrationsProcessor"
import { getAppMigrationVersion } from "../appMigrationMetadata"
import { context } from "@budibase/backend-core"
import { AppMigration } from ".."

describe("migrationsProcessor", () => {
  it("running migrations will update the latest applied migration", async () => {
    const testMigrations: AppMigration[] = [
      { id: "123", func: async () => {} },
      { id: "124", func: async () => {} },
      { id: "125", func: async () => {} },
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
    const testMigrations: AppMigration[] = [
      {
        id: "123",
        func: async () => {
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
