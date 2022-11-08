import Nano from "nano"
import { AnyDocument } from "@budibase/types"
import { getCouchInfo } from "./couch"
import { directCouchCall } from "./utils"
import { getPouchDB } from "../db"

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

export class PouchLike {
  public readonly name: string
  private static nano: Nano.ServerScope
  private readonly pouchOpts: PouchLikeOpts

  constructor(dbName: string, opts?: PouchLikeOpts) {
    this.name = dbName
    this.pouchOpts = opts || {}
    if (!PouchLike.nano) {
      PouchLike.init()
    }
  }

  static init() {
    const couchInfo = getCouchInfo()
    PouchLike.nano = Nano({
      url: couchInfo.url,
      requestDefaults: {
        headers: {
          Authorization: couchInfo.cookie,
        },
      },
      parseUrl: false,
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

  async info() {
    const db = PouchLike.nano.db.use(this.name)
    return db.info()
  }

  async get(id: string) {
    const db = await this.checkSetup()
    return this.updateOutput(() => db.get(id))
  }

  async remove(id: string, rev: string) {
    const db = await this.checkSetup()
    return this.updateOutput(() => db.destroy(id, rev))
  }

  async put(document: AnyDocument) {
    if (!document._id) {
      throw new Error("Cannot store document without _id field.")
    }
    const db = await this.checkSetup()
    return this.updateOutput(() => db.insert(document))
  }

  async bulkDocs(documents: AnyDocument[]) {
    const db = await this.checkSetup()
    return this.updateOutput(() => db.bulk({ docs: documents }))
  }

  async allDocs(params: QueryOpts) {
    const db = await this.checkSetup()
    return this.updateOutput(() => db.list(params))
  }

  async query(viewName: string, params: QueryOpts) {
    const db = await this.checkSetup()
    const [database, view] = viewName.split("/")
    return this.updateOutput(() => db.view(database, view, params))
  }

  async destroy() {
    try {
      await PouchLike.nano.db.destroy(this.name)
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

  private doWithPouchDB(func: string) {
    const dbName = this.name
    return async (args: any[]) => {
      const pouch = getPouchDB(dbName)
      // @ts-ignore
      return pouch[func](...args)
    }
  }

  // All below functions are in-frequently called, just utilise PouchDB
  // for them as it implements them better than we can
  async dump(...args: any[]) {
    return this.doWithPouchDB("dump")(args)
  }

  async load(...args: any[]) {
    return this.doWithPouchDB("load")(args)
  }

  async createIndex(...args: any[]) {
    return this.doWithPouchDB("createIndex")(args)
  }

  async deleteIndex(...args: any[]) {
    return this.doWithPouchDB("createIndex")(args)
  }

  async getIndexes(...args: any[]) {
    return this.doWithPouchDB("createIndex")(args)
  }
}
