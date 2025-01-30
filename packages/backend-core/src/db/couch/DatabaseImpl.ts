import Nano from "@budibase/nano"
import {
  AllDocsResponse,
  AnyDocument,
  Database,
  DatabaseCreateIndexOpts,
  DatabaseDeleteIndexOpts,
  DatabaseOpts,
  DatabasePutOpts,
  DatabaseQueryOpts,
  DBError,
  Document,
  isDocument,
  RowResponse,
  RowValue,
  SqlClient,
  SQLiteDefinition,
  SqlQueryBinding,
} from "@budibase/types"
import { getCouchInfo } from "./connections"
import { directCouchUrlCall } from "./utils"
import { getPouchDB } from "./pouchDB"
import { ReadStream, WriteStream } from "fs"
import { newid } from "../../docIds/newid"
import { SQLITE_DESIGN_DOC_ID } from "../../constants"
import { DDInstrumentedDatabase } from "../instrumentation"
import { checkSlashesInUrl } from "../../helpers"
import { sqlLog } from "../../sql/utils"

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
type DBCallback<T> = (
  db: Nano.DocumentScope<any>
) => Promise<DBCall<T>> | DBCall<T>

class CouchDBError extends Error implements DBError {
  status: number
  statusCode: number
  reason: string
  name: string
  errid: string
  error: string
  description: string

  constructor(
    message: string,
    info: {
      status?: number
      statusCode?: number
      name: string
      errid?: string
      description?: string
      reason?: string
      error?: string
    }
  ) {
    super(message)
    const statusCode = info.status || info.statusCode || 500
    this.status = statusCode
    this.statusCode = statusCode
    this.reason = info.reason || "Unknown"
    this.name = info.name
    this.errid = info.errid || "Unknown"
    this.description = info.description || "Unknown"
    this.error = info.error || "Not found"
  }
}

