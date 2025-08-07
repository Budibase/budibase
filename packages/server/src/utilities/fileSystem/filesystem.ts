import fs, { PathLike } from "fs"
import fsp from "fs/promises"
import { budibaseTempDir } from "../budibaseDir"
import { join } from "path"
import env from "../../environment"
import tar from "tar-stream"
import zlib from "zlib"
import { pipeline } from "stream/promises"

import { v4 as uuid } from "uuid"
import { Readable } from "stream"

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
 * @param fileContents contents which will be written to a temp file.
 * @return the path to the temp file.
 */
export const storeTempFile = (
  fileContents: string | NodeJS.ArrayBufferView
) => {
  const path = join(budibaseTempDir(), uuid())
  fs.writeFileSync(path, fileContents)
  return path
}

export const storeTempFileStream = async (stream: Readable) => {
  const path = join(budibaseTempDir(), uuid())
  const writeStream = fs.createWriteStream(path)

  try {
    await pipeline(stream, writeStream)
    return path
  } catch (err) {
    // Clean up the potentially corrupted temp file
    try {
      const stat = await fsp.stat(path)
      if (stat.isFile()) {
        await fsp.unlink(path)
      }
    } catch (cleanupErr) {
      // Ignore cleanup errors, focus on original error
    }
    throw err
  }
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
 * @param fileContents the contents to be returned in file.
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

export const extractTarball = async (from: string, to: string) => {
  const extract = tar.extract()

  let read: Readable = fs.createReadStream(from)
  if (await isGzip(read)) {
    read = read.pipe(zlib.createGunzip())
  }
  read.pipe(extract)

  for await (const entry of extract) {
    const {
      header: { name, type },
    } = entry
    const path = join(to, name)

    if (type === "directory") {
      await fs.promises.mkdir(path, { recursive: true })
    } else if (type === "file" || type === "contiguous-file") {
      await fs.promises.mkdir(join(path, ".."), { recursive: true })
      await fsp.writeFile(path, entry, "binary")
    }

    entry.resume()
  }
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

/**
 * Peek at the next chunk of data in the stream without consuming it.
 * @param input The input stream to read from.
 * @param length The number of bytes to peek.
 * @returns A promise that resolves to the peeked data.
 */
export async function peek(input: Readable, length: number): Promise<Buffer> {
  // Try synchronous read first
  const immediateBuffer = input.read(length)
  if (immediateBuffer) {
    input.unshift(immediateBuffer)
    return immediateBuffer
  }

  // If not available immediately, we need to collect chunks
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    let totalLength = 0

    const cleanup = () => {
      input.removeListener("readable", onReadable)
      input.removeListener("end", onEnd)
      input.removeListener("error", onError)
    }

    const onReadable = () => {
      let chunk: Buffer

      while ((chunk = input.read()) !== null) {
        chunks.push(new Uint8Array(chunk))
        totalLength += chunk.length

        // If we have enough data, stop reading
        if (totalLength >= length) {
          cleanup()

          // Put all chunks back in reverse order
          for (let i = chunks.length - 1; i >= 0; i--) {
            input.unshift(Buffer.from(chunks[i]))
          }

          const combined = Buffer.concat(chunks)
          resolve(combined.subarray(0, length))
          return
        }
      }

      // If we get here, we don't have enough data yet
      // The readable event will fire again when more data is available
    }

    const onEnd = () => {
      cleanup()

      if (chunks.length === 0) {
        reject(new Error("Stream ended with no data"))
        return
      }

      // Stream ended, can't put data back, just return what we could read
      const combined = Buffer.concat(chunks)
      resolve(combined)
    }

    const onError = (err: Error) => {
      cleanup()
      reject(err)
    }

    input.on("readable", onReadable)
    input.on("end", onEnd)
    input.on("error", onError)

    // Try reading immediately in case data is already buffered
    onReadable()
  })
}

export async function isGzip(input: Readable) {
  return (await peek(input, 2)).toString("hex") === "1f8b" // Gzip magic number
}

export async function isTar(input: Readable) {
  const chunk = await peek(input, 262)
  const magic = chunk.toString("utf8", 257, 262)
  return magic === "ustar"
}
