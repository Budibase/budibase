const { DEFAULT_TENANT_ID } = require("../constants")
const { doWithDB } = require("../db")
const { DocumentTypes } = require("../db/constants")
const { getAllApps } = require("../db/utils")
const environment = require("../environment")
const {
  doInTenant,
  getTenantIds,
  getGlobalDBName,
  getTenantId,
} = require("../tenancy")

exports.MIGRATION_TYPES = {
  GLOBAL: "global", // run once, recorded in global db, global db is provided as an argument
  APP: "app", // run per app, recorded in each app db, app db is provided as an argument
}

exports.getMigrationsDoc = async db => {
  // get the migrations doc
  try {
    return await db.get(DocumentTypes.MIGRATIONS)
  } catch (err) {
    if (err.status && err.status === 404) {
      return { _id: DocumentTypes.MIGRATIONS }
    }
    console.error(err)
  }
}

exports.runMigration = async (migration, options = {}) => {
  const tenantId = getTenantId()
  const migrationType = migration.type
  const migrationName = migration.name
  const silent = migration.silent

  const log = message => {
    if (!silent) {
      console.log(message)
    }
  }

  // get the db to store the migration in
  let dbNames
  if (migrationType === exports.MIGRATION_TYPES.GLOBAL) {
    dbNames = [getGlobalDBName()]
  } else if (migrationType === exports.MIGRATION_TYPES.APP) {
    const apps = await getAllApps(migration.opts)
    dbNames = apps.map(app => app.appId)
  } else {
    throw new Error(
      `[Tenant: ${tenantId}] Unrecognised migration type [${migrationType}]`
    )
  }

  const length = dbNames.length
  let count = 0

  // run the migration against each db
  for (const dbName of dbNames) {
    count++
    const lengthStatement = length > 1 ? `[${count}/${length}]` : ""

    await doWithDB(dbName, async db => {
      try {
        const doc = await exports.getMigrationsDoc(db)

        // exit if the migration has been performed already
        if (doc[migrationName]) {
          if (
            options.force &&
            options.force[migrationType] &&
            options.force[migrationType].includes(migrationName)
          ) {
            log(
              `[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Forcing`
            )
          } else {
            // the migration has already been performed
            return
          }
        }

        log(
          `[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Running ${lengthStatement}`
        )
        // run the migration with tenant context
        await migration.fn(db)
        log(
          `[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Complete`
        )

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

exports.runMigrations = async (migrations, options = {}) => {
  let tenantIds
  if (environment.MULTI_TENANCY) {
    if (!options.tenantIds || !options.tenantIds.length) {
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
      await doInTenant(tenantId, () => exports.runMigration(migration, options))
    }
  }
  console.log("Migrations complete")
}
