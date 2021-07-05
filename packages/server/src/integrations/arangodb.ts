import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"

module ArangoModule {
  const { Database, aql } = require("arangojs")

  interface ArangodbConfig {
    url: string
    username: string
    password: string
    databaseName: string
    collection: string
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/arangodb/arangojs",
    friendlyName: "ArangoDB",
    description:
      "ArangoDB is a scalable open-source multi-model database natively supporting graph, document and search. All supported data models & access patterns can be combined in queries allowing for maximal flexibility. ",
    datasource: {
      url: {
        type: DatasourceFieldTypes.STRING,
        default: "http://localhost:8529",
        required: true,
      },
      username: {
        type: DatasourceFieldTypes.STRING,
        default: "root",
        required: true,
      },
      password: {
        type: DatasourceFieldTypes.PASSWORD,
        required: true,
      },
      databaseName: {
        type: DatasourceFieldTypes.STRING,
        default: "_system",
        required: true,
      },
      collection: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
    },
    query: {
      read: {
        type: QueryTypes.SQL,
      },
      create: {
        type: QueryTypes.JSON,
      },
    },
  }

  class ArangoDBIntegration {
    private config: ArangodbConfig
    private client: any

    constructor(config: ArangodbConfig) {
      const newConfig = {
        auth: {
          username: config.username,
          password: config.password,
        },
      }

      this.config = config
      this.client = new Database(newConfig)
    }

    async read(query: { sql: any }) {
      try {
        const result = await this.client.query(query.sql)
        return result.all()
      } catch (err) {
        console.error("Error querying arangodb", err.message)
        throw err
      } finally {
        this.client.close()
      }
    }

    async create(query: { json: any }) {
      const clc = this.client.collection(this.config.collection)
      try {
        const result = await this.client.query(
          aql`INSERT ${query.json} INTO ${clc} RETURN NEW`
        )
        return result.all()
      } catch (err) {
        console.error("Error querying arangodb", err.message)
        throw err
      } finally {
        this.client.close()
      }
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: ArangoDBIntegration,
  }
}
