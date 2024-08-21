import {
  ConnectionInfo,
  Database,
  DatasourceFeature,
  DatasourceFieldType,
  Document,
  Integration,
  IntegrationBase,
  QueryType,
} from "@budibase/types"
import { db as dbCore } from "@budibase/backend-core"
import { HOST_ADDRESS } from "./utils"

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
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    url: {
      type: DatasourceFieldType.STRING,
      required: true,
      default: `http://${HOST_ADDRESS}:5984`,
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
  private readonly client: Database

  constructor(config: CouchDBConfig) {
    if (!config.url || !config.database) {
      throw new Error("Unable to connect without URL or database")
    }
    this.client = dbCore.DatabaseWithConnection(config.database, config.url)
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    try {
      response.connected = await this.client.exists()
    } catch (e: any) {
      response.error = e.message as string
    }
    return response
  }

  private parse(query: { json: string | object }) {
    return typeof query.json === "string" ? JSON.parse(query.json) : query.json
  }

  async create(query: { json: string | object }) {
    const parsed = this.parse(query)
    return await this.client.put(parsed)
  }

  async read(query: { json: string | object }) {
    const parsed = this.parse(query)
    const params = {
      include_docs: true,
      ...parsed,
    }
    const result = await this.client.allDocs(params)
    return result.rows.map(row => row.doc)
  }

  async update(query: { json: string | object }) {
    const parsed: Document = this.parse(query)
    if (!parsed?._rev && parsed?._id) {
      const oldDoc = await this.get({ id: parsed._id })
      parsed._rev = oldDoc._rev
    }
    return await this.client.put(parsed)
  }

  async get(query: { id: string }) {
    return await this.client.get(query.id)
  }

  async delete(query: { id: string }) {
    return await this.client.remove(query.id)
  }
}

export default {
  schema: SCHEMA,
  integration: CouchDBIntegration,
}
