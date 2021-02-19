const PouchDB = require("pouchdb")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://docs.couchdb.org/en/stable/",
  friendlyName: "CouchDB",
  description:
    "Apache CouchDB is an open-source document-oriented NoSQL database, implemented in Erlang.",
  datasource: {
    url: {
      type: FIELD_TYPES.STRING,
      required: true,
      default: "http://localhost:5984",
    },
    database: {
      type: FIELD_TYPES.STRING,
      required: true,
    },
  },
  query: {
    create: {
      type: QUERY_TYPES.JSON,
    },
    read: {
      type: QUERY_TYPES.JSON,
    },
    update: {
      type: QUERY_TYPES.JSON,
    },
    delete: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        id: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
      },
    },
  },
}

class CouchDBIntegration {
  constructor(config) {
    this.config = config
    this.client = new PouchDB(`${config.url}/${config.database}`)
  }

  async create(query) {
    try {
      const result = await this.client.post(query.json)
      return result
    } catch (err) {
      console.error("Error writing to couchDB", err)
      throw err
    }
  }

  async read(query) {
    try {
      const result = await this.client.allDocs({
        include_docs: true,
        ...query.json,
      })
      return result.rows.map(row => row.doc)
    } catch (err) {
      console.error("Error querying couchDB", err)
      throw err
    }
  }

  async update(query) {
    try {
      const result = await this.client.put(query.json)
      return result
    } catch (err) {
      console.error("Error updating couchDB document", err)
      throw err
    }
  }

  async delete(query) {
    try {
      const result = await this.client.remove(query.id)
      return result
    } catch (err) {
      console.error("Error deleting couchDB document", err)
      throw err
    }
  }
}

module.exports = {
  schema: SCHEMA,
  integration: CouchDBIntegration,
}
