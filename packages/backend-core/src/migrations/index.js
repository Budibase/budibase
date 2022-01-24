const { DEFAULT_TENANT_ID } = require("../constants")
const { DocumentTypes } = require("../db/constants")
const { getAllApps } = require("../db/utils")
const environment = require("../environment")
const { doInTenant, getTenantIds, getGlobalDBName } = require("../tenancy")

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
  }
}

const runMigration = async (tenantId, CouchDB, migration, options = {}) => {
  const migrationType = migration.type
  const migrationName = migration.name

  // get the db to store the migration in
  let dbNames
  if (migrationType === exports.MIGRATION_TYPES.GLOBAL) {
    dbNames = [getGlobalDBName(tenantId)]
  } else if (migrationType === exports.MIGRATION_TYPES.APP) {
    dbNames = await getAllApps(CouchDB, { all: true })
  } else {
    throw new Error(
      `[Tenant: ${tenantId}] Unrecognised migration type [${migrationType}]`
    )
  }

  // run the migration against each db
  for (const dbName of dbNames) {
    const db = new CouchDB(dbName)
    try {
      const doc = await exports.getMigrationsDoc(db)

      // exit if the migration has been performed already
      if (doc[migrationName]) {
        if (
          options.force &&
          options.force[migrationType] &&
          options.force[migrationType].includes(migrationName)
        ) {
          console.log(
            `[Tenant: ${tenantId}] Forcing migration [${migrationName}]`
          )
        } else {
          // the migration has already been performed
          return
        }
      }

      console.log(
        `[Tenant: ${tenantId}] Performing migration: ${migrationName}`
      )
      // run the migration with tenant context
      await doInTenant(tenantId, () => migration.fn(db))
      console.log(`[Tenant: ${tenantId}] Migration complete: ${migrationName}`)

      // mark as complete
      doc[migrationName] = Date.now()
      await db.put(doc)
    } catch (err) {
      console.error(
        `[Tenant: ${tenantId}] Error performing migration: ${migrationName} on db: ${db.name}: `,
        err
      )
      throw err
    }
  }
}

exports.runMigrations = async (CouchDB, migrations, options = {}) => {
  console.log("Running migrations")
  let tenantIds
  if (environment.MULTI_TENANCY) {
    if (!options.tenantIds || !options.tenantIds.length) {
      // run for all tenants
      tenantIds = await getTenantIds()
    }
  } else {
    // single tenancy
    tenantIds = [DEFAULT_TENANT_ID]
  }

  // for all tenants
  for (const tenantId of tenantIds) {
    // for all migrations
    for (const migration of migrations) {
      // run the migration
      await runMigration(tenantId, CouchDB, migration, options)
    }
  }
  console.log("Migrations complete")
}
