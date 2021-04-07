const { budibaseTempDir } = require("../budibaseDir")
const { isDev } = require("../index")
const fs = require("fs")
const { join } = require("path")
const uuid = require("uuid/v4")
const CouchDB = require("../../db")
const { ObjectStoreBuckets } = require("../../constants")
const {
  upload,
  retrieve,
  retrieveToTmp,
  streamUpload,
  deleteFolder,
  downloadTarball,
} = require("./utilities")
const { downloadLibraries, newAppPublicPath } = require("./newApp")
const download = require("download")
const env = require("../../environment")
const { homedir } = require("os")
const fetch = require("node-fetch")

const DEFAULT_AUTOMATION_BUCKET =
  "https://prod-budi-automations.s3-eu-west-1.amazonaws.com"
const DEFAULT_AUTOMATION_DIRECTORY = ".budibase-automations"
const TOP_LEVEL_PATH = join(__dirname, "..", "..", "..")
const NODE_MODULES_PATH = join(TOP_LEVEL_PATH, "node_modules")

/**
 * The single stack system (Cloud and Builder) should not make use of the file system where possible,
 * this file handles all of the file access for the system with the intention of limiting it all to one
 * place. Keeping all of this logic in one place means that when we need to do file system access (like
 * downloading a package or opening a temporary file) in can be done in way that we can confirm it shouldn't
 * be done through an object store instead.
 */

/**
 * Upon first startup of instance there may not be everything we need in tmp directory, set it up.
 */
exports.init = () => {
  const tempDir = budibaseTempDir()
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
  }
  const clientLibPath = join(budibaseTempDir(), "budibase-client.js")
  if (env.isTest() && !fs.existsSync(clientLibPath)) {
    fs.copyFileSync(require.resolve("@budibase/client"), clientLibPath)
  }
}

/**
 * Checks if the system is currently in development mode and if it is makes sure
 * everything required to function is ready.
 */
exports.checkDevelopmentEnvironment = () => {
  if (!isDev()) {
    return
  }
  if (!fs.existsSync(budibaseTempDir())) {
    fs.mkdirSync(budibaseTempDir())
  }
  let error
  if (!fs.existsSync(join(process.cwd(), ".env"))) {
    error = "Must run via yarn once to generate environment."
  }
  if (error) {
    console.error(error)
    process.exit(-1)
  }
}

/**
 * This function manages temporary template files which are stored by Koa.
 * @param {Object} template The template object retrieved from the Koa context object.
 * @returns {Object} Returns an fs read stream which can be loaded into the database.
 */
exports.getTemplateStream = async template => {
  if (template.file) {
    return fs.createReadStream(template.file.path)
  } else {
    const tmpPath = await exports.downloadTemplate(...template.key.split("/"))
    return fs.createReadStream(join(tmpPath, "db", "dump.txt"))
  }
}

/**
 * Used to retrieve a handlebars file from the system which will be used as a template.
 * This is allowable as the template handlebars files should be static and identical across
 * the cluster.
 * @param {string} path The path to the handlebars file which is to be loaded.
 * @returns {string} The loaded handlebars file as a string - loaded as utf8.
 */
exports.loadHandlebarsFile = path => {
  return fs.readFileSync(path, "utf8")
}

/**
 * When return a file from the API need to write the file to the system temporarily so we
 * can create a read stream to send.
 * @param {string} contents the contents of the file which is to be returned from the API.
 * @return {Object} the read stream which can be put into the koa context body.
 */
exports.apiFileReturn = contents => {
  const path = join(budibaseTempDir(), uuid())
  fs.writeFileSync(path, contents)
  return fs.createReadStream(path)
}

/**
 * Takes a copy of the database state for an app to the object store.
 * @param {string} appId The ID of the app which is to be backed up.
 * @param {string} backupName The name of the backup located in the object store.
 * @return The backup has been completed when this promise completes and returns a file stream
 * to the temporary backup file (to return via API if required).
 */
