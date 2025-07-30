import { db as dbCore, encryption, objectStore } from "@budibase/backend-core"
import { budibaseTempDir } from "../../../utilities/budibaseDir"
import { streamFile, createTempFolder } from "../../../utilities/fileSystem"
import { ObjectStoreBuckets } from "../../../constants"
import {
  AUTOMATION_LOG_PREFIX,
  LINK_USER_METADATA_PREFIX,
  TABLE_ROW_PREFIX,
  USER_METDATA_PREFIX,
} from "../../../db/utils"
import {
  DB_EXPORT_FILE,
  STATIC_APP_FILES,
  ATTACHMENT_DIRECTORY,
} from "./constants"
import fs from "fs"
import fsp from "fs/promises"
import { join } from "path"
import env from "../../../environment"
import { v4 as uuid } from "uuid"
import tarStream from "tar-stream"
import zlib from "zlib"
import { pipeline } from "stream/promises"
import { Readable, PassThrough, Transform } from "stream"
import { tracer } from "dd-trace"
import crypto from "crypto"

const MemoryStream = require("memorystream")

// Encryption constants (copied from backend-core/security/encryption.ts)
const ALGO = "aes-256-ctr"
const ITERATIONS = 10000
const STRETCH_LENGTH = 32
const SALT_LENGTH = 16
const IV_LENGTH = 16

/**
 * Helper function to stretch a password using PBKDF2
 */
function stretchString(secret: string, salt: Buffer) {
  return crypto.pbkdf2Sync(secret, salt, ITERATIONS, STRETCH_LENGTH, "sha512")
}

/**
 * Creates a streaming encryption transform that encrypts data on-the-fly
 * This replicates the encryption logic from backend-core but as a stream transform
 */
function createEncryptionTransform(password: string): Transform {
  const salt = crypto.randomBytes(SALT_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)
  const stretched = stretchString(password, salt)
  const cipher = crypto.createCipheriv(ALGO, stretched, iv)

  let headerWritten = false

  return new Transform({
    transform(chunk, encoding, callback) {
      try {
        // Write salt and IV as header on first chunk
        if (!headerWritten) {
          this.push(salt)
          this.push(iv)
          headerWritten = true
        }

        // Encrypt the chunk
        const encrypted = cipher.update(chunk)
        this.push(encrypted)
        callback()
      } catch (err) {
        callback(err)
      }
    },

    flush(callback) {
      try {
        // Finalize the cipher
        const final = cipher.final()
        if (final.length > 0) {
          this.push(final)
        }
        callback()
      } catch (err) {
        callback(err)
      }
    },
  })
}

export interface DBDumpOpts {
  filter?: any
  exportPath?: string
}

export interface ExportOpts extends DBDumpOpts {
  tar?: boolean
  excludeRows?: boolean
  encryptPassword?: string
}

async function tarFilesToTmp(tmpDir: string, files: string[]) {
  const fileName = `${uuid()}.tar.gz`
  const exportFile = join(budibaseTempDir(), fileName)

  const pack = tarStream.pack()
  const gzip = zlib.createGzip()
  const outputStream = fs.createWriteStream(exportFile)

  // Start the pipeline
  const pipelinePromise = pipeline(pack, gzip, outputStream)

  // Add files to the tar stream
  for (const file of files) {
    const filePath = join(tmpDir, file)
    const stat = await fsp.stat(filePath)

    if (stat.isDirectory()) {
      // Recursively add directory contents
      await addDirectoryToTar(pack, filePath, file, tmpDir)
    } else {
      // Add individual file
      const stream = fs.createReadStream(filePath)
      const entry = pack.entry({ name: file, size: stat.size })
      stream.pipe(entry)
    }
  }

  // Finalize the tar and wait for completion
  pack.finalize()
  await pipelinePromise

  return exportFile
}

async function addDirectoryToTar(
  pack: tarStream.Pack,
  dirPath: string,
  relativePath: string,
  basePath: string
) {
  const entries = await fsp.readdir(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    const entryRelativePath = join(relativePath, entry.name)

    if (entry.isDirectory()) {
      await addDirectoryToTar(pack, fullPath, entryRelativePath, basePath)
    } else {
      const stat = await fsp.stat(fullPath)
      const stream = fs.createReadStream(fullPath)
      const entry = pack.entry({ name: entryRelativePath, size: stat.size })
      stream.pipe(entry)
    }
  }
}

/**
 * Exports a DB to either file or a variable (memory).
 * @param dbName the DB which is to be exported.
 * @param opts various options for the export, e.g. whether to stream,
 * a filter function or the name of the export.
 * @return either a readable stream or a string
 */
