import { Header } from "@budibase/backend-core"
import * as setup from "../../api/routes/tests/utilities"
import * as migrations from "../migrations"
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

    const response = await config.api.application.getRaw(appId)

    expect(response.headers[Header.MIGRATING_APP]).toBeUndefined()
  })

  it("accessing an app that has pending migrations will attach the migrating header", async () => {
    const config = setup.getConfig()
    await config.init()

    const appId = config.getAppId()

    migrations.MIGRATIONS.push({
      id: "20231211105812_new-test",
      func: async () => {},
    })

    const response = await config.api.application.getRaw(appId)

    expect(response.headers[Header.MIGRATING_APP]).toEqual(appId)
  })
})