exports.performBackup = async (appId, backupName) => {
  const path = join(budibaseTempDir(), backupName)
  const writeStream = fs.createWriteStream(path)
  // perform couch dump
  const instanceDb = new CouchDB(appId)
  await instanceDb.dump(writeStream, {})
  // write the file to the object store
  await streamUpload(
    ObjectStoreBuckets.BACKUPS,
    join(appId, backupName),
    fs.createReadStream(path)
  )
  return fs.createReadStream(path)
}

/**
 * Downloads required libraries and creates a new path in the object store.
 * @param {string} appId The ID of the app which is being created.
 * @return {Promise<void>} once promise completes app resources should be ready in object store.
 */
exports.createApp = async appId => {
  await downloadLibraries(appId)
  await newAppPublicPath(appId)
}

/**
 * Removes all of the assets created for an app in the object store.
 * @param {string} appId The ID of the app which is being deleted.
 * @return {Promise<void>} once promise completes the app resources will be removed from object store.
 */
exports.deleteApp = async appId => {
  await deleteFolder(ObjectStoreBuckets.APPS, `${appId}/`)
}

/**
 * Retrieves a template and pipes it to minio as well as making it available temporarily.
 * @param {string} type The type of template which is to be retrieved.
 * @param name
 * @return {Promise<*>}
 */
exports.downloadTemplate = async (type, name) => {
  const DEFAULT_TEMPLATES_BUCKET =
    "prod-budi-templates.s3-eu-west-1.amazonaws.com"
  const templateUrl = `https://${DEFAULT_TEMPLATES_BUCKET}/templates/${type}/${name}.tar.gz`
  return downloadTarball(templateUrl, ObjectStoreBuckets.TEMPLATES, type)
}

/**
 * Retrieves component libraries from object store (or tmp symlink if in local)
 */
exports.getComponentLibraryManifest = async (appId, library) => {
  const filename = "manifest.json"
  /* istanbul ignore next */
  if (env.isTest() || env.isDev()) {
    const path = join(
      NODE_MODULES_PATH,
      "@budibase",
      "standard-components",
      filename
    )
    // always load from new so that updates are refreshed
    delete require.cache[require.resolve(path)]
    return require(path)
  }
  const path = join(appId, "node_modules", library, "package", filename)
  let resp = await retrieve(ObjectStoreBuckets.APPS, path)
  if (typeof resp !== "string") {
    resp = resp.toString("utf8")
  }
  return JSON.parse(resp)
}

exports.automationInit = async () => {
  const directory =
    env.AUTOMATION_DIRECTORY || join(homedir(), DEFAULT_AUTOMATION_DIRECTORY)
  const bucket = env.AUTOMATION_BUCKET || DEFAULT_AUTOMATION_BUCKET
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
  // env setup to get async packages
  let response = await fetch(`${bucket}/manifest.json`)
  return response.json()
}

exports.getExternalAutomationStep = async (name, version, bundleName) => {
  const directory =
    env.AUTOMATION_DIRECTORY || join(homedir(), DEFAULT_AUTOMATION_DIRECTORY)
  const bucket = env.AUTOMATION_BUCKET || DEFAULT_AUTOMATION_BUCKET
  try {
    return require(join(directory, bundleName))
  } catch (err) {
    await download(`${bucket}/${name}/${version}/${bundleName}`, directory)
    return require(join(directory, bundleName))
  }
}

/**
 * All file reads come through here just to make sure all of them make sense
 * allows a centralised location to check logic is all good.
 */
exports.readFileSync = (filepath, options = "utf8") => {
  return fs.readFileSync(filepath, options)
}

/**
 * Given a set of app IDs makes sure file system is cleared of any of their temp info.
 */
exports.cleanup = appIds => {
  for (let appId of appIds) {
    fs.rmdirSync(join(budibaseTempDir(), appId), { recursive: true })
  }
}

/**
 * Full function definition for below can be found in the utilities.
 */
exports.upload = upload
exports.retrieve = retrieve
exports.retrieveToTmp = retrieveToTmp
exports.TOP_LEVEL_PATH = TOP_LEVEL_PATH
exports.NODE_MODULES_PATH = NODE_MODULES_PATH
