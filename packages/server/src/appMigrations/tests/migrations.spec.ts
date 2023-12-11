import * as setup from "../../api/routes/tests/utilities"
import * as migrations from "../migrations"
import { getAppMigrationVersion } from "../appMigrationMetadata"
import { AppMigration } from ".."

const mockedMigrations: AppMigration[] = [
  {
    id: "20231211101320_test",
    func: async () => {},
  },
]

jest.doMock<typeof migrations>("../migrations", () => ({
  MIGRATIONS: mockedMigrations,
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
})
