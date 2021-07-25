import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"

module ElasticsearchModule {
  const { Client } = require("@elastic/elasticsearch")

  interface ElasticsearchConfig {
    url: string
  }

  const SCHEMA: Integration = {
    docs: "https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html",
    description:
      "Elasticsearch is a search engine based on the Lucene library. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents.",
    friendlyName: "ElasticSearch",
    datasource: {
      url: {
        type: DatasourceFieldTypes.STRING,
        required: true,
        default: "http://localhost:9200",
      },
    },
    query: {
      create: {
        type: QueryTypes.FIELDS,
        customisable: true,
        fields: {
          index: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
      read: {
        type: QueryTypes.FIELDS,
        customisable: true,
        fields: {
          index: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
      update: {
        type: QueryTypes.FIELDS,
        customisable: true,
        fields: {
          id: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          index: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
      delete: {
        type: QueryTypes.FIELDS,
        fields: {
          index: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          id: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
    },
  }

  class ElasticSearchIntegration {
    private config: ElasticsearchConfig
    private client: any

    constructor(config: ElasticsearchConfig) {
      this.config = config
      this.client = new Client({ node: config.url })
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

    async delete(query: object) {
      try {
        const result = await this.client.delete(query)
        return result.body
      } catch (err) {
        console.error("Error deleting from elasticsearch", err)
        throw err
      } finally {
        await this.client.close()
      }
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: ElasticSearchIntegration,
  }
}