export async function exportDB(
  dbName: string,
  opts: DBDumpOpts = {}
): Promise<string> {
  const exportOpts = {
    filter: opts?.filter,
    batch_size: 1000,
    batch_limit: 5,
    style: "main_only",
  } as const
  return dbCore.doWithDB(dbName, async db => {
    // Write the dump to file if required
    if (opts?.exportPath) {
      const path = opts?.exportPath
      const writeStream = fs.createWriteStream(path)
      await db.dump(writeStream, exportOpts)
      return path
    } else {
      // Stringify the dump in memory if required
      const memStream = new MemoryStream()
      let appString = ""
      memStream.on("data", (chunk: any) => {
        appString += chunk.toString()
      })
      await db.dump(memStream, exportOpts)
      return appString
    }
  })
}

function defineFilter(excludeRows?: boolean) {
  const ids = [
    USER_METDATA_PREFIX,
    LINK_USER_METADATA_PREFIX,
    AUTOMATION_LOG_PREFIX,
  ]
  if (excludeRows) {
    ids.push(TABLE_ROW_PREFIX)
  }
  return (doc: any) =>
    !ids.map(key => doc._id.includes(key)).reduce((prev, curr) => prev || curr)
}

/**
 * Local utility to back up the database state for an app, excluding global user
 * data or user relationships.
 * @param appId The app to back up
 * @param config Config to send to export DB/attachment export
 * @returns either a string or a stream of the backup
 */
export async function exportApp(appId: string, config?: ExportOpts) {
  return await tracer.trace("exportApp", async span => {
    span.addTags({
      "config.excludeRows": config?.excludeRows,
      "config.tar": config?.tar,
      "config.encryptPassword": !!config?.encryptPassword,
      "config.exportPath": config?.exportPath,
      "config.filter": !!config?.filter,
    })

    const prodAppId = dbCore.getProdAppID(appId)
    const appPath = `${prodAppId}/`
    let tmpPath = createTempFolder(uuid())
    span.addTags({ prodAppId, tmpPath })

    if (!env.isTest()) {
      // write just the static files
      if (config?.excludeRows) {
        for (const path of STATIC_APP_FILES) {
          const contents = await objectStore.retrieve(
            ObjectStoreBuckets.APPS,
            join(appPath, path)
          )
          await fsp.writeFile(join(tmpPath, path), contents)
        }
      }
      // get all the files
      else {
        tmpPath = await objectStore.retrieveDirectory(
          ObjectStoreBuckets.APPS,
          appPath
        )
      }
    }

    const downloadedPath = join(tmpPath, appPath)
    if (fs.existsSync(downloadedPath)) {
      const allFiles = await fsp.readdir(downloadedPath)
      for (let file of allFiles) {
        const path = join(downloadedPath, file)
        // move out of app directory, simplify structure
        await fsp.rename(path, join(downloadedPath, "..", file))
      }
      // remove the old app directory created by object export
      await fsp.rmdir(downloadedPath)
    }
    // enforce an export of app DB to the tmp path
    const dbPath = join(tmpPath, DB_EXPORT_FILE)
    await exportDB(appId, {
      filter: defineFilter(config?.excludeRows),
      exportPath: dbPath,
    })

    if (config?.encryptPassword) {
      for (let file of await fsp.readdir(tmpPath)) {
        const path = join(tmpPath, file)

        // skip the attachments - too big to encrypt
        if (file !== ATTACHMENT_DIRECTORY) {
          await encryption.encryptFile(
            { dir: tmpPath, filename: file },
            config.encryptPassword
          )
          await fsp.rm(path)
        }
      }
    }

    // if tar requested, return where the tarball is
    if (config?.tar) {
      // now the tmpPath contains both the DB export and attachments, tar this
      const tarPath = await tarFilesToTmp(tmpPath, await fsp.readdir(tmpPath))
      // cleanup the tmp export files as tarball returned
      await fsp.rm(tmpPath, { recursive: true, force: true })

      return tarPath
    }
    // tar not requested, turn the directory where export is
    else {
      return tmpPath
    }
  })
}

/**
 * Streaming version of exportApp that directly streams files into a tar pack without temp files
 * @param appId The app to back up
 * @param pack The tar-stream pack to add files to
 * @param config Config for the export
 * @returns Promise that resolves when all files have been added to the pack
 */
async function streamExportAppToTar(
  appId: string,
  pack: tarStream.Pack,
  config?: ExportOpts
) {
  return await tracer.trace("streamExportAppToTar", async span => {
    span.addTags({
      "config.excludeRows": config?.excludeRows,
      "config.encryptPassword": !!config?.encryptPassword,
      "config.filter": !!config?.filter,
    })

    // Note: Individual file encryption within tar is not implemented for streaming
    // The entire tar stream can be encrypted instead via streamExportAppDirect

    const prodAppId = dbCore.getProdAppID(appId)
    const appPath = `${prodAppId}/`
    span.addTags({ prodAppId })

    // Stream database export directly
    const dbStream = await streamDB(appId, {
      filter: defineFilter(config?.excludeRows),
    })
    const dbEntry = pack.entry({ name: DB_EXPORT_FILE })
    dbStream.pipe(dbEntry)

    if (!env.isTest()) {
      if (config?.excludeRows) {
        // Stream only static files from object store
        for (const path of STATIC_APP_FILES) {
          try {
            const contents = await objectStore.retrieve(
              ObjectStoreBuckets.APPS,
              join(appPath, path)
            )

            if (typeof contents === "string") {
              const entry = pack.entry({
                name: path,
                size: Buffer.byteLength(contents),
              })
              entry.end(contents)
            } else if (contents instanceof Readable) {
              // For streams, we can't know the size ahead of time, so we'll stream directly
              const entry = pack.entry({ name: path })
              contents.pipe(entry)
            }
          } catch (err) {
            // Skip missing static files
            console.log(`Skipping missing static file: ${path}`)
          }
        }
      } else {
        // Stream all files from object store directory
        await streamDirectoryFromObjectStore(
          pack,
          ObjectStoreBuckets.APPS,
          appPath
        )
      }
    }

    span.addTags({ streamingComplete: true })
  })
}

