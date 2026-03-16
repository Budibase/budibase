import fs, { PathLike } from "fs"
import { budibaseTempDir } from "../budibaseDir"
import { basename, isAbsolute, join, relative, resolve, sep } from "path"
import env from "../../environment"
import * as tar from "tar"

import { v4 as uuid } from "uuid"

export const TOP_LEVEL_PATH = env.TOP_LEVEL_PATH
export const DEV_ASSET_PATH = join(TOP_LEVEL_PATH, "packages", "server")

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
  if (!fs.existsSync(join(TOP_LEVEL_PATH, ".env"))) {
    error = "Must run via yarn once to generate environment."
  }
  if (error) {
    console.error("Error during development environment check", error)
    process.exit(-1)
  }
}

/**
 * Used to retrieve a handlebars file from the system which will be used as a template.
 * This is allowable as the template handlebars files should be static and identical across
 * the cluster.
 * @param path The path to the handlebars file which is to be loaded.
 * @returns The loaded handlebars file as a string - loaded as utf8.
 */
export const loadHandlebarsFile = (path: PathLike) => {
  return fs.readFileSync(path, "utf8")
}

/**
 * When return a file from the API need to write the file to the system temporarily so we
 * can create a read stream to send.
 * @param contents the contents of the file which is to be returned from the API.
 * @return the read stream which can be put into the koa context body.
 */
export const apiFileReturn = (contents: string | NodeJS.ArrayBufferView) => {
  const path = join(budibaseTempDir(), uuid())
  fs.writeFileSync(path, contents)
  return fs.createReadStream(path)
}

export const streamFile = (path: string) => {
  return fs.createReadStream(path)
}

const sanitizeTempFolderPrefix = (item: string) => {
  const prefix = basename(item).replace(/[^a-zA-Z0-9._-]/g, "-")
  return prefix.length ? prefix : "tmp"
}

const assertWithinTempDir = (path: string) => {
  const tempDir = resolve(budibaseTempDir())
  const resolvedPath = resolve(path)
  const relativePath = relative(tempDir, resolvedPath)

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  ) {
    throw new Error("Path must be within the Budibase temp directory.")
  }

  return resolvedPath
}

export const createTempFolder = (item: string) => {
  const path = fs.mkdtempSync(
    join(budibaseTempDir(), `${sanitizeTempFolderPrefix(item)}-`)
  )
  try {
    return assertWithinTempDir(path)
  } catch (err: any) {
    fs.rmSync(path, { recursive: true, force: true })
    throw new Error(`Path cannot be created: ${err.message}`)
  }
}

export const extractTarball = async (fromFilePath: string, toPath: string) => {
  const safePath = assertWithinTempDir(toPath)
  await tar.extract({
    file: fromFilePath,
    C: safePath,
  })
}

/**
 * Find for a file recursively from start path applying filter, return first match
 */
export const findFileRec = (
  startPath: PathLike,
  filter: string
): string | undefined => {
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
export const deleteFolderFileSystem = (path: string) => {
  const safePath = assertWithinTempDir(path)

  if (!fs.existsSync(safePath)) {
    return
  }

  fs.rmSync(safePath, { recursive: true, force: true })
}
