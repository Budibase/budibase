#!/usr/bin/env node
import { Command } from "commander"
import { migrate } from "./migrate.js"

const program = new Command()

program
  .name("bbdb-to-postgres")
  .description(
    "Migrate a Budibase internal (CouchDB-backed) table to an external PostgreSQL datasource"
  )
  .requiredOption("--app-id <id>", "Budibase app id, e.g. app_dev_xxxx")
  .requiredOption("--table-id <id>", "Internal Budibase table id, e.g. ta_xxxx")
  .requiredOption("--email <email>", "Budibase builder login email")
  .requiredOption("--password <password>", "Budibase builder login password")
  .option("--budibase-url <url>", "Budibase base URL", "http://localhost:10000")
  .option("--tenant-id <id>", "Budibase tenant id", "default")
  .requiredOption("--pg-host <host>", "Postgres host")
  .option("--pg-port <port>", "Postgres port", "5432")
  .requiredOption("--pg-database <database>", "Postgres database name")
  .requiredOption("--pg-user <user>", "Postgres user")
  .requiredOption("--pg-password <password>", "Postgres password")
  .option("--pg-schema <schema>", "Postgres schema", "public")
  .option("--pg-ssl", "Use SSL for the Postgres connection", false)
  .option(
    "--pg-table <table>",
    "Target Postgres table name (defaults to a slug of the Budibase table name)"
  )
  .option("--datasource-name <name>", "Name for the new Budibase datasource")
  .option("--batch-size <n>", "Rows per page/insert batch", "500")
  .option(
    "--dry-run",
    "Print the migration plan without writing anything",
    false
  )
  .action(async opts => {
    try {
      await migrate({
        budibaseUrl: opts.budibaseUrl,
        email: opts.email,
        password: opts.password,
        tenantId: opts.tenantId,
        appId: opts.appId,
        tableId: opts.tableId,
        pgHost: opts.pgHost,
        pgPort: Number(opts.pgPort),
        pgDatabase: opts.pgDatabase,
        pgUser: opts.pgUser,
        pgPassword: opts.pgPassword,
        pgSchema: opts.pgSchema,
        pgSsl: Boolean(opts.pgSsl),
        pgTable: opts.pgTable,
        datasourceName: opts.datasourceName,
        batchSize: Number(opts.batchSize),
        dryRun: Boolean(opts.dryRun),
      })
    } catch (err) {
      console.error(err instanceof Error ? err.message : err)
      process.exitCode = 1
    }
  })

program.parse()
