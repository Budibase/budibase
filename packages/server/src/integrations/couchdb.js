const PouchDB = require("pouchdb")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
  datasource: {
    url: {
      type: FIELD_TYPES.STRING,
      required: true,
      default: "localhost",
    },
    database: {
      type: FIELD_TYPES.STRING,
      required: true,
    },
    view: {
      type: FIELD_TYPES.STRING,
      required: true,
    },
  },
  query: {
    json: {
      type: QUERY_TYPES.JSON,
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
