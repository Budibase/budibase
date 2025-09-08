import { context, DesignDocuments } from "@budibase/backend-core"
import { Database } from "@budibase/types"
import { getAppMigrationVersion, updateAppMigrationMetadata } from ".."
import * as setup from "../../api/routes/tests/utilities"
import * as migrations from "../migrations"
import { processMigrations } from "../migrationsProcessor"

describe("migration integrity", () => {
  // These test is checking that each migration is "idempotent".
  // We should be able to rerun any migration, with any rerun not modifiying anything. The code should be aware that the migration already ran
  it("each migration can rerun safely", async () => {
    const config = setup.getConfig()
    await config.init()

    async function setCurrentVersion(currentMigrationId: string) {
      for (const appId of [config.getAppId(), config.getProdAppId()]) {
        await config.doInContext(appId, async () => {
          await updateAppMigrationMetadata({
            appId,
            version: currentMigrationId,
          })
        })
      }
    }

    async function getDocs(db: Database) {
      const allDocs = await db.allDocs({ include_docs: true })
      const documentsToIgnore: string[] = [DesignDocuments.MIGRATIONS]
      return {
        ...allDocs,
        rows: allDocs.rows.filter(r => !documentsToIgnore.includes(r.id)),
      }
    }

    const appId = config.getAppId()
    await config.doInContext(appId, async () => {
      await setCurrentVersion("")
      const devDb = context.getWorkspaceDB()
      const prodDb = context.getProdWorkspaceDB()
      for (let i = 0; i < migrations.MIGRATIONS.length; i++) {
        const migrationsToApply = migrations.MIGRATIONS.slice(0, i + 1)
        const latestMigration =
          migrationsToApply[migrationsToApply.length - 1].id

        const currentVersion = await getAppMigrationVersion(appId)

        await processMigrations(appId, migrationsToApply)
        expect(await getAppMigrationVersion(appId)).toBe(latestMigration)

        const afterMigrationDevDocs = await getDocs(devDb)
        const afterMigrationProdDocs = await getDocs(prodDb)

        await setCurrentVersion(currentVersion)
        expect(await getAppMigrationVersion(appId)).not.toBe(latestMigration)

        await processMigrations(appId, migrationsToApply)
        expect(await getAppMigrationVersion(appId)).toBe(latestMigration)

        const afterRerunDevDocs = await getDocs(devDb)
        const afterRerunProdDocs = await getDocs(prodDb)

        expect(afterRerunDevDocs).toEqual(afterMigrationDevDocs)
        expect(afterRerunProdDocs).toEqual(afterMigrationProdDocs)
      }
    })
  })
})
