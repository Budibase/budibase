import Nano from "@budibase/nano"
import {
  AllDocsResponse,
  AnyDocument,
  Database,
  DatabaseOpts,
  DatabaseQueryOpts,
  DatabasePutOpts,
  DatabaseCreateIndexOpts,
  DatabaseDeleteIndexOpts,
  Document,
  isDocument,
  RowResponse,
  RowValue,
} from "@budibase/types"
import { getCouchInfo } from "./connections"
import { directCouchUrlCall } from "./utils"
import { getPouchDB } from "./pouchDB"
import { WriteStream, ReadStream } from "fs"
import { newid } from "../../docIds/newid"
import { SQLITE_DESIGN_DOC_ID } from "../../constants"
import { DDInstrumentedDatabase } from "../instrumentation"

const DATABASE_NOT_FOUND = "Database does not exist."

function buildNano(couchInfo: { url: string; cookie: string }) {
  return Nano({
    url: couchInfo.url,
    requestDefaults: {
      headers: {
        Authorization: couchInfo.cookie,
      },
    },
    parseUrl: false,
  })
}

type DBCall<T> = () => Promise<T>

export function DatabaseWithConnection(
  dbName: string,
  connection: string,
  opts?: DatabaseOpts
) {
  const db = new DatabaseImpl(dbName, opts, connection)
  return new DDInstrumentedDatabase(db)
}

export class DatabaseImpl implements Database {
  public readonly name: string
  private static nano: Nano.ServerScope
  private readonly instanceNano?: Nano.ServerScope
  private readonly pouchOpts: DatabaseOpts

  private readonly couchInfo = getCouchInfo()

  constructor(dbName: string, opts?: DatabaseOpts, connection?: string) {
    this.name = dbName
    this.pouchOpts = opts || {}
    if (connection) {
      this.couchInfo = getCouchInfo(connection)
      this.instanceNano = buildNano(this.couchInfo)
    }
    if (!DatabaseImpl.nano) {
      DatabaseImpl.init()
    }
  }

  static init() {
    const couchInfo = getCouchInfo()
    DatabaseImpl.nano = buildNano(couchInfo)
  }

  async exists() {
    const response = await directCouchUrlCall({
      url: `${this.couchInfo.url}/${this.name}`,
      method: "HEAD",
      cookie: this.couchInfo.cookie,
    })
    return response.status === 200
  }

  private nano() {
    return this.instanceNano || DatabaseImpl.nano
  }

  private getDb() {
    return this.nano().db.use(this.name)
  }

  private async checkAndCreateDb() {
    let shouldCreate = !this.pouchOpts?.skip_setup
    // check exists in a lightweight fashion
    let exists = await this.exists()
    if (!shouldCreate && !exists) {
      throw new Error("DB does not exist")
    }
    if (!exists) {
      try {
        await this.nano().db.create(this.name)
      } catch (err: any) {
        // Handling race conditions
        if (err.statusCode !== 412) {
          throw err
        }
      }
    }
    return this.getDb()
  }

  // this function fetches the DB and handles if DB creation is needed
  private async performCall<T>(
    call: (db: Nano.DocumentScope<any>) => Promise<DBCall<T>> | DBCall<T>
  ): Promise<any> {
    const db = this.getDb()
    const fnc = await call(db)
    try {
      return await fnc()
    } catch (err: any) {
      if (err.statusCode === 404 && err.reason === DATABASE_NOT_FOUND) {
        await this.checkAndCreateDb()
        return await this.performCall(call)
      } else if (err.statusCode) {
        err.status = err.statusCode
      }
      throw err
    }
  }

  async get<T extends Document>(id?: string): Promise<T> {
    return this.performCall(db => {
      if (!id) {
        throw new Error("Unable to get doc without a valid _id.")
      }
      return () => db.get(id)
    })
  }

