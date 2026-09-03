#!/usr/bin/env node
const fs = require("fs")
const path = require("path")

// Imports one or more CouchDB `_all_docs?include_docs=true` dump files (as
// produced by exporting a database via that endpoint) into a target CouchDB
// instance, e.g. the local dev instance started by `yarn dev`.
//
// Usage:
//   node scripts/dev/import-couch-dump.js --dir <path> (where <path> contains files like "app_dev_acme_<uuid>.json")
//   node scripts/dev/import-couch-dump.js --file app_dev.json --db app_dev_abc123
//
// Options:
//   --dir <path>          Directory of dump files. Each file's target db name
//                          is derived from its filename by stripping a
//                          tenantId segment (see --tenant), unless
//                          --keep-tenant is passed.
//   --file <path>         Import a single dump file. Requires --db.
//   --db <name>           Explicit target db name (only valid with --file).
//   --tenant <id>         TenantId segment to strip from filenames when
//                          deriving db names from --dir (e.g. "acme" turns
//                          "app_dev_acme_<uuid>.json" into db
//                          "app_dev_<uuid>"). Required with --dir unless
//                          --keep-tenant is passed.
//   --keep-tenant         Don't strip any tenant segment; use filenames as-is
//                          (minus .json) as db names.
//   --couch-url <url>     CouchDB base url. Default: http://localhost:4005
//   --user <user>         CouchDB basic auth user. Default: budibase
//   --password <pass>     CouchDB basic auth password. Default: budibase
//   --skip-global         Skip any file matched as a global-db dump
//                          (filename containing "global-db"). Recommended
//                          when the target already has its own global-db,
//                          to avoid clobbering local users/settings.
//   --dry-run             Print what would be imported without writing
//                          anything.
//
// Notes:
// - Documents are loaded with `new_edits: false` to preserve original
//   `_rev`s, so design docs (`_design/sqlite`, `_design/migrations`) and
//   revision history survive the import intact.
// - This does not import file attachments stored in the object store
//   (MinIO/S3); only CouchDB documents.

const BATCH_SIZE = 1000

function parseArgs(argv) {
  const args = {
    couchUrl: "http://localhost:4005",
    user: "budibase",
    password: "budibase",
  }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    switch (arg) {
      case "--dir":
        args.dir = argv[++i]
        break
      case "--file":
        args.file = argv[++i]
        break
      case "--db":
        args.db = argv[++i]
        break
      case "--tenant":
        args.tenant = argv[++i]
        break
      case "--keep-tenant":
        args.keepTenant = true
        break
      case "--couch-url":
        args.couchUrl = argv[++i]
        break
      case "--user":
        args.user = argv[++i]
        break
      case "--password":
        args.password = argv[++i]
        break
      case "--skip-global":
        args.skipGlobal = true
        break
      case "--dry-run":
        args.dryRun = true
        break
      default:
        throw new Error(`Unknown argument: ${arg}`)
    }
  }
  return args
}

function dbNameFromFilename(filename, tenant, keepTenant) {
  const base = filename.replace(/\.json$/, "")
  if (keepTenant || !tenant) {
    return base
  }
  return base.split(`_${tenant}`).join("")
}

function authHeader(user, password) {
  return "Basic " + Buffer.from(`${user}:${password}`).toString("base64")
}

async function couchRequest(couchUrl, authHeaderValue, method, dbPath, body) {
  const res = await fetch(`${couchUrl}${dbPath}`, {
    method,
    headers: {
      Authorization: authHeaderValue,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  return { status: res.status, body: json }
}

async function createDb(couchUrl, authHeaderValue, dbName, dryRun) {
  if (dryRun) {
    console.log(`  [dry-run] would create db ${dbName}`)
    return
  }
  const { status, body } = await couchRequest(
    couchUrl,
    authHeaderValue,
    "PUT",
    `/${dbName}`
  )
  if (status === 201) {
    console.log(`  created db ${dbName}`)
  } else if (status === 412) {
    console.log(`  db ${dbName} already exists, skipping create`)
  } else {
    throw new Error(
      `failed to create db ${dbName}: ${status} ${JSON.stringify(body)}`
    )
  }
}

async function bulkLoad(couchUrl, authHeaderValue, dbName, docs, dryRun) {
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE)
    if (dryRun) {
      console.log(`  [dry-run] would load docs ${i}-${i + batch.length}`)
      continue
    }
    const { status, body } = await couchRequest(
      couchUrl,
      authHeaderValue,
      "POST",
      `/${dbName}/_bulk_docs`,
      { docs: batch, new_edits: false }
    )
    if (status !== 201 && status !== 200) {
      throw new Error(
        `bulk_docs failed for ${dbName} batch ${i}: ${status} ${JSON.stringify(body)}`
      )
    }
    const errors = body.filter(r => r.error)
    console.log(
      `  batch ${i}-${i + batch.length}: ok (${errors.length} errors)`
    )
    if (errors.length) {
      console.log(`  sample errors:`, errors.slice(0, 5))
    }
  }
}

async function importFile(filePath, dbName, opts) {
  console.log(`Importing ${path.basename(filePath)} -> ${dbName}`)
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"))
  if (!Array.isArray(data.rows)) {
    throw new Error(
      `${filePath} does not look like an _all_docs?include_docs=true dump`
    )
  }
  const docs = data.rows.map(row => row.doc)
  console.log(`  ${docs.length} docs to load`)
  await createDb(opts.couchUrl, opts.authHeaderValue, dbName, opts.dryRun)
  await bulkLoad(opts.couchUrl, opts.authHeaderValue, dbName, docs, opts.dryRun)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const authHeaderValue = authHeader(args.user, args.password)
  const opts = { couchUrl: args.couchUrl, authHeaderValue, dryRun: args.dryRun }

  if (args.file) {
    if (!args.db) {
      throw new Error("--file requires --db")
    }
    await importFile(args.file, args.db, opts)
  } else if (args.dir) {
    if (!args.tenant && !args.keepTenant) {
      throw new Error(
        "--dir requires --tenant (or pass --keep-tenant to use filenames as-is)"
      )
    }
    const files = fs.readdirSync(args.dir).filter(f => f.endsWith(".json"))
    for (const filename of files) {
      if (args.skipGlobal && filename.includes("global-db")) {
        console.log(`Skipping ${filename} (--skip-global)`)
        continue
      }
      const dbName = dbNameFromFilename(filename, args.tenant, args.keepTenant)
      await importFile(path.join(args.dir, filename), dbName, opts)
    }
  } else {
    throw new Error("must pass either --dir or --file")
  }

  console.log("Done.")
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
