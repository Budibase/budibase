const path = require("path")
const fs = require("fs-extra")
const os = require("os")
const fetch = require("node-fetch")
const stream = require("stream")
const tar = require("tar-fs")
const zlib = require("zlib")
const { promisify } = require("util")
const streamPipeline = promisify(stream.pipeline)
const { budibaseAppsDir } = require("./budibaseDir")
const CouchDB = require("../db")

const DEFAULT_TEMPLATES_BUCKET =
  "prod-budi-templates.s3-eu-west-1.amazonaws.com"

exports.downloadTemplate = async function(type, name) {
  const templateUrl = `https://${DEFAULT_TEMPLATES_BUCKET}/templates/${type}/${name}.tar.gz`
  const response = await fetch(templateUrl)

  if (!response.ok) {
    throw new Error(
      `Error downloading template ${type}:${name}: ${response.statusText}`
    )
  }

  // stream the response, unzip and extract
  await streamPipeline(
    response.body,
    zlib.Unzip(),
    tar.extract(path.join(budibaseAppsDir(), "templates", type))
  )

  return path.join(budibaseAppsDir(), "templates", type, name)
}

exports.exportTemplateFromApp = async function({
  appId,
  templateName,
  instanceId,
}) {
  // Copy frontend files
  const appToExport = path.join(os.homedir(), ".budibase", appId, "pages")
  const templatesDir = path.join(os.homedir(), ".budibase", "templates")
  fs.ensureDirSync(templatesDir)

  const templateOutputPath = path.join(templatesDir, templateName)
  fs.copySync(appToExport, `${templateOutputPath}/pages`)

  fs.ensureDirSync(path.join(templateOutputPath, "db"))
  const writeStream = fs.createWriteStream(`${templateOutputPath}/db/dump.txt`)

  // perform couch dump
  const instanceDb = new CouchDB(instanceId)

  await instanceDb.dump(writeStream)
  return templateOutputPath
}
