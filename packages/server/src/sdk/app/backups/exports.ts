import { db as dbCore, encryption, objectStore } from "@budibase/backend-core"
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
import { join } from "path"
import env from "../../../environment"
import tarStream from "tar-stream"
import zlib from "zlib"
import { Readable, PassThrough } from "stream"
import { tracer } from "dd-trace"
import { Document } from "@budibase/types"
import { storeTempFileStream } from "../../../utilities/fileSystem"
import fsp from "fs/promises"
import fs from "fs"

export interface ExportOpts {
  gzip?: boolean
  excludeRows?: boolean
  encryptPassword?: string
}

export async function exportApp(
  appId: string,
  config?: ExportOpts
): Promise<Readable> {
  return await tracer.trace("exportApp", async span => {
    const { excludeRows = false, encryptPassword, gzip = true } = config || {}
    const pack = tarStream.pack()

    span.addTags({ excludeRows, gzip })

    const prodAppId = dbCore.getProdAppID(appId)
    const appPath = `${prodAppId}/`
    span.addTags({ prodAppId })

    try {
      await addDatabaseExport(appId, pack, encryptPassword, excludeRows)
      if (!env.isTest()) {
        if (excludeRows) {
          await addStaticFiles(pack, appPath, encryptPassword)
        } else {
          await addAllAppFiles(pack, appPath, encryptPassword)
        }
      }

      pack.finalize()
    } catch (err) {
      pack.destroy(err as Error)
    }

    if (gzip) {
      return pack.pipe(zlib.createGzip())
    }
    return pack
  })
}

async function addDatabaseExport(
  appId: string,
  pack: tarStream.Pack,
  encryptPassword?: string,
  excludeRows = false
) {
  let dbStream = await streamDB(appId, doc => {
    const id = doc._id || ""
    return !(
      id.startsWith(USER_METDATA_PREFIX) ||
      id.startsWith(LINK_USER_METADATA_PREFIX) ||
      id.startsWith(AUTOMATION_LOG_PREFIX) ||
      !!(excludeRows && id.startsWith(TABLE_ROW_PREFIX))
    )
  })
  await addStreamToTar(pack, DB_EXPORT_FILE, dbStream, encryptPassword)
}

async function addStaticFiles(
  pack: tarStream.Pack,
  appPath: string,
  encryptPassword?: string
) {
  for (const path of STATIC_APP_FILES) {
    try {
      const contents = await objectStore.getReadStream(
        ObjectStoreBuckets.APPS,
        join(appPath, path)
      )
      await addStreamToTar(pack, path, contents, encryptPassword)
    } catch (err) {
      console.log(`Skipping missing static file: ${path}`)
    }
  }
}

async function addAllAppFiles(
  pack: tarStream.Pack,
  appPath: string,
  encryptPassword?: string
) {
  for await (const object of objectStore.listAllObjects(
    ObjectStoreBuckets.APPS,
    appPath
  )) {
    const filename = object.Key!
    const path = filename.replace(appPath, "")

    if (path && !path.endsWith("/")) {
      const stream = await objectStore.getReadStream(
        ObjectStoreBuckets.APPS,
        filename
      )

      // Skip encrypting attachments directory (too big to encrypt)
      const shouldEncrypt =
        !!encryptPassword && !path.startsWith(ATTACHMENT_DIRECTORY)

      await addStreamToTar(
        pack,
        path,
        stream,
        shouldEncrypt ? encryptPassword : undefined
      )
    }
  }
}

async function addStreamToTar(
  pack: tarStream.Pack,
  path: string,
  stream: Readable,
  encryptPassword?: string
): Promise<void> {
  if (encryptPassword) {
    stream = encryption.encryptStream(stream, encryptPassword)
  }

  // We need to write out the stream to a tmp file in order for tar-stream to be
  // able to get the size of it. If we pass the stream directly to tar-stream,
  // it always throws a "size mistmatch" error
  const name = encryptPassword ? `${path}.enc` : path
  const tmpPath = await storeTempFileStream(stream)
  const size = (await fsp.stat(tmpPath)).size

  const entry = pack.entry({ name, size })
  for await (const chunk of fs.createReadStream(tmpPath)) {
    entry.write(chunk)
  }
  entry.end()
}

type Filter = (doc: Document) => boolean
async function streamDB(dbName: string, filter?: Filter): Promise<Readable> {
  return dbCore.doWithDB(dbName, async db => {
    const passThrough = new PassThrough()

    const dumpPromise = db.dump(passThrough, {
      filter,
      batch_size: 1000,
      batch_limit: 5,
      style: "main_only",
    })

    dumpPromise.catch(err => {
      if (!passThrough.destroyed) {
        passThrough.destroy(err)
      }
    })

    return passThrough
  })
}
