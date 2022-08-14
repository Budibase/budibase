import { DEFAULT_TENANT_ID } from "../constants"
import { doWithDB } from "../db"
import { DocumentType, StaticDatabases } from "../db/constants"
import { getAllApps } from "../db/utils"
import environment from "../environment"
import {
  doInTenant,
  getTenantIds,
  getGlobalDBName,
  getTenantId,
} from "../tenancy"
import * as context from "../context"
import { DEFINITIONS } from "."
import {
  Migration,
  MigrationOptions,
  MigrationType,
  MigrationNoOpOptions,
} from "@budibase/types"

export const getMigrationsDoc = async (db: any) => {
  // get the migrations doc
  try {
    return await db.get(DocumentType.MIGRATIONS)
  } catch (err: any) {
    if (err.status && err.status === 404) {
      return { _id: DocumentType.MIGRATIONS }
    } else {
      console.error(err)
      throw err
    }
  }
}

export const backPopulateMigrations = async (opts: MigrationNoOpOptions) => {
  // filter migrations to the type and populate a no-op migration
  const migrations: Migration[] = DEFINITIONS.filter(
    def => def.type === opts.type
  ).map(d => ({ ...d, fn: () => {} }))
  await runMigrations(migrations, { noOp: opts })
}

export const runMigration = async (
  migration: Migration,
  options: MigrationOptions = {}
) => {
  const migrationType = migration.type
  let tenantId: string
  if (migrationType !== MigrationType.INSTALLATION) {
    tenantId = getTenantId()
  }
  const migrationName = migration.name
  const silent = migration.silent

  const log = (message: string) => {
    if (!silent) {
      console.log(message)
    }
  }

  // get the db to store the migration in
  let dbNames
  if (migrationType === MigrationType.GLOBAL) {
    dbNames = [getGlobalDBName()]
  } else if (migrationType === MigrationType.APP) {
    if (options.noOp) {
      dbNames = [options.noOp.appId]
    } else {
      const apps = await getAllApps(migration.appOpts)
      dbNames = apps.map(app => app.appId)
    }
  } else if (migrationType === MigrationType.INSTALLATION) {
    dbNames = [StaticDatabases.PLATFORM_INFO.name]
  } else {
    throw new Error(`Unrecognised migration type [${migrationType}]`)
  }

  const length = dbNames.length
  let count = 0

  // run the migration against each db
  for (const dbName of dbNames) {
    count++
    const lengthStatement = length > 1 ? `[${count}/${length}]` : ""

    await doWithDB(dbName, async (db: any) => {
      try {
        const doc = await exports.getMigrationsDoc(db)

        // the migration has already been run
        if (doc[migrationName]) {
          // check for force
          if (
            options.force &&
            options.force[migrationType] &&
            options.force[migrationType].includes(migrationName)
          ) {
            log(
              `[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Forcing`
            )
          } else {
            // no force, exit
            return
          }
        }

        // check if the migration is not a no-op
        if (!options.noOp) {
          log(
            `[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Running ${lengthStatement}`
          )

          if (migration.preventRetry) {
            // eagerly set the completion date
            // so that we never run this migration twice even upon failure
            doc[migrationName] = Date.now()
            const response = await db.put(doc)
            doc._rev = response.rev
          }

          // run the migration
          if (migrationType === MigrationType.APP) {
            await context.doInAppContext(db.name, async () => {
              await migration.fn(db)
            })
          } else {
            await migration.fn(db)
          }

          log(
            `[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Complete`
          )
        }

        // mark as complete
        doc[migrationName] = Date.now()
        await db.put(doc)
      } catch (err) {
        console.error(
          `[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Error: `,
          err
        )
        throw err
      }
    })
  }
}

export const runMigrations = async (
  migrations: Migration[],
  options: MigrationOptions = {}
) => {
  let tenantIds

  if (environment.MULTI_TENANCY) {
    if (options.noOp) {
      tenantIds = [options.noOp.tenantId]
    } else if (!options.tenantIds || !options.tenantIds.length) {
      // run for all tenants
      tenantIds = await getTenantIds()
    } else {
      tenantIds = options.tenantIds
    }
  } else {
    // single tenancy
    tenantIds = [DEFAULT_TENANT_ID]
  }

  if (tenantIds.length > 1) {
    console.log(`Checking migrations for ${tenantIds.length} tenants`)
  } else {
    console.log("Checking migrations")
  }

  let count = 0
  // for all tenants
  for (const tenantId of tenantIds) {
    count++
    if (tenantIds.length > 1) {
      console.log(`Progress [${count}/${tenantIds.length}]`)
    }
    // for all migrations
    for (const migration of migrations) {
      // run the migration
      await doInTenant(tenantId, () => runMigration(migration, options))
    }
  }
  console.log("Migrations complete")
}
