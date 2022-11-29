import { budibaseTempDir } from "../budibaseDir"
import fs from "fs"
import { join } from "path"
import { context, objectStore } from "@budibase/backend-core"
import { ObjectStoreBuckets } from "../../constants"
import { updateClientLibrary } from "./clientLibrary"
import { checkSlashesInUrl } from "../"
import env from "../../environment"
import fetch from "node-fetch"
const uuid = require("uuid/v4")
const tar = require("tar")

export const TOP_LEVEL_PATH = join(__dirname, "..", "..", "..")
export const NODE_MODULES_PATH = join(TOP_LEVEL_PATH, "node_modules")
const DATASOURCE_PATH = join(budibaseTempDir(), "datasource")

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
export function init() {
  const tempDir = budibaseTempDir()
  if (!fs.existsSync(tempDir)) {
    // some test cases fire this quickly enough that
    // synchronous cases can end up here at the same time
    try {
      fs.mkdirSync(tempDir)
    } catch (err: any) {
      if (!err || err.code !== "EEXIST") {
        throw err
      }
    }
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
  if (!env.isDev() || env.isTest()) {
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
 * Used to retrieve a handlebars file from the system which will be used as a template.
 * This is allowable as the template handlebars files should be static and identical across
 * the cluster.
 * @param {string} path The path to the handlebars file which is to be loaded.
 * @returns {string} The loaded handlebars file as a string - loaded as utf8.
 */
export function loadHandlebarsFile(path: string) {
  return fs.readFileSync(path, "utf8")
}

/**
 * When return a file from the API need to write the file to the system temporarily so we
 * can create a read stream to send.
 * @param {string} contents the contents of the file which is to be returned from the API.
 * @param {string} encoding the encoding of the file to return (utf8 default)
 * @return {Object} the read stream which can be put into the koa context body.
 */
export function apiFileReturn(
  contents: string,
  encoding: BufferEncoding = "utf8"
) {
  const path = join(budibaseTempDir(), uuid())
  fs.writeFileSync(path, contents, { encoding })
  return fs.createReadStream(path, { encoding })
}

export function streamFile(path: string) {
  return fs.createReadStream(path)
}

/**
 * Writes the provided contents to a temporary file, which can be used briefly.
 * @param {string} fileContents contents which will be written to a temp file.
 * @return {string} the path to the temp file.
 */
export function storeTempFile(fileContents: string) {
  const path = join(budibaseTempDir(), uuid())
  fs.writeFileSync(path, fileContents)
  return path
}

/**
 * Utility function for getting a file read stream - a simple in memory buffered read
 * stream doesn't work for pouchdb.
 */
export function stringToFileStream(contents: string) {
  const path = exports.storeTempFile(contents)
  return fs.createReadStream(path)
}

/**
 * Creates a temp file and returns it from the API.
 * @param {string} fileContents the contents to be returned in file.
 */
export function sendTempFile(fileContents: string) {
  const path = exports.storeTempFile(fileContents)
  return fs.createReadStream(path)
}

/**
 * Uploads the latest client library to the object store.
 * @param {string} appId The ID of the app which is being created.
 * @return {Promise<void>} once promise completes app resources should be ready in object store.
 */
export async function createApp(appId: string) {
  await updateClientLibrary(appId)
}

/**
 * Removes all of the assets created for an app in the object store.
 * @param {string} appId The ID of the app which is being deleted.
 * @return {Promise<void>} once promise completes the app resources will be removed from object store.
 */
export async function deleteApp(appId: string) {
  await objectStore.deleteFolder(ObjectStoreBuckets.APPS, `${appId}/`)
}

/**
 * Retrieves a template and pipes it to minio as well as making it available temporarily.
 * @param {string} type The type of template which is to be retrieved.
 * @param name
 * @return {Promise<*>}
 */
export async function downloadTemplate(type: string, name: string) {
  const DEFAULT_TEMPLATES_BUCKET =
    "prod-budi-templates.s3-eu-west-1.amazonaws.com"
  const templateUrl = `https://${DEFAULT_TEMPLATES_BUCKET}/templates/${type}/${name}.tar.gz`
  return objectStore.downloadTarball(
    templateUrl,
    ObjectStoreBuckets.TEMPLATES,
    type
  )
}

/**
 * Retrieves component libraries from object store (or tmp symlink if in local)
 */
export async function getComponentLibraryManifest(library: string) {
  const appId = context.getAppId()
  const filename = "manifest.json"
  /* istanbul ignore next */
  // when testing in cypress and so on we need to get the package
  // as the environment may not be fully fleshed out for dev or prod
  if (env.isTest()) {
    library = library.replace("standard-components", "client")
    const lib = library.split("/")[1]
    const path = require.resolve(library).split(lib)[0]
    return require(join(path, lib, filename))
  } else if (env.isDev()) {
    const path = join(NODE_MODULES_PATH, "@budibase", "client", filename)
    // always load from new so that updates are refreshed
    delete require.cache[require.resolve(path)]
    return require(path)
  }

  if (!appId) {
    throw new Error("No app ID found - cannot get component libraries")
  }

  let resp
  let path
  try {
    // Try to load the manifest from the new file location
    path = join(appId, filename)
    resp = await objectStore.retrieve(ObjectStoreBuckets.APPS, path)
  } catch (error) {
    console.error(
      `component-manifest-objectstore=failed appId=${appId} path=${path}`,
      error
    )
    // Fallback to loading it from the old location for old apps
    path = join(appId, "node_modules", library, "package", filename)
    resp = await objectStore.retrieve(ObjectStoreBuckets.APPS, path)
  }
  if (typeof resp !== "string") {
    resp = resp.toString("utf8")
  }
  return JSON.parse(resp)
}

/**
 * All file reads come through here just to make sure all of them make sense
 * allows a centralised location to check logic is all good.
 */
export function readFileSync(
  filepath: string,
  options: BufferEncoding = "utf8"
) {
  return fs.readFileSync(filepath, { encoding: options })
}

/**
 * Given a set of app IDs makes sure file system is cleared of any of their temp info.
 */
export function cleanup(appIds: string[]) {
  for (let appId of appIds) {
    const path = join(budibaseTempDir(), appId)
    if (fs.existsSync(path)) {
      fs.rmdirSync(path, { recursive: true })
    }
  }
}

export function createTempFolder(item: string) {
  const path = join(budibaseTempDir(), item)
  try {
    // remove old tmp directories automatically - don't combine
    if (fs.existsSync(path)) {
      fs.rmSync(path, { recursive: true, force: true })
    }
    fs.mkdirSync(path)
  } catch (err: any) {
    throw new Error(`Path cannot be created: ${err.message}`)
  }

  return path
}

export async function extractTarball(fromFilePath: string, toPath: string) {
  await tar.extract({
    file: fromFilePath,
    C: toPath,
  })
}

export async function getPluginMetadata(path: string) {
  let metadata: { schema?: any; package?: any } = {}
  try {
    const pkg = fs.readFileSync(join(path, "package.json"), "utf8")
    const schema = fs.readFileSync(join(path, "schema.json"), "utf8")

    metadata.schema = JSON.parse(schema)
    metadata.package = JSON.parse(pkg)

    if (
      !metadata.package.name ||
      !metadata.package.version ||
      !metadata.package.description
    ) {
      throw new Error(
        "package.json is missing one of 'name', 'version' or 'description'."
      )
    }
  } catch (err: any) {
    throw new Error(
      `Unable to process schema.json/package.json in plugin. ${err.message}`
    )
  }

  return { metadata, directory: path }
}

export async function getDatasourcePlugin(
  name: string,
  url: string,
  hash: string
) {
  if (!fs.existsSync(DATASOURCE_PATH)) {
    fs.mkdirSync(DATASOURCE_PATH)
  }
  const filename = join(DATASOURCE_PATH, name)
  const metadataName = `${filename}.bbmetadata`
  if (fs.existsSync(filename)) {
    const currentHash = fs.readFileSync(metadataName, "utf8")
    // if hash is the same return the file, otherwise remove it and re-download
    if (currentHash === hash) {
      return require(filename)
    } else {
      console.log(`Updating plugin: ${name}`)
      delete require.cache[require.resolve(filename)]
      fs.unlinkSync(filename)
    }
  }
  const fullUrl = checkSlashesInUrl(
    `${env.MINIO_URL}/${ObjectStoreBuckets.PLUGINS}/${url}`
  )
  const response = await fetch(fullUrl)
  if (response.status === 200) {
    const content = await response.text()
    fs.writeFileSync(filename, content)
    fs.writeFileSync(metadataName, hash)
    return require(filename)
  } else {
    throw new Error(
      `Unable to retrieve plugin - reason: ${await response.text()}`
    )
  }
}

/**
 * Find for a file recursively from start path applying filter, return first match
 */
export function findFileRec(startPath: string, filter: any) {
  if (!fs.existsSync(startPath)) {
    return
  }

  const files = fs.readdirSync(startPath)
  for (let i = 0, len = files.length; i < len; i++) {
    const filename = join(startPath, files[i])
    const stat = fs.lstatSync(filename)

    if (stat.isDirectory()) {
      return exports.findFileRec(filename, filter)
    } else if (filename.endsWith(filter)) {
      return filename
    }
  }
}

/**
 * Remove a folder which is not empty from the file system
 */
export function deleteFolderFileSystem(path: string) {
  if (!fs.existsSync(path)) {
    return
  }

  fs.rmSync(path, { recursive: true, force: true })
}
