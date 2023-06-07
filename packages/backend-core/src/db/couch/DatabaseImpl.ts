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
} from "@budibase/types"
import { getCouchInfo } from "./connections"
import { directCouchUrlCall } from "./utils"
import { getPouchDB } from "./pouchDB"
import { WriteStream, ReadStream } from "fs"
import { newid } from "../../docIds/newid"

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

export function DatabaseWithConnection(
  dbName: string,
  connection: string,
  opts?: DatabaseOpts
) {
  if (!connection) {
    throw new Error("Must provide connection details")
  }
  return new DatabaseImpl(dbName, opts, connection)
}

export class DatabaseImpl implements Database {
  public readonly name: string
  private static nano: Nano.ServerScope
  private readonly instanceNano?: Nano.ServerScope
  private readonly pouchOpts: DatabaseOpts

  private readonly couchInfo = getCouchInfo()

  constructor(dbName?: string, opts?: DatabaseOpts, connection?: string) {
    if (dbName == null) {
      throw new Error("Database name cannot be undefined.")
    }
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

  async checkSetup() {
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
    return this.nano().db.use(this.name)
  }

  private async updateOutput(fnc: any) {
    try {
      return await fnc()
    } catch (err: any) {
      if (err.statusCode) {
        err.status = err.statusCode
      }
      throw err
    }
  }

  async get<T>(id?: string): Promise<T | any> {
    const db = await this.checkSetup()
    if (!id) {
      throw new Error("Unable to get doc without a valid _id.")
    }
    return this.updateOutput(() => db.get(id))
  }

  async remove(idOrDoc: string | Document, rev?: string) {
    const db = await this.checkSetup()
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
    return this.updateOutput(() => db.destroy(_id, _rev))
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
    const db = await this.checkSetup()
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
    return this.updateOutput(() => db.insert(document))
  }

  async bulkDocs(documents: AnyDocument[]) {
    const db = await this.checkSetup()
    return this.updateOutput(() => db.bulk({ docs: documents }))
  }

  async allDocs<T>(params: DatabaseQueryOpts): Promise<AllDocsResponse<T>> {
    const db = await this.checkSetup()
    return this.updateOutput(() => db.list(params))
  }

  async query<T>(
    viewName: string,
    params: DatabaseQueryOpts
  ): Promise<AllDocsResponse<T>> {
    const db = await this.checkSetup()
    const [database, view] = viewName.split("/")
    return this.updateOutput(() => db.view(database, view, params))
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
    const db = await this.checkSetup()
    return this.updateOutput(() => db.compact())
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
