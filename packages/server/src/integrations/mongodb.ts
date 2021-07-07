import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"

module MongoDBModule {
  const { MongoClient } = require("mongodb")

  interface MongoDBConfig {
    connectionString: string
    db: string
    collection: string
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/mongodb/node-mongodb-native",
    friendlyName: "MongoDB",
    description:
      "MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.",
    datasource: {
      connectionString: {
        type: DatasourceFieldTypes.STRING,
        required: true,
        default: "mongodb://localhost:27017",
      },
      db: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      collection: {
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
    },
  }

  class MongoIntegration {
    private config: MongoDBConfig
    private client: any

    constructor(config: MongoDBConfig) {
      this.config = config
      this.client = new MongoClient(config.connectionString)
    }

    async connect() {
      return this.client.connect()
    }

    async create(query: { json: object }) {
      try {
        await this.connect()
        const db = this.client.db(this.config.db)
        const collection = db.collection(this.config.collection)
        return collection.insertOne(query.json)
      } catch (err) {
        console.error("Error writing to mongodb", err)
        throw err
      } finally {
        await this.client.close()
      }
    }

    async read(query: { json: object }) {
      try {
        await this.connect()
        const db = this.client.db(this.config.db)
        const collection = db.collection(this.config.collection)
        return collection.find(query.json).toArray()
      } catch (err) {
        console.error("Error querying mongodb", err)
        throw err
      } finally {
        await this.client.close()
      }
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: MongoIntegration,
  }
}
