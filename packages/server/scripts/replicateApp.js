/**
 * Script to replicate your PouchDb (in your home directory) to a remote CouchDB
 * USAGE...
 * node scripts/replicateApp <app_name> <remote_url>
 * e.g. node scripts/replicateApp Mike http://admin:password@127.0.0.1:5984
 */

const { resolve, join } = require("path")
const { homedir } = require("os")
const budibaseDir = join(homedir(), ".budibase")
process.env.BUDIBASE_DIR = budibaseDir
require("dotenv").config({ path: resolve(budibaseDir, ".env") })
const env = require("../src/environment")
const CouchDB = require("../src/db")
const clientDbName = require("../src/db/clientDb").name(env.CLIENT_ID)

const appName = process.argv[2].toLowerCase()
const remoteUrl = process.argv[3]

console.log(`Replicating from ${appName} to ${remoteUrl}/${appName}`)

const run = async () => {
  const clientDb = new CouchDB(clientDbName)

  const body = await clientDb.query("client/by_type", {
    include_docs: true,
    key: ["app"],
  })

  const app = body.rows
    .map(r => r.doc)
    .find(a => a.name == appName || a.name.toLowerCase() === appName)

  if (!app) {
    console.log(
      `Could not find app... apps: ${body.rows.map(r => r.doc.name).join(", ")}`
    )
    return
  }

  const devInstance = app.instances.find(i => i.name === `dev-${env.CLIENT_ID}`)

  const instanceDb = new CouchDB(devInstance._id)
  const remoteDb = new CouchDB(`${remoteUrl}/${appName}`)

  instanceDb.replicate
    .to(remoteDb)
    .on("complete", function() {
      console.log("SUCCESS!")
    })
    .on("error", function(err) {
      console.log(`FAILED: ${err}`)
    })
}

run()
