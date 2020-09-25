#!/usr/bin/env node

// Script to export a budibase app into a package
// Usage: foo

const fs = require("fs-extra")
const path = require("path")
const os = require("os")
const replicationStream = require("pouchdb-replication-stream")

const PouchDB = require("../src/db")

PouchDB.plugin(replicationStream.plugin)
PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)

async function exportAppToTemplate({ instanceId, appId, templateName }) {
  // Copy frontend files
  console.log("Copying frontend definition...")
  const appToExport = path.join(os.homedir(), ".budibase", appId, "pages")
  const templateOutputPath = path.join(os.homedir(), ".budibase", templateName)
  fs.copySync(appToExport, `${templateOutputPath}/pages`)

  const writeStream = fs.createWriteStream(`${templateOutputPath}/dump.txt`)

  // perform couch dump
  const instanceDb = new PouchDB(instanceId)

  console.log("Performing database dump..")
  await instanceDb.dump(writeStream)
  console.log("Export complete!")
}

exportAppToTemplate({
  templateName: "Funky",
  instanceId: "inst_b70abba_16feb394866140a1ac3f2e450e99f28a",
  appId: "b70abba3874546bf99a339911b579937",
})