/**
 * Stream database export directly as a readable stream
 */
async function streamDB(
  dbName: string,
  opts: { filter?: any } = {}
): Promise<Readable> {
  const exportOpts = {
    filter: opts?.filter,
    batch_size: 1000,
    batch_limit: 5,
    style: "main_only",
  } as const

  return dbCore.doWithDB(dbName, async db => {
    const passThrough = new PassThrough()
    // Start the dump in background
    db.dump(passThrough, exportOpts).catch(err => {
      passThrough.destroy(err)
    })
    return passThrough
  })
}

/**
 * Stream all files from an object store directory directly into tar pack
 */
async function streamDirectoryFromObjectStore(
  pack: tarStream.Pack,
  bucketName: string,
  path: string
) {
  return await tracer.trace("streamDirectoryFromObjectStore", async span => {
    span.addTags({ bucketName, path })

    let numObjects = 0

    // Use the listAllObjects generator to stream files
    for await (const object of objectStore.listAllObjects(bucketName, path)) {
      numObjects++
      await tracer.trace(
        "streamDirectoryFromObjectStore.object",
        async span => {
          const filename = object.Key!
          span.addTags({ filename })

          try {
            const stream = await objectStore.getReadStream(bucketName, filename)
            const relativePath = filename.replace(path, "")

            if (relativePath && !relativePath.endsWith("/")) {
              const entry = pack.entry({
                name: relativePath,
                size: object.Size || 0,
              })
              stream.pipe(entry)

              // Wait for stream to complete
              await new Promise((resolve, reject) => {
                entry.on("finish", resolve)
                entry.on("error", reject)
                stream.on("error", reject)
              })
            }
          } catch (err) {
            console.log(`Error streaming object ${filename}:`, err)
          }
        }
      )
    }

    span.addTags({ numObjects })
  })
}

/**
 * Streams a backup of the database state for an app directly without temp files
 * @param appId The ID of the app which is to be backed up.
 * @param excludeRows Flag to state whether the export should include data.
 * @param encryptPassword password for encrypting the export.
 * @returns a readable stream of the backup which is written in real time
 */
export async function streamExportAppDirect({
  appId,
  excludeRows,
  encryptPassword,
}: {
  appId: string
  excludeRows: boolean
  encryptPassword?: string
}): Promise<Readable> {
  return await tracer.trace("streamExportAppDirect", async span => {
    span.addTags({
      excludeRows: excludeRows,
      encryptPassword: !!encryptPassword,
    })

    const pack = tarStream.pack()
    const gzip = zlib.createGzip({
      level: zlib.constants.Z_DEFAULT_COMPRESSION,
      chunkSize: 16 * 1024, // 16KB chunks for better memory usage
    })

    // Create final output stream - either encrypted or plain gzipped
    const finalStream: Readable = encryptPassword
      ? gzip.pipe(createEncryptionTransform(encryptPassword))
      : gzip

    // Set up pipeline with error handling
    pipeline(pack, gzip).catch(err => {
      console.log("Archive pipeline error:", err)
      finalStream.destroy(err)
    })

    // Process app export asynchronously after returning the stream
    setImmediate(async () => {
      try {
        // Stream files directly without using temp directories
        await streamExportAppToTar(appId, pack, {
          excludeRows,
          encryptPassword,
        })

        pack.finalize()
      } catch (err) {
        console.log("Export processing error:", err)
        if (!finalStream.destroyed) {
          finalStream.destroy(
            err instanceof Error ? err : new Error(String(err))
          )
        }
      }
    })

    return finalStream
  })
}

/**
 * Streams a backup of the database state for an app (legacy - uses temp files)
 * @param appId The ID of the app which is to be backed up.
 * @param excludeRows Flag to state whether the export should include data.
 * @param encryptPassword password for encrypting the export.
 * @returns a readable stream of the backup which is written in real time
 */
export async function streamExportApp({
  appId,
  excludeRows,
  encryptPassword,
}: {
  appId: string
  excludeRows: boolean
  encryptPassword?: string
}) {
  const tmpPath = await exportApp(appId, {
    excludeRows,
    tar: true,
    encryptPassword,
  })
  return streamFile(tmpPath)
}
