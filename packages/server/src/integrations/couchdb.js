const PouchDB = require("pouchdb")

const SCHEMA = {
  datasource: {
    url: {
      type: "string",
      required: true,
      default: "localhost",
    },
    database: {
      type: "string",
      required: true,
    },
    view: {
      type: "string",
      required: true,
    },
  },
  query: {
    json: {
      type: "json",
      required: true,
    },
  },
}

class CouchDBIntegration {
  constructor(config) {
    this.config = config
    this.client = new PouchDB(`${config.url}/${config.database}`)
  }

  async read() {
    try {
      const result = await this.client.allDocs({
        include_docs: true,
      })
      return result.rows.map(row => row.doc)
    } catch (err) {
      console.error("Error querying couchDB", err)
      throw err
    }
  }
}

module.exports = {
  schema: SCHEMA,
  integration: CouchDBIntegration,
}
