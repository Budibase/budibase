import Nano from "nano"
import { AnyDocument } from "@budibase/types"
import { getCouchInfo } from "./couch"
import { directCouchCall } from "./utils"
import { ReadStream, WriteStream } from "fs"
import { dangerousGetDB } from "../db"

export type PouchLikeOpts = {
  skip_setup?: boolean
}

export type QueryOpts = {
  include_docs?: boolean
  startkey?: string
  endkey?: string
  limit?: number
  skip?: number
  descending?: boolean
  key?: string
  keys?: string[]
}

export type DumpOpts = {
  filter?: (doc: AnyDocument) => boolean
}

export class PouchLike {
  public readonly name: string
  private static nano: Nano.ServerScope
  private readonly pouchOpts: PouchLikeOpts

  constructor(dbName: string, opts?: PouchLikeOpts) {
    this.name = dbName
    this.pouchOpts = opts || {}
  }

  static init() {
    const couchInfo = getCouchInfo()
    this.nano = Nano({
      url: couchInfo.url,
      cookie: couchInfo.cookie,
    })
  }

  async checkSetup() {
    let shouldCreate = !this.pouchOpts?.skip_setup
    // check exists in a lightweight fashion
    let response = await directCouchCall(`/${this.name}`, "HEAD")
    let exists = response.status === 200
    if (!shouldCreate && !exists) {
      throw new Error("DB does not exist")
    }
    if (!exists) {
      await PouchLike.nano.db.create(this.name)
    }
    return PouchLike.nano.db.use(this.name)
  }

  async info() {}

  async get(id: string) {
    const db = await this.checkSetup()
    return await db.get(id)
  }

  async remove(id: string, rev: string) {
    const db = await this.checkSetup()
    return await db.destroy(id, rev)
  }

  async put(document: AnyDocument) {
    if (!document._id) {
      throw new Error("Cannot store document without _id field.")
    }
    const db = await this.checkSetup()
    return await db.insert(document)
  }

  async bulkDocs(documents: AnyDocument[]) {
    const db = await this.checkSetup()
    return await db.bulk({ docs: documents })
  }

  async allDocs(params: QueryOpts) {
    const db = await this.checkSetup()
    return await db.fetch({ keys: [] }, params)
  }

  async query(viewName: string, params: QueryOpts) {
    const db = await this.checkSetup()
    const [database, view] = viewName.split("/")
    return await db.view(database, view, params)
  }

  async destroy() {
    try {
      await PouchLike.nano.db.destroy(this.name)
    } catch (err: any) {
      // didn't exist, don't worry
      if (err.status === 404) {
        return
      } else {
        throw err
      }
    }
  }

  async compact() {
    const db = await this.checkSetup()
    return await db.compact()
  }

  // utilise PouchDB for this
  async dump(stream: WriteStream, params: DumpOpts) {
    const pouch = dangerousGetDB(this.name)
    // @ts-ignore
    return pouch.dump(stream, params)
  }

  // utilise PouchDB for this
  async load(stream: ReadStream) {
    const pouch = dangerousGetDB(this.name)
    // @ts-ignore
    return pouch.load(stream)
  }

  // pouch specific functions - indexes come from the pouchdb-find library
  async createIndex() {}

  async deleteIndex() {}

  async getIndexes() {}
}
