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

  sync(opts) {
    return new Promise((resolve, reject) => {
      this.source
        .sync(this.target, opts)
        .on("change", function (info) {
          // handle change
        })
        .on("paused", function (err) {
          // replication paused (e.g. replication up to date, user went offline)
        })
        .on("active", function () {
          // replicate resumed (e.g. new changes replicating, user went back online)
        })
        .on("denied", function (err) {
          // a document failed to replicate (e.g. due to permissions)
          return reject(
            new Error(`Denied: Document failed to replicate ${err}`)
          )
        })
        .on("complete", function (info) {
          return resolve(info)
        })
        .on("error", function (err) {
          return reject(new Error(`Replication Error: ${err}`))
        })
    })
  }

  replicate() {
    return new Promise((resolve, reject) => {
      this.replication = this.source.replicate
        .to(this.target)
        // .on("change", function (info) {
        //   // handle change
        // })
        // .on("paused", function (err) {
        //   // replication paused (e.g. replication up to date, user went offline)
        // })
        // .on("active", function () {
        //   // replicate resumed (e.g. new changes replicating, user went back online)
        // })
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

  async rollback() {
    await this.target.destroy()
    await this.replicate()
  }

  cancel() {
    this.replication.cancel()
  }
}

module.exports = Replication
