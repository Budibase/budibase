const { getDB } = require(".")

class Replication {
  /**
   *
   * @param {String} source - the DB you want to replicate or rollback to
   * @param {String} target - the DB you want to replicate to, or rollback from
   */
  constructor({ source, target }) {
    this.source = getDB(source)
    this.target = getDB(target)
  }

  promisify(operation, opts = {}) {
    return new Promise(resolve => {
      operation(this.target, opts)
        .on("denied", function (err) {
          // a document failed to replicate (e.g. due to permissions)
          throw new Error(`Denied: Document failed to replicate ${err}`)
        })
        .on("complete", function (info) {
          return resolve(info)
        })
        .on("error", function (err) {
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

  /**
   * Set up an ongoing live sync between 2 CouchDB databases.
   * @param {Object} opts - PouchDB replication options
   */
  subscribe(opts = {}) {
    this.replication = this.source.replicate
      .to(this.target, {
        live: true,
        retry: true,
        ...opts,
      })
      .on("error", function (err) {
        throw new Error(`Replication Error: ${err}`)
      })
  }

  /**
   * Rollback the target DB back to the state of the source DB
   */
  async rollback() {
    await this.target.destroy()
    // Recreate the DB again
    this.target = getDB(this.target.name)
    await this.replicate()
  }

  cancel() {
    this.replication.cancel()
  }
}

module.exports = Replication
