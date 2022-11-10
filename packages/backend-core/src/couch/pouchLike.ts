import Nano from "nano"
import { AllDocsResponse, AnyDocument } from "@budibase/types"
import { getCouchInfo } from "./couch"
import { directCouchCall } from "./utils"
import { getPouchDB } from "./pouchDB"

export type PouchLikeOpts = {
  skip_setup?: boolean
}

export type PutOpts = {
  force?: boolean
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

  constructor(dbName?: string, opts?: PouchLikeOpts) {
    if (dbName == null) {
      throw new Error("Database name cannot be undefined.")
    }
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

  async exists() {
    let response = await directCouchCall(`/${this.name}`, "HEAD")
    return response.status === 200
  }

  async checkSetup() {
    let shouldCreate = !this.pouchOpts?.skip_setup
    // check exists in a lightweight fashion
    let exists = await this.exists()
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

  async get<T>(id?: string): Promise<T | any> {
    const db = await this.checkSetup()
    if (!id) {
      throw new Error("Unable to get doc without a valid _id.")
    }
    return this.updateOutput(() => db.get(id))
  }

  async remove(id?: string, rev?: string) {
    const db = await this.checkSetup()
    if (!id || !rev) {
      throw new Error("Unable to remove doc without a valid _id and _rev.")
    }
    return this.updateOutput(() => db.destroy(id, rev))
  }

  async put(document: AnyDocument, opts?: PutOpts) {
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

  async allDocs<T>(params: QueryOpts): Promise<AllDocsResponse<T>> {
    const db = await this.checkSetup()
    return this.updateOutput(() => db.list(params))
  }

  async query<T>(
    viewName: string,
    params: QueryOpts
  ): Promise<AllDocsResponse<T>> {
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
