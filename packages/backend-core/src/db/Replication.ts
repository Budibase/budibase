import { Document, DocumentType } from "@budibase/types"
import PouchDB from "pouchdb"
import { DesignDocuments, SEPARATOR, USER_METADATA_PREFIX } from "../constants"
import { closePouchDB, getPouchDB } from "./couch"

const _PouchDB = PouchDB // Keep Prettier from removing import

enum ReplicationDirection {
  TO_PRODUCTION = "toProduction",
  TO_DEV = "toDev",
}

type DocumentWithID = Omit<Document, "_id"> & { _id: string }

class Replication {
  source: PouchDB.Database
  target: PouchDB.Database
  direction: ReplicationDirection | undefined

  constructor({ source, target }: { source: string; target: string }) {
    this.source = getPouchDB(source)
    this.target = getPouchDB(target)
    if (
      source.startsWith(DocumentType.WORKSPACE_DEV) &&
      target.startsWith(DocumentType.WORKSPACE)
    ) {
      this.direction = ReplicationDirection.TO_PRODUCTION
    } else if (
      source.startsWith(DocumentType.WORKSPACE) &&
      target.startsWith(DocumentType.WORKSPACE_DEV)
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
    opts: PouchDB.Replication.ReplicateOptions & {
      isCreation?: boolean
      tablesToSync?: string[] | "all"
    } = {}
  ): PouchDB.Replication.ReplicateOptions {
    if (typeof opts.filter === "string") {
      return opts
    }

    const filter = opts.filter
    const direction = this.direction
    const toDev = direction === ReplicationDirection.TO_DEV
    delete opts.filter

    const isCreation = opts.isCreation
    let tablesToSync = opts.tablesToSync
    delete opts.isCreation
    delete opts.tablesToSync

    let syncAllTables = false,
      tableSyncList: string[] | undefined
    if (typeof tablesToSync === "string" && tablesToSync === "all") {
      syncAllTables = true
    } else if (tablesToSync) {
      tableSyncList = tablesToSync
    }

    const startsWithID = (_id: string, documentType: string) => {
      return _id?.startsWith(documentType + SEPARATOR)
    }

    const isData = (_id: string) =>
      startsWithID(_id, DocumentType.ROW) ||
      startsWithID(_id, DocumentType.LINK)

    return {
      ...opts,
      filter: (doc: DocumentWithID, params: any) => {
        if (!isCreation && doc._id === DesignDocuments.MIGRATIONS) {
          return false
        }
        // don't sync design documents
        if (toDev && doc._id.startsWith("_design")) {
          return false
        }
        // always replicate deleted documents
        if (doc._deleted) {
          return true
        }
        // always sync users from dev
        if (startsWithID(doc._id, USER_METADATA_PREFIX)) {
          return true
        }
        if (isData(doc._id)) {
          return (
            !!tableSyncList?.find(id => doc._id.includes(id)) || syncAllTables
          )
        }
        if (startsWithID(doc._id, DocumentType.AUTOMATION_LOG)) {
          return false
        }
        if (doc._id === DocumentType.WORKSPACE_METADATA) {
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
