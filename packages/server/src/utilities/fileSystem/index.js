const { budibaseTempDir } = require("../budibaseDir")
const { isDev } = require("../index")
const fs = require("fs")
const { join } = require("path")
const uuid = require("uuid/v4")
const CouchDB = require("../../db")
const { ObjectStoreBuckets } = require("../../constants")
const { streamUpload, deleteFolder, downloadTarball } = require("./utilities")
const { downloadLibraries, newAppPublicPath } = require("./newApp")

/**
 * The single stack system (Cloud and Builder) should not make use of the file system where possible,
 * this file handles all of the file access for the system with the intention of limiting it all to one
 * place. Keeping all of this logic in one place means that when we need to do file system access (like
 * downloading a package or opening a temporary file) in can be done in way that we can confirm it shouldn't
 * be done through an object store instead.
 */

/**
 * Checks if the system is currently in development mode and if it is makes sure
 * everything required to function is ready.
 */
exports.checkDevelopmentEnvironment = () => {
  if (isDev() && !fs.existsSync(budibaseTempDir())) {
    console.error(
      "Please run a build before attempting to run server independently to fill 'tmp' directory."
    )
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

exports.createApp = async appId => {
  await downloadLibraries(appId)
  await newAppPublicPath(appId)
}

exports.deleteApp = async appId => {
  await deleteFolder(ObjectStoreBuckets.APPS, `${appId}/`)
}

exports.downloadTemplate = async (type, name) => {
  const DEFAULT_TEMPLATES_BUCKET =
    "prod-budi-templates.s3-eu-west-1.amazonaws.com"
  const templateUrl = `https://${DEFAULT_TEMPLATES_BUCKET}/templates/${type}/${name}.tar.gz`
  return downloadTarball(templateUrl, ObjectStoreBuckets.TEMPLATES, type)
}

/**
 * All file reads come through here just to make sure all of them make sense
 * allows a centralised location to check logic is all good.
 */
exports.readFileSync = (filepath, options = "utf8") => {
  return fs.readFileSync(filepath, options)
}
