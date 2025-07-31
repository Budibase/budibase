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

export interface DBDumpOpts {
  filter?: any
  exportPath?: string
}

export interface ExportOpts extends DBDumpOpts {
  tar?: boolean
  excludeRows?: boolean
  encryptPassword?: string
}

export async function exportApp(
  appId: string,
  config?: ExportOpts
): Promise<Readable> {
  return await tracer.trace("streamExportApp", async span => {
    const { excludeRows, encryptPassword, filter } = config || {}
    const pack = tarStream.pack()

    span.addTags({ excludeRows, encryptPassword, filter })

    const prodAppId = dbCore.getProdAppID(appId)
    const appPath = `${prodAppId}/`
    span.addTags({ prodAppId })

    const dbStream = await streamDB(appId, doc => {
      const id = doc._id || ""
      return (
        id.startsWith(USER_METDATA_PREFIX) ||
        id.startsWith(LINK_USER_METADATA_PREFIX) ||
        id.startsWith(AUTOMATION_LOG_PREFIX) ||
        !!(excludeRows && id.startsWith(TABLE_ROW_PREFIX))
      )
    })

    if (encryptPassword) {
      encryption
        .encryptStream(dbStream, encryptPassword)
        .pipe(pack.entry({ name: `${DB_EXPORT_FILE}.enc` }))
    } else {
      dbStream.pipe(pack.entry({ name: DB_EXPORT_FILE }))
    }

    if (env.isTest()) {
      // In tests, we don't stream static files, just the DB export
      span.addTags({ streamingComplete: true })
      pack.finalize()
      return pack.pipe(zlib.createGzip())
    }

    if (excludeRows) {
      for (const path of STATIC_APP_FILES) {
        try {
          const contents = await objectStore.getReadStream(
            ObjectStoreBuckets.APPS,
            join(appPath, path)
          )

          if (encryptPassword) {
            encryption
              .encryptStream(contents, encryptPassword)
              .pipe(pack.entry({ name: `${path}.enc` }))
          } else {
            contents.pipe(pack.entry({ name: path }))
          }
        } catch (err) {
          console.log(`Skipping missing static file: ${path}`)
        }
      }
    } else {
      for await (const object of objectStore.listAllObjects(
        ObjectStoreBuckets.APPS,
        appPath
      )) {
        const filename = object.Key!
        const stream = await objectStore.getReadStream(
          ObjectStoreBuckets.APPS,
          filename
        )
        const path = filename.replace(appPath, "")

        if (path && !path.endsWith("/")) {
          // Skip encrypting attachments directory (too big to encrypt)
          const shouldEncrypt =
            !!encryptPassword && !path.startsWith(ATTACHMENT_DIRECTORY)

          if (shouldEncrypt) {
            encryption
              .encryptStream(stream, encryptPassword)
              .pipe(pack.entry({ name: `${path}.enc` }))
          } else {
            stream.pipe(pack.entry({ name: path }))
          }
        }
      }
    }

    pack.finalize()
    return pack.pipe(zlib.createGzip())
  })
}

type Filter = (doc: Document) => boolean
async function streamDB(dbName: string, filter?: Filter): Promise<Readable> {
  return dbCore.doWithDB(dbName, async db => {
    const passThrough = new PassThrough()
    db.dump(passThrough, {
      filter,
      batch_size: 1000,
      batch_limit: 5,
      style: "main_only",
    }).catch(err => {
      passThrough.destroy(err)
    })
    return passThrough
  })
}
