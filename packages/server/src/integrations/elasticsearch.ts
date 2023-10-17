import {
  Integration,
  DatasourceFieldType,
  QueryType,
  IntegrationBase,
  DatasourceFeature,
  ConnectionInfo,
} from "@budibase/types"

import { Client, ClientOptions } from "@elastic/elasticsearch"

interface ElasticsearchConfig {
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
      default: "http://localhost:9200",
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

class ElasticSearchIntegration implements IntegrationBase {
  private config: ElasticsearchConfig
  private client

  constructor(config: ElasticsearchConfig) {
    this.config = config

    const clientConfig: ClientOptions = {
      node: this.config.url,
    }

    if (this.config.ssl) {
      clientConfig.ssl = {
        rejectUnauthorized: this.config.rejectUnauthorized,
        ca: this.config.ca || undefined,
      }
    }

    this.client = new Client(clientConfig)
  }

  async testConnection(): Promise<ConnectionInfo> {
    try {
      await this.client.info()
      return { connected: true }
    } catch (e: any) {
      return {
        connected: false,
        error: e.message as string,
      }
    }
  }

  async create(query: { index: string; json: object }) {
    const { index, json } = query

    try {
      const result = await this.client.index({
        index,
        body: json,
      })
      return result.body
    } catch (err) {
      console.error("Error writing to elasticsearch", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async read(query: { index: string; json: object }) {
    const { index, json } = query
    try {
      const result = await this.client.search({
        index: index,
        body: json,
      })
      return result.body.hits.hits.map(({ _source }: any) => _source)
    } catch (err) {
      console.error("Error querying elasticsearch", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async update(query: { id: string; index: string; json: object }) {
    const { id, index, json } = query
    try {
      const result = await this.client.update({
        id,
        index,
        body: json,
      })
      return result.body
    } catch (err) {
      console.error("Error querying elasticsearch", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async delete(query: { id: string; index: string }) {
    const { id, index } = query
    try {
      const result = await this.client.delete({
        id,
        index,
      })
      return result.body
    } catch (err) {
      console.error("Error deleting from elasticsearch", err)
      throw err
    } finally {
      await this.client.close()
    }
  }
}

export default {
  schema: SCHEMA,
  integration: ElasticSearchIntegration,
}
