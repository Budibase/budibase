import {
  Integration,
  DatasourceFieldType,
  QueryType,
  IntegrationBase,
  DatasourceFeature,
  ConnectionInfo,
} from "@budibase/types"

import type { AgentOptions } from "http"
import { utils } from "@budibase/backend-core"
import { Client, ClientOptions } from "@elastic/elasticsearch"
import { HOST_ADDRESS } from "./utils"

export interface ElasticsearchConfig {
  url: string
  ssl?: boolean
  ca?: string
  rejectUnauthorized?: boolean
}

const SCHEMA: Integration = {
  docs: "https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html",
  description:
    "Elasticsearch is a search engine based on the Lucene library. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents.",
  friendlyName: "ElasticSearch",
  type: "Non-relational",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    url: {
      type: DatasourceFieldType.STRING,
      required: true,
      default: `http://${HOST_ADDRESS}:9200`,
    },
    ssl: {
      type: DatasourceFieldType.BOOLEAN,
      default: false,
      required: false,
    },
    rejectUnauthorized: {
      type: DatasourceFieldType.BOOLEAN,
      default: true,
      required: false,
    },
    ca: {
      type: DatasourceFieldType.LONGFORM,
      default: false,
      required: false,
    },
  },
  query: {
    create: {
      type: QueryType.FIELDS,
      customisable: true,
      fields: {
        index: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    read: {
      type: QueryType.FIELDS,
      customisable: true,
      fields: {
        index: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    update: {
      type: QueryType.FIELDS,
      customisable: true,
      fields: {
        id: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
        index: {
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
        index: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
  },
}

export class ElasticSearchIntegration implements IntegrationBase {
  private config: ElasticsearchConfig
  private client?: Promise<Client>

  constructor(config: ElasticsearchConfig) {
    this.config = config
  }

  private getClient(): Promise<Client> {
    this.client ??= this.buildClient()
    return this.client
  }

  // The URL is user-supplied: check its host against the outbound blacklist and
  // pin the connection to the checked IP, so it cannot be used to reach
  // internal services. The client still builds its own agent from these
  // options (adding `ssl`) and reads any login from the URL itself.
  private async buildClient(): Promise<Client> {
    const { hostname } = new URL(this.config.url)
    const ip = await utils.requireSafeHostIp(hostname.replace(/^\[|\]$/g, ""))
    const agent: AgentOptions = { lookup: utils.createPinnedLookup(ip) }

    const clientConfig: ClientOptions = {
      node: this.config.url,
      agent,
    }
    if (this.config.ssl) {
      clientConfig.ssl = {
        rejectUnauthorized: this.config.rejectUnauthorized,
        ca: this.config.ca || undefined,
      }
    }

    return new Client(clientConfig)
  }

  async testConnection(): Promise<ConnectionInfo> {
    try {
      const client = await this.getClient()
      await client.info()
      return { connected: true }
    } catch (e: any) {
      return {
        connected: false,
        error: e.message as string,
      }
    }
  }

  async create(query: {
    index: string
    json: object
    extra?: Record<string, string>
  }) {
    const { index, json, extra } = query

    try {
      const client = await this.getClient()
      const result = await client.index({
        index,
        body: json,
        ...extra,
      })
      return result.body
    } catch (err) {
      console.error("Error writing to elasticsearch", err)
      throw err
    }
  }

  async read(query: { index: string; json: object }) {
    const { index, json } = query
    try {
      const client = await this.getClient()
      const result = await client.search({
        index: index,
        body: json,
      })
      return result.body.hits.hits.map(({ _source }: any) => _source)
    } catch (err) {
      console.error("Error querying elasticsearch", err)
      throw err
    }
  }

  async update(query: {
    id: string
    index: string
    json: object
    extra?: Record<string, string>
  }) {
    const { id, index, json, extra } = query
    try {
      const client = await this.getClient()
      const result = await client.update({
        id,
        index,
        body: json,
        ...extra,
      })
      return result.body
    } catch (err) {
      console.error("Error querying elasticsearch", err)
      throw err
    }
  }

  async delete(query: {
    id: string
    index: string
    extra?: Record<string, string>
  }) {
    const { id, index, extra } = query
    try {
      const client = await this.getClient()
      const result = await client.delete({
        id,
        index,
        ...extra,
      })
      return result.body
    } catch (err) {
      console.error("Error deleting from elasticsearch", err)
      throw err
    }
  }
}

export default {
  schema: SCHEMA,
  integration: ElasticSearchIntegration,
}
