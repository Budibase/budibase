const fs = require("fs-extra")
const { join } = require("./centralPath")
const os = require("os")
const fetch = require("node-fetch")
const stream = require("stream")
const tar = require("tar-fs")
const zlib = require("zlib")
const { promisify } = require("util")
const streamPipeline = promisify(stream.pipeline)
const { budibaseAppsDir } = require("./budibaseDir")
const env = require("../environment")
const CouchDB = require("../db")
const { DocumentTypes } = require("../db/utils")

const DEFAULT_TEMPLATES_BUCKET =
  "prod-budi-templates.s3-eu-west-1.amazonaws.com"

exports.getLocalTemplates = function() {
  const templatesDir = join(os.homedir(), ".budibase", "templates", "app")
  const templateObj = { app: {} }
  fs.ensureDirSync(templatesDir)
  const templateNames = fs.readdirSync(templatesDir)
  for (let name of templateNames) {
    templateObj.app[name] = {
      name,
      category: "local",
      description: "local template",
      type: "app",
      key: `app/${name}`,
    }
  }
  return templateObj
}

exports.downloadTemplate = async function(type, name) {
  const dirName = join(budibaseAppsDir(), "templates", type, name)
  if (env.LOCAL_TEMPLATES) {
    return dirName
  }
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
    tar.extract(join(budibaseAppsDir(), "templates", type))
  )

  return dirName
}

async function performDump({ dir, appId, name = "dump.txt" }) {
  const writeStream = fs.createWriteStream(join(dir, name))
  // perform couch dump
  const instanceDb = new CouchDB(appId)
  await instanceDb.dump(writeStream, {
    filter: doc => {
      return !doc._id.startsWith(DocumentTypes.USER)
    },
  })
}

exports.performDump = performDump

exports.exportTemplateFromApp = async function({ templateName, appId }) {
  // Copy frontend files
  const templatesDir = join(
    os.homedir(),
    ".budibase",
    "templates",
    "app",
    templateName,
    "db"
  )
  fs.ensureDirSync(templatesDir)
  await performDump({ dir: templatesDir, appId })
  return templatesDir
}
