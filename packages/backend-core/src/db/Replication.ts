import { getPouchDB, closePouchDB } from "./couch"
import { DocumentType } from "../constants"

class Replication {
  source: any
  target: any
  replication: any

  /**
   *
   * @param {String} source - the DB you want to replicate or rollback to
   * @param {String} target - the DB you want to replicate to, or rollback from
   */
  constructor({ source, target }: any) {
    this.source = getPouchDB(source)
    this.target = getPouchDB(target)
  }

  close() {
    return Promise.all([closePouchDB(this.source), closePouchDB(this.target)])
  }

  promisify(operation: any, opts = {}) {
    return new Promise(resolve => {
      operation(this.target, opts)
        .on("denied", function (err: any) {
          // a document failed to replicate (e.g. due to permissions)
          throw new Error(`Denied: Document failed to replicate ${err}`)
        })
        .on("complete", function (info: any) {
          return resolve(info)
        })
        .on("error", function (err: any) {
          throw new Error(`Replication Error: ${err}`)
        })
    })
  }

  /**
   * Two way replication operation, intended to be promise based.
   * @param {Object} opts - PouchDB replication options
   */
  sync(opts = {}) {
    this.replication = this.promisify(this.source.sync, opts)
    return this.replication
  }

  /**
   * One way replication operation, intended to be promise based.
   * @param {Object} opts - PouchDB replication options
   */
  replicate(opts = {}) {
    this.replication = this.promisify(this.source.replicate.to, opts)
    return this.replication
  }

  appReplicateOpts() {
    return {
      filter: (doc: any) => {
        if (doc._id && doc._id.startsWith(DocumentType.AUTOMATION_LOG)) {
          return false
        }
        return doc._id !== DocumentType.APP_METADATA
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

  cancel() {
    this.replication.cancel()
  }
}

export default Replication
