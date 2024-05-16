import PouchDB from "pouchdb"
import { getPouchDB, closePouchDB } from "./couch"
import { DocumentType } from "@budibase/types"

enum ReplicationDirection {
  TO_PRODUCTION = "toProduction",
  TO_DEV = "toDev",
}

class Replication {
  source: PouchDB.Database
  target: PouchDB.Database
  direction: ReplicationDirection | undefined

  constructor({ source, target }: { source: string; target: string }) {
    this.source = getPouchDB(source)
    this.target = getPouchDB(target)
    if (
      source.startsWith(DocumentType.APP_DEV) &&
      target.startsWith(DocumentType.APP)
    ) {
      this.direction = ReplicationDirection.TO_PRODUCTION
    } else if (
      source.startsWith(DocumentType.APP) &&
      target.startsWith(DocumentType.APP_DEV)
    ) {
      this.direction = ReplicationDirection.TO_DEV
    }
  }

  async close() {
    await Promise.all([closePouchDB(this.source), closePouchDB(this.target)])
  }

  replicate(opts: PouchDB.Replication.ReplicateOptions = {}) {
    return new Promise<PouchDB.Replication.ReplicationResult<{}>>(resolve => {
      this.source.replicate
        .to(this.target, opts)
        .on("denied", function (err) {
          // a document failed to replicate (e.g. due to permissions)
          throw new Error(`Denied: Document failed to replicate ${err}`)
        })
        .on("complete", function (info) {
          return resolve(info)
        })
        .on("error", function (err) {
          throw err
        })
    })
  }

  appReplicateOpts(
    opts: PouchDB.Replication.ReplicateOptions = {}
  ): PouchDB.Replication.ReplicateOptions {
    if (typeof opts.filter === "string") {
      return opts
    }

    const filter = opts.filter
    const direction = this.direction
    const toDev = direction === ReplicationDirection.TO_DEV
    delete opts.filter

    return {
      ...opts,
      filter: (doc: any, params: any) => {
        // don't sync design documents
        if (toDev && doc._id?.startsWith("_design")) {
          return false
        }
        if (doc._id?.startsWith(DocumentType.AUTOMATION_LOG)) {
          return false
        }
        if (doc._id === DocumentType.APP_METADATA) {
          return false
        }
        return filter ? filter(doc, params) : true
      },
    }
  }

  /**
   * Rollback the target DB back to the state of the source DB
   */
  async rollback() {
    await this.target.destroy()
    // Recreate the DB again
    this.target = getPouchDB(this.target.name)
    // take the opportunity to remove deleted tombstones
    await this.replicate()
  }
}

export default Replication