  async getMultiple<T extends Document>(
    ids: string[],
    opts?: { allowMissing?: boolean }
  ): Promise<T[]> {
    // get unique
    ids = [...new Set(ids)]
    const response = await this.allDocs<T>({
      keys: ids,
      include_docs: true,
    })
    const rowUnavailable = (row: RowResponse<T>) => {
      // row is deleted - key lookup can return this
      if (row.doc == null || ("deleted" in row.value && row.value.deleted)) {
        return true
      }
      return row.error === "not_found"
    }

    const rows = response.rows.filter(row => !rowUnavailable(row))
    const someMissing = rows.length !== response.rows.length
    // some were filtered out - means some missing
    if (!opts?.allowMissing && someMissing) {
      const missing = response.rows.filter(row => rowUnavailable(row))
      const missingIds = missing.map(row => row.key).join(", ")
      throw new Error(`Unable to get documents: ${missingIds}`)
    }
    return rows.map(row => row.doc!)
  }

  async remove(idOrDoc: string | Document, rev?: string) {
    return this.performCall(db => {
      let _id: string
      let _rev: string

      if (isDocument(idOrDoc)) {
        _id = idOrDoc._id!
        _rev = idOrDoc._rev!
      } else {
        _id = idOrDoc
        _rev = rev!
      }

      if (!_id || !_rev) {
        throw new Error("Unable to remove doc without a valid _id and _rev.")
      }
      return () => db.destroy(_id, _rev)
    })
  }

  async post(document: AnyDocument, opts?: DatabasePutOpts) {
    if (!document._id) {
      document._id = newid()
    }
    return this.put(document, opts)
  }

  async put(document: AnyDocument, opts?: DatabasePutOpts) {
    if (!document._id) {
      throw new Error("Cannot store document without _id field.")
    }
    return this.performCall(async db => {
      if (!document.createdAt) {
        document.createdAt = new Date().toISOString()
      }
      document.updatedAt = new Date().toISOString()
      if (opts?.force && document._id) {
        try {
          const existing = await this.get(document._id)
          if (existing) {
            document._rev = existing._rev
          }
        } catch (err: any) {
          if (err.status !== 404) {
            throw err
          }
        }
      }
      return () => db.insert(document)
    })
  }

  async bulkDocs(documents: AnyDocument[]) {
    return this.performCall(db => {
      return () => db.bulk({ docs: documents })
    })
  }

  async allDocs<T extends Document | RowValue>(
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    return this.performCall(db => {
      return () => db.list(params)
    })
  }

  async sql<T extends Document>(sql: string): Promise<T[]> {
    const dbName = this.name
    const url = `/${dbName}/${SQLITE_DESIGN_DOC_ID}`
    const response = await directCouchUrlCall({
      url: `${this.couchInfo.sqlUrl}/${url}`,
      method: "POST",
      cookie: this.couchInfo.cookie,
      body: sql,
    })
    if (response.status > 300) {
      throw new Error(await response.text())
    }
    return (await response.json()) as T[]
  }

  async query<T extends Document>(
    viewName: string,
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    return this.performCall(db => {
      const [database, view] = viewName.split("/")
      return () => db.view(database, view, params)
    })
  }

  async destroy() {
    try {
      return await this.nano().db.destroy(this.name)
    } catch (err: any) {
      // didn't exist, don't worry
      if (err.statusCode === 404) {
        return
      } else {
        throw { ...err, status: err.statusCode }
      }
    }
  }

  async compact() {
    return this.performCall(db => {
      return () => db.compact()
    })
  }

  // All below functions are in-frequently called, just utilise PouchDB
  // for them as it implements them better than we can
  async dump(stream: WriteStream, opts?: { filter?: any }) {
    const pouch = getPouchDB(this.name)
    // @ts-ignore
    return pouch.dump(stream, opts)
  }

  async load(stream: ReadStream) {
    const pouch = getPouchDB(this.name)
    // @ts-ignore
    return pouch.load(stream)
  }

  async createIndex(opts: DatabaseCreateIndexOpts) {
    const pouch = getPouchDB(this.name)
    return pouch.createIndex(opts)
  }

  async deleteIndex(opts: DatabaseDeleteIndexOpts) {
    const pouch = getPouchDB(this.name)
    return pouch.deleteIndex(opts)
  }

  async getIndexes() {
    const pouch = getPouchDB(this.name)
    return pouch.getIndexes()
  }
}
