import {
  events,
  migrations,
  tenancy,
  DocumentType,
  context,
} from "@budibase/backend-core"
import TestConfig from "../../tests/utilities/TestConfiguration"
import * as structures from "../../tests/utilities/structures"
import { MIGRATIONS } from "../"
import * as helpers from "./helpers"

import tk from "timekeeper"
import { View } from "@budibase/types"
const timestamp = new Date().toISOString()
tk.freeze(timestamp)

const clearMigrations = async () => {
  const dbs = [context.getDevAppDB(), context.getProdAppDB()]
  for (const db of dbs) {
    const doc = await db.get<any>(DocumentType.MIGRATIONS)
    const newDoc = { _id: doc._id, _rev: doc._rev }
    await db.put(newDoc)
  }
}

jest.setTimeout(10000)

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
        await clearMigrations()
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
        await config.createLegacyView()
        await config.createTable()
        await config.createLegacyView(
          structures.view(config.table!._id!) as View
        )
        await config.createScreen()
        await config.createScreen()

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
        expect(events.layout.created).toBeCalledTimes(1)
        expect(events.query.created).toBeCalledTimes(2)
        expect(events.role.created).toBeCalledTimes(2)
        expect(events.table.created).toBeCalledTimes(3)
        expect(events.view.created).toBeCalledTimes(2)
        expect(events.view.calculationCreated).toBeCalledTimes(1)
        expect(events.view.filterCreated).toBeCalledTimes(1)
        expect(events.screen.created).toBeCalledTimes(2)
        expect(events.backfill.appSucceeded).toBeCalledTimes(2)

        const processor = events.processors.analyticsProcessor.processEvent
        console.log(processor)

        // to make sure caching is working as expected
        expect(
          events.processors.analyticsProcessor.processEvent
        ).toBeCalledTimes(23)
      })
    })
  })

  it("runs global db migration", async () => {
    await config.doInContext(null, async () => {
      await clearMigrations()
      const appId = config.prodAppId
      const roles = { [appId]: "role_12345" }
      await config.createUser({
        builder: false,
        admin: true,
        roles,
      }) // admin only
      await config.createUser({
        builder: false,
        admin: false,
        roles,
      }) // non admin non builder
      await config.createTable()
      await config.createRow()
      await config.createRow()

      const db = tenancy.getGlobalDB()
      await helpers.saveGoogleConfig(db)
      await helpers.saveOIDCConfig(db)
      await helpers.saveSettingsConfig(db)
      await helpers.saveSmtpConfig(db)

      jest.clearAllMocks()
      const migration = MIGRATIONS.filter(
        m => m.name === "event_global_backfill"
      )[0]
      await migrations.runMigration(migration)

      expect(events.user.created).toBeCalledTimes(3)
      expect(events.role.assigned).toBeCalledTimes(2)
      expect(events.user.permissionBuilderAssigned).toBeCalledTimes(1) // default test user
      expect(events.user.permissionAdminAssigned).toBeCalledTimes(1) // admin from above
      expect(events.rows.created).toBeCalledTimes(1)
      expect(events.rows.created).toBeCalledWith(2, timestamp)
      expect(events.email.SMTPCreated).toBeCalledTimes(1)
      expect(events.auth.SSOCreated).toBeCalledTimes(2)
      expect(events.auth.SSOActivated).toBeCalledTimes(2)
      expect(events.org.logoUpdated).toBeCalledTimes(1)
      expect(events.org.nameUpdated).toBeCalledTimes(1)
      expect(events.org.platformURLUpdated).toBeCalledTimes(1)
      expect(events.backfill.tenantSucceeded).toBeCalledTimes(1)

      // to make sure caching is working as expected
      expect(events.processors.analyticsProcessor.processEvent).toBeCalledTimes(
        19
      )
    })
  })
})
