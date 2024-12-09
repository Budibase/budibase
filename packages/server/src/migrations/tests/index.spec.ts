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
      await config.doInContext(undefined, async () => {
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

        expect(events.app.created).toHaveBeenCalledTimes(1)
        expect(events.app.published).toHaveBeenCalledTimes(1)
        expect(events.automation.created).toHaveBeenCalledTimes(2)
        expect(events.automation.stepCreated).toHaveBeenCalledTimes(1)
        expect(events.datasource.created).toHaveBeenCalledTimes(2)
        expect(events.layout.created).toHaveBeenCalledTimes(1)
        expect(events.query.created).toHaveBeenCalledTimes(2)
        expect(events.role.created).toHaveBeenCalledTimes(3) // created roles + admin (created on table creation)
        expect(events.table.created).toHaveBeenCalledTimes(3)
        expect(events.backfill.appSucceeded).toHaveBeenCalledTimes(2)

        // to make sure caching is working as expected
        expect(
          events.processors.analyticsProcessor.processEvent
        ).toHaveBeenCalledTimes(20) // Addition of of the events above
      })
    })
  })

  it("runs global db migration", async () => {
    await config.doInContext(undefined, async () => {
      await clearMigrations()
      const appId = config.getProdAppId()
      const roles = { [appId]: "role_12345" }
      await config.createUser({
        builder: { global: false },
        admin: { global: true },
        roles,
      }) // admin only
      await config.createUser({
        builder: { global: false },
        admin: { global: false },
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

      expect(events.user.created).toHaveBeenCalledTimes(3)
      expect(events.role.assigned).toHaveBeenCalledTimes(2)
      expect(events.user.permissionBuilderAssigned).toHaveBeenCalledTimes(1) // default test user
      expect(events.user.permissionAdminAssigned).toHaveBeenCalledTimes(1) // admin from above
      expect(events.rows.created).toHaveBeenCalledTimes(1)
      expect(events.rows.created).toHaveBeenCalledWith(2, timestamp)
      expect(events.email.SMTPCreated).toHaveBeenCalledTimes(1)
      expect(events.auth.SSOCreated).toHaveBeenCalledTimes(2)
      expect(events.auth.SSOActivated).toHaveBeenCalledTimes(2)
      expect(events.org.logoUpdated).toHaveBeenCalledTimes(1)
      expect(events.org.nameUpdated).toHaveBeenCalledTimes(1)
      expect(events.org.platformURLUpdated).toHaveBeenCalledTimes(1)
      expect(events.backfill.tenantSucceeded).toHaveBeenCalledTimes(1)

      // to make sure caching is working as expected
      expect(
        events.processors.analyticsProcessor.processEvent
      ).toHaveBeenCalledTimes(19)
    })
  })
})
