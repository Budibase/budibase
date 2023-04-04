import { PathLike } from "fs"
import fs from "fs"
import { budibaseTempDir } from "../budibaseDir"
import { join } from "path"
import env from "../../environment"
import tar from "tar"
const uuid = require("uuid/v4")

export const TOP_LEVEL_PATH = join(__dirname, "..", "..", "..")

/**
 * Upon first startup of instance there may not be everything we need in tmp directory, set it up.
 */
export const init = () => {
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
}

/**
 * Checks if the system is currently in development mode and if it is makes sure
 * everything required to function is ready.
 */
export const checkDevelopmentEnvironment = () => {
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
export const loadHandlebarsFile = (path: PathLike) => {
  return fs.readFileSync(path, "utf8")
}

/**
 * When return a file from the API need to write the file to the system temporarily so we
 * can create a read stream to send.
 * @param {string} contents the contents of the file which is to be returned from the API.
 * @return {Object} the read stream which can be put into the koa context body.
 */
export const apiFileReturn = (contents: any) => {
  const path = join(budibaseTempDir(), uuid())
  fs.writeFileSync(path, contents)
  return fs.createReadStream(path)
}

export const streamFile = (path: string) => {
  return fs.createReadStream(path)
}

/**
 * Writes the provided contents to a temporary file, which can be used briefly.
 * @param {string} fileContents contents which will be written to a temp file.
 * @return {string} the path to the temp file.
 */
export const storeTempFile = (fileContents: any) => {
  const path = join(budibaseTempDir(), uuid())
  fs.writeFileSync(path, fileContents)
  return path
}

/**
 * Utility function for getting a file read stream - a simple in memory buffered read
 * stream doesn't work for pouchdb.
 */
export const stringToFileStream = (contents: any) => {
  const path = storeTempFile(contents)
  return fs.createReadStream(path)
}

/**
 * Creates a temp file and returns it from the API.
 * @param {string} fileContents the contents to be returned in file.
 */
export const sendTempFile = (fileContents: any) => {
  const path = storeTempFile(fileContents)
  return fs.createReadStream(path)
}

/**
 * All file reads come through here just to make sure all of them make sense
 * allows a centralised location to check logic is all good.
 */
export const readFileSync = (filepath: PathLike, options = "utf8") => {
  // @ts-ignore
  return fs.readFileSync(filepath, options)
}

export const createTempFolder = (item: any) => {
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

export const extractTarball = async (fromFilePath: string, toPath: string) => {
  await tar.extract({
    file: fromFilePath,
    C: toPath,
  })
}

/**
 * Find for a file recursively from start path applying filter, return first match
 */
export const findFileRec = (startPath: PathLike, filter: string): any => {
  if (!fs.existsSync(startPath)) {
    return
  }

  const files = fs.readdirSync(startPath)
  for (let i = 0, len = files.length; i < len; i++) {
    // @ts-ignore
    const filename = join(startPath, files[i])
    const stat = fs.lstatSync(filename)

    if (stat.isDirectory()) {
      return findFileRec(filename, filter)
    } else if (filename.endsWith(filter)) {
      return filename
    }
  }
}

/**
 * Remove a folder which is not empty from the file system
 */
export const deleteFolderFileSystem = (path: PathLike) => {
  if (!fs.existsSync(path)) {
    return
  }

  fs.rmSync(path, { recursive: true, force: true })
}
