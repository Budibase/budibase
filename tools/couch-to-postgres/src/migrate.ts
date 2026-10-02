import { BudibaseClient } from "./budibaseClient.js"
import { PostgresSink } from "./postgresSink.js"
import { mapSchema } from "./schemaMapping.js"
import type { MigrateOptions } from "./types.js"

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

export async function migrate(options: MigrateOptions): Promise<void> {
  const budibase = new BudibaseClient(options.budibaseUrl, options.appId)
  await budibase.login(options.email, options.password, options.tenantId)

  const table = await budibase.getTable(options.tableId)
  const pgTable = options.pgTable ?? slugify(table.name)
  const { migratable, skipped } = mapSchema(table.schema)

  console.log(`Table "${table.name}" (${table._id})`)
  console.log(`  Target: postgres "${options.pgSchema}"."${pgTable}"`)
  console.log(`  Migratable columns: ${migratable.map(c => c.column).join(", ")}`)
  if (skipped.length > 0) {
    console.log(`  Skipped columns (not transferable as-is):`)
    for (const col of skipped) {
      console.log(`    - ${col.column} (${col.fieldType}): ${col.reason}`)
    }
  }

  if (options.dryRun) {
    console.log("\nDry run requested, stopping before any writes.")
    return
  }

  const sink = new PostgresSink({
    host: options.pgHost,
    port: options.pgPort,
    database: options.pgDatabase,
    user: options.pgUser,
    password: options.pgPassword,
    ssl: options.pgSsl,
  })
  await sink.connect()

  try {
    await sink.ensureSchema(options.pgSchema)
    await sink.createTable(options.pgSchema, pgTable, migratable)

    let migratedCount = 0
    for await (const rows of budibase.searchAllRows(
      table._id,
      options.batchSize
    )) {
      await sink.upsertBatch(options.pgSchema, pgTable, migratable, rows)
      migratedCount += rows.length
      console.log(`  Migrated ${migratedCount} rows...`)
    }
    console.log(`\nMigrated ${migratedCount} rows into Postgres.`)
  } finally {
    await sink.close()
  }

  const { datasourceId, errors } = await budibase.createPostgresDatasource(
    options.datasourceName ?? `${table.name} (Postgres)`,
    {
      host: options.pgHost,
      port: options.pgPort,
      database: options.pgDatabase,
      user: options.pgUser,
      password: options.pgPassword,
      schema: options.pgSchema,
      ssl: options.pgSsl,
    },
    [pgTable]
  )

  console.log(`\nRegistered Budibase datasource ${datasourceId}`)
  if (Object.keys(errors).length > 0) {
    console.log("Datasource schema-fetch reported issues:")
    for (const [key, message] of Object.entries(errors)) {
      console.log(`  - ${key}: ${message}`)
    }
  }

  console.log(
    "\nThe original internal table was left untouched. Screens, automations, views " +
      "and permissions still point at it and must be repointed at the new external " +
      "table manually."
  )
}
