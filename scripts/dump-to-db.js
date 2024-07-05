const fs = require("fs")
const dotenv = require("dotenv")
const { join } = require("path")

const serverDir = join(__dirname, "..", "packages", "server")
dotenv.config({ path: join(serverDir, ".env") })
const { db, objectStore } = require("@budibase/backend-core")

const dump = process.argv[2]
let dbName

if (!dump) {
  console.error("Unable to operate without a dump file")
  process.exit(-1)
}

async function run() {
  let rows = []
  try {
    const dumpContents = fs.readFileSync(dump, "utf8")
    const json = JSON.parse(dumpContents)
    rows = json.rows.map(row => {
      delete row.doc._rev
      return row.doc
    })
  } catch (err) {
    console.error("Invalid filepath to dump, or not valid JSON")
    process.exit(-1)
  }

  const metadata = rows.find(row => row._id === "app_metadata")
  dbName = metadata.appId
  const uuid = dbName.split("_").pop()
  dbName = db.APP_DEV_PREFIX + uuid
  const prodDbName = db.APP_PREFIX + uuid
  metadata.appId = dbName
  metadata.instance._id = dbName

  db.init()
  const database = db.getDB(dbName)
  await database.bulkDocs(rows)
  // upload object store components
  await objectStore.upload({
    bucket: objectStore.ObjectStoreBuckets.APPS,
    filename: `${prodDbName}/budibase-client.js`,
    path: join(serverDir, "client", "budibase-client.js"),
  })
  await objectStore.upload({
    bucket: objectStore.ObjectStoreBuckets.APPS,
    filename: `${prodDbName}/manifest.json`,
    path: join(serverDir, "client", "manifest.json"),
  })
}

run()
  .then(() => {
    console.log(`Documents written - ${dbName} updated`)
  })
  .catch(err => {
    console.error(`Error occurred: ${err.message}`)
    process.exit(-1)
  })
