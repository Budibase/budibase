import * as setup from "../../api/routes/tests/utilities"
import { processMigrations } from "../migrationsProcessor"
import { getAppMigrationVersion } from "../appMigrationMetadata"
import { context } from "@budibase/backend-core"
import { AppMigration } from ".."

const futureTimestamp = `20500101174029`

describe("migrationsProcessor", () => {
  it("running migrations will update the latest applied migration", async () => {
    const testMigrations: AppMigration[] = [
      { id: `${futureTimestamp}_123`, func: async () => {} },
      { id: `${futureTimestamp}_124`, func: async () => {} },
      { id: `${futureTimestamp}_125`, func: async () => {} },
    ]

    const config = setup.getConfig()
    await config.init()

    const appId = config.getAppId()

    await config.doInContext(appId, () =>
      processMigrations(appId, testMigrations)
    )

    expect(
      await config.doInContext(appId, () => getAppMigrationVersion(appId))
    ).toBe(`${futureTimestamp}_125`)
  })

  it("no context can be initialised within a migration", async () => {
    const testMigrations: AppMigration[] = [
      {
        id: `${futureTimestamp}_123`,
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
    ).rejects.toThrow(
      "The context cannot be changed, a migration is currently running"
    )
  })
})
