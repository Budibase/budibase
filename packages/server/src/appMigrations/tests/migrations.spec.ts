import { Header } from "@budibase/backend-core"
import * as setup from "../../api/routes/tests/utilities"
import * as migrations from "../migrations"
import { AppMigration, getLatestEnabledMigrationId } from "../index"
import { getAppMigrationVersion } from "../appMigrationMetadata"

jest.mock<typeof migrations>("../migrations", () => ({
  MIGRATIONS: [
    {
      id: "20231211101320_test",
      func: async () => {},
    },
  ],
}))

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
      func: async () => {},
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
        func: async () => {},
      },
      {
        id: MIGRATION_ID2,
        func: async () => {},
      },
      {
        id: MIGRATION_ID3,
        func: async () => {},
      },
    ]

    expect(getLatestEnabledMigrationId(migrations)).toBe(MIGRATION_ID3)
    migrations[1].disabled = true
    expect(getLatestEnabledMigrationId(migrations)).toBe(MIGRATION_ID1)
  })
})
