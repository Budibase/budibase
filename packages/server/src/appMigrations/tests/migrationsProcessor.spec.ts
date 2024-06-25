import { processMigrations } from "../migrationsProcessor"
import { getAppMigrationVersion } from "../appMigrationMetadata"
import { context } from "@budibase/backend-core"
import { AppMigration } from ".."
import TestConfiguration from "../../../src/tests/utilities/TestConfiguration"

const futureTimestamp = `20500101174029`

describe("migrationsProcessor", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("running migrations will update the latest applied migration", async () => {
    const testMigrations: AppMigration[] = [
      { id: `${futureTimestamp}_123`, func: async () => {} },
      { id: `${futureTimestamp}_124`, func: async () => {} },
      { id: `${futureTimestamp}_125`, func: async () => {} },
    ]

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

    const appId = config.getAppId()

    await expect(
      config.doInContext(appId, () => processMigrations(appId, testMigrations))
    ).rejects.toThrow(
      "The context cannot be changed, a migration is currently running"
    )
  })
})
