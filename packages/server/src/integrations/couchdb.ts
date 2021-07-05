import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"

module CouchDBModule {
  const PouchDB = require("pouchdb")

  interface CouchDBConfig {
    url: string
    database: string
  }

  const SCHEMA: Integration = {
    docs: "https://docs.couchdb.org/en/stable/",
    friendlyName: "CouchDB",
    description:
      "Apache CouchDB is an open-source document-oriented NoSQL database, implemented in Erlang.",
    datasource: {
      url: {
        type: DatasourceFieldTypes.STRING,
        required: true,
        default: "http://localhost:5984",
      },
      database: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
    },
    query: {
      create: {
        type: QueryTypes.JSON,
      },
      read: {
        type: QueryTypes.JSON,
      },
      update: {
        type: QueryTypes.JSON,
      },
      delete: {
        type: QueryTypes.FIELDS,
        fields: {
          id: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
    },
  }

  class CouchDBIntegration {
    private config: CouchDBConfig
    private client: any

    constructor(config: CouchDBConfig) {
      this.config = config
      this.client = new PouchDB(`${config.url}/${config.database}`)
    }

    async create(query: { json: object }) {
      try {
        return this.client.post(query.json)
      } catch (err) {
        console.error("Error writing to couchDB", err)
        throw err
      }
    }

    async read(query: { json: object }) {
      try {
        const result = await this.client.allDocs({
          include_docs: true,
          ...query.json,
        })
        return result.rows.map((row: { doc: object }) => row.doc)
      } catch (err) {
        console.error("Error querying couchDB", err)
        throw err
      }
    }

    async update(query: { json: object }) {
      try {
        return this.client.put(query.json)
      } catch (err) {
        console.error("Error updating couchDB document", err)
        throw err
      }
    }

    async delete(query: { id: string }) {
      try {
        return await this.client.remove(query.id)
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
}
