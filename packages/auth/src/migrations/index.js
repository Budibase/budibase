const { DocumentTypes } = require("../db/constants")
const { getGlobalDB } = require("../tenancy")

exports.MIGRATION_DBS = {
  GLOBAL_DB: "GLOBAL_DB",
}

exports.MIGRATIONS = {
  USER_EMAIL_VIEW_CASING: "user_email_view_casing",
}

const DB_LOOKUP = {
  [exports.MIGRATION_DBS.GLOBAL_DB]: [
    exports.MIGRATIONS.USER_EMAIL_VIEW_CASING,
  ],
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

exports.migrateIfRequired = async (migrationDb, migrationName, migrateFn) => {
  try {
    let db
    if (migrationDb === exports.MIGRATION_DBS.GLOBAL_DB) {
      db = getGlobalDB()
    } else {
      throw new Error(`Unrecognised migration db [${migrationDb}]`)
    }

    if (!DB_LOOKUP[migrationDb].includes(migrationName)) {
      throw new Error(
        `Unrecognised migration name [${migrationName}] for db [${migrationDb}]`
      )
    }

    const doc = await exports.getMigrationsDoc(db)
    // exit if the migration has been performed
    if (doc[migrationName]) {
      return
    }

    console.log(`Performing migration: ${migrationName}`)
    await migrateFn()
    console.log(`Migration complete: ${migrationName}`)

    // mark as complete
    doc[migrationName] = Date.now()
    await db.put(doc)
  } catch (err) {
    console.error(`Error performing migration: ${migrationName}: `, err)
    throw err
  }
}
