import {
  DatasourceFieldType,
  Document,
  Integration,
  IntegrationBase,
  QueryType,
} from "@budibase/types"
import { db as dbCore } from "@budibase/backend-core"

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
    get: {
      type: QueryType.FIELDS,
      fields: {
        id: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
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
    this.client = dbCore.DatabaseWithConnection(config.database, config.url)
  }

  async query(
    command: string,
    errorMsg: string,
    query: { json?: object; id?: string }
  ) {
    try {
      return await this.client[command](query.id || query.json)
    } catch (err) {
      console.error(errorMsg, err)
      throw err
    }
  }

  private parse(query: { json: string | object }) {
    return typeof query.json === "string" ? JSON.parse(query.json) : query.json
  }

  async create(query: { json: string | object }) {
    const parsed = this.parse(query)
    return this.query("post", "Error writing to couchDB", { json: parsed })
  }

  async read(query: { json: string | object }) {
    const parsed = this.parse(query)
    const result = await this.query("allDocs", "Error querying couchDB", {
      json: {
        include_docs: true,
        ...parsed,
      },
    })
    return result.rows.map((row: { doc: object }) => row.doc)
  }

  async update(query: { json: string | object }) {
    const parsed: Document = this.parse(query)
    if (!parsed?._rev && parsed?._id) {
      const oldDoc = await this.get({ id: parsed._id })
      parsed._rev = oldDoc._rev
    }
    return this.query("put", "Error updating couchDB document", {
      json: parsed,
    })
  }

  async get(query: { id: string }) {
    return this.query("get", "Error retrieving couchDB document by ID", {
      id: query.id,
    })
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
