import {
  Integration,
  DatasourceFieldType,
  QueryType,
  IntegrationBase,
} from "@budibase/types"

const PouchDB = require("pouchdb")

interface CouchDBConfig {
  url: string
  database: string
}

const SCHEMA: Integration = {
  docs: "https://docs.couchdb.org/en/stable/",
  friendlyName: "CouchDB",
  type: "Non-relational",
  description:
    "Apache CouchDB is an open-source document-oriented NoSQL database, implemented in Erlang.",
  datasource: {
    url: {
      type: DatasourceFieldType.STRING,
      required: true,
      default: "http://localhost:5984",
    },
    database: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
  },
  query: {
    create: {
      type: QueryType.JSON,
    },
    read: {
      type: QueryType.JSON,
    },
    update: {
      type: QueryType.JSON,
    },
    delete: {
      type: QueryType.FIELDS,
      fields: {
        id: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
  },
}

class CouchDBIntegration implements IntegrationBase {
  private config: CouchDBConfig
  private readonly client: any

  constructor(config: CouchDBConfig) {
    this.config = config
    this.client = new PouchDB(`${config.url}/${config.database}`)
  }

  async query(
    command: string,
    errorMsg: string,
    query: { json?: object; id?: string }
  ) {
    try {
      const response = await this.client[command](query.id || query.json)
      await this.client.close()
      return response
    } catch (err) {
      console.error(errorMsg, err)
      throw err
    }
  }

  async create(query: { json: object }) {
    return this.query("post", "Error writing to couchDB", query)
  }

  async read(query: { json: object }) {
    const result = await this.query("allDocs", "Error querying couchDB", {
      json: {
        include_docs: true,
        ...query.json,
      },
    })
    return result.rows.map((row: { doc: object }) => row.doc)
  }

  async update(query: { json: object }) {
    return this.query("put", "Error updating couchDB document", query)
  }

  async delete(query: { id: string }) {
    const doc = await this.query("get", "Cannot find doc to be deleted", query)
    return this.query("remove", "Error deleting couchDB document", {
      json: doc,
    })
  }
}

export default {
  schema: SCHEMA,
  integration: CouchDBIntegration,
}
