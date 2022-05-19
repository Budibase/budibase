import { events, migrations } from "@budibase/backend-core"
import TestConfig from "../../tests/utilities/TestConfiguration"
import structures from "../../tests/utilities/structures"
import { MIGRATIONS } from "../"

jest.setTimeout(100000)

describe("migrations", () => {
  const config = new TestConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  describe("backfill", () => {
    it("runs app db migration", async () => {
      await config.doInContext(null, async () => {
        await config.createAutomation()
        await config.createAutomation(structures.newAutomation())
        await config.createDatasource()
        await config.createDatasource()
        await config.createLayout()
        await config.createQuery()
        await config.createQuery()
        await config.createRole()
        await config.createRole()
        await config.createTable()
        await config.createTable()

        jest.clearAllMocks()
        const migration = MIGRATIONS.filter(
          m => m.name === "event_app_backfill"
        )[0]
        await migrations.runMigration(migration)

        expect(events.app.created).toBeCalledTimes(1)
        expect(events.app.published).toBeCalledTimes(1)
        expect(events.automation.created).toBeCalledTimes(2)
        expect(events.automation.stepCreated).toBeCalledTimes(1)
        expect(events.datasource.created).toBeCalledTimes(2)
        expect(events.layout.created).toBeCalledTimes(3)
        expect(events.query.created).toBeCalledTimes(2)
        expect(events.role.created).toBeCalledTimes(2)
        expect(events.table.created).toBeCalledTimes(3)
      })
    })
  })
})