export function DatabaseWithConnection(
  dbName: string,
  connection: string,
  opts?: DatabaseOpts
) {
  if (!dbName || !connection) {
    throw new Error(
      "Unable to create database without database name or connection"
    )
  }
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

  exists(docId?: string) {
    if (docId === undefined) {
      return this.dbExists()
    }

    return this.docExists(docId)
  }

  private async dbExists() {
    const response = await directCouchUrlCall({
      url: `${this.couchInfo.url}/${this.name}`,
      method: "HEAD",
      cookie: this.couchInfo.cookie,
    })
    return response.status === 200
  }

  private async docExists(id: string): Promise<boolean> {
    try {
      await this.performCall(db => () => db.head(id))
      return true
    } catch {
      return false
    }
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
          throw new CouchDBError(err.message, err)
        }
      }
    }
    return this.getDb()
  }

  // this function fetches the DB and handles if DB creation is needed
  private async performCallWithDBCreation<T>(
    call: DBCallback<T>
  ): Promise<any> {
    const db = this.getDb()
    const fnc = await call(db)
    try {
      return await fnc()
    } catch (err: any) {
      if (err.statusCode === 404 && err.reason === DATABASE_NOT_FOUND) {
        await this.checkAndCreateDb()
        return await this.performCallWithDBCreation(call)
      }
      // stripping the error down the props which are safe/useful, drop everything else
      throw new CouchDBError(`CouchDB error: ${err.message}`, err)
    }
  }

  private async performCall<T>(call: DBCallback<T>): Promise<T> {
    const db = this.getDb()
    const fnc = await call(db)
    try {
      return await fnc()
    } catch (err: any) {
      // stripping the error down the props which are safe/useful, drop everything else
      throw new CouchDBError(`CouchDB error: ${err.message}`, err)
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

  async tryGet<T extends Document>(id?: string): Promise<T | undefined> {
    try {
      return await this.get<T>(id)
    } catch (err: any) {
      if (err.statusCode === 404) {
        return undefined
      }
      throw err
    }
  }

  async getMultiple<T extends Document>(
    ids: string[],
    opts?: { allowMissing?: boolean; excludeDocs?: boolean }
  ): Promise<T[]> {
    // get unique
    ids = [...new Set(ids)]
    const includeDocs = !opts?.excludeDocs
    const response = await this.allDocs<T>({
      keys: ids,
      include_docs: includeDocs,
    })
    const rowUnavailable = (row: RowResponse<T>) => {
      // row is deleted - key lookup can return this
      if (
        (includeDocs && row.doc == null) ||
        (row.value && "deleted" in row.value && row.value.deleted)
      ) {
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
    return rows.map(row => (includeDocs ? row.doc! : row.value))
  }

  async remove(idOrDoc: string | Document, rev?: string) {
    // not a read call - but don't create a DB to delete a document
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

  async bulkRemove(documents: Document[], opts?: { silenceErrors?: boolean }) {
    const response: Nano.DocumentBulkResponse[] = await this.performCall(db => {
      return () =>
        db.bulk({
          docs: documents.map(doc => ({
            ...doc,
            _deleted: true,
          })),
        })
    })
    if (opts?.silenceErrors) {
      return
    }
    let errorFound = false
    let errorMessage = "Unable to bulk remove documents: "
    for (let res of response) {
      if (res.error) {
        errorFound = true
        errorMessage += res.error
      }
    }
    if (errorFound) {
      throw new CouchDBError(errorMessage, {
        name: this.name,
        status: 400,
      })
    }
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
    return this.performCallWithDBCreation(async db => {
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
    const now = new Date().toISOString()
    return this.performCallWithDBCreation(db => {
      return () =>
        db.bulk({
          docs: documents.map(d => ({ createdAt: now, ...d, updatedAt: now })),
        })
    })
  }

  async allDocs<T extends Document | RowValue>(
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    return this.performCall(db => {
      return async () => {
        try {
          return (await db.list(params)) as AllDocsResponse<T>
        } catch (err: any) {
          if (err.reason === DATABASE_NOT_FOUND) {
            return {
              offset: 0,
              total_rows: 0,
              rows: [],
            }
          } else {
            throw err
          }
        }
      }
    })
  }

  async _sqlQuery<T>(
    url: string,
    method: "POST" | "GET",
    body?: Record<string, any>
  ): Promise<T> {
    url = checkSlashesInUrl(`${this.couchInfo.sqlUrl}/${url}`)
    const args: { url: string; method: string; cookie: string; body?: any } = {
      url,
      method,
      cookie: this.couchInfo.cookie,
    }
    if (body) {
      args.body = body
    }
    return this.performCall(() => {
      return async () => {
        const response = await directCouchUrlCall(args)
        const text = await response.text()
        if (response.status > 300) {
          let json
          try {
            json = JSON.parse(text)
          } catch (err) {
            console.error(`SQS error: ${text}`)
            throw new CouchDBError(
              "error while running SQS query, please try again later",
              { name: "sqs_error", status: response.status }
            )
          }
          throw json
        }
        return JSON.parse(text) as T
      }
    })
  }

  async sql<T extends Document>(
    sql: string,
    parameters?: SqlQueryBinding
  ): Promise<T[]> {
    const dbName = this.name
    const url = `/${dbName}/${SQLITE_DESIGN_DOC_ID}`
    sqlLog(SqlClient.SQL_LITE, sql, parameters)
    return await this._sqlQuery<T[]>(url, "POST", {
      query: sql,
      args: parameters,
    })
  }

  // checks design document is accurate (cleans up tables)
  // this will check the design document and remove anything from
  // disk which is not supposed to be there
  async sqlDiskCleanup(): Promise<void> {
    const dbName = this.name
    const url = `/${dbName}/_cleanup`
    try {
      await this._sqlQuery<void>(url, "POST")
    } catch (err: any) {
      // hack for now - SQS throws a 500 when there is nothing to clean-up
      if (err.status !== 500) {
        throw err
      }
    }
  }

  // removes a document from sqlite
  async sqlPurgeDocument(docIds: string[] | string): Promise<void> {
    if (!Array.isArray(docIds)) {
      docIds = [docIds]
    }
    const dbName = this.name
    const url = `/${dbName}/_purge`
    return await this._sqlQuery<void>(url, "POST", { docs: docIds })
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
    if (await this.exists(SQLITE_DESIGN_DOC_ID)) {
      // delete the design document, then run the cleanup operation
      const definition = await this.get<SQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
      // remove all tables - save the definition then trigger a cleanup
      definition.sql.tables = {}
      await this.put(definition)
      await this.sqlDiskCleanup()
    }
    try {
      return await this.nano().db.destroy(this.name)
    } catch (err: any) {
      // didn't exist, don't worry
      if (err.statusCode === 404) {
        return { ok: true }
      } else {
        throw new CouchDBError(err.message, err)
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
