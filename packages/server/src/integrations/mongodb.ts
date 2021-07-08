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
    // collection: string
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
        type: QueryTypes.JSON,
      }
    },
    extra: {
      collection: {
        displayName: "Collection", 
        type: DatasourceFieldTypes.STRING, 
        required: true, 
      },
      actionTypes: {
        displayName: "Action Types",
        type: DatasourceFieldTypes.LIST,
        required: true,
        data: {
          read: ['find', 'findOne', 'findOneAndUpdate', "count", "distinct"],
          create: ['insertOne', 'insertMany'],
          update: ['updateOne', 'updateMany'],
          delete: ['deleteOne', 'deleteMany']
        }
      }
    }
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

    async create(query: { json: object, extra: { [key: string]: string } }) {
      try {
        await this.connect()
        const db = this.client.db(this.config.db)
        const collection = db.collection(query.extra.collection)

        // For mongodb we add an extra actionType to specify 
        // which method we want to call on the collection
        switch(query.extra.actionTypes) {
          case 'insertOne': {
            return collection.insertOne(query.json)
          }
          case 'insertMany': {
            return collection.insertOne(query.json).toArray()
          }
          default: {
            throw new Error(`actionType ${query.extra.actionTypes} does not exist on DB for create`)
          }
        }
      } catch (err) {
        console.error("Error writing to mongodb", err)
        throw err
      } finally {
        await this.client.close()
      }
    }

    async read(query: { json: object, extra: { [key: string]: string } }) {
      try {
        await this.connect()
        const db = this.client.db(this.config.db)
        const collection = db.collection(query.extra.collection)

        switch(query.extra.actionTypes) {
          case 'find': {
            return collection.find(query.json).toArray()
          }
          case 'findOne': {
            return collection.findOne(query.json)
          }
          case 'findOneAndUpdate': {
            return collection.findOneAndUpdate(query.json)
          }
          case 'count': {
            return collection.countDocuments(query.json)
          }
          case 'distinct': {
            return collection.distinct(query.json)
          }
          default: {
            throw new Error(`actionType ${query.extra.actionTypes} does not exist on DB for read`)
          }
        }
      } catch (err) {
        console.error("Error querying mongodb", err)
        throw err
      } finally {
        await this.client.close()
      }
    }

    async update(query: { json: object, extra: { [key: string]: string } }) {
      try {
        await this.connect()
        const db = this.client.db(this.config.db)
        const collection = db.collection(query.extra.collection)

        switch(query.extra.actionTypes) {
          case 'updateOne': {
            return collection.updateOne(query.json)
          }
          case 'updateMany': {
            return collection.updateMany(query.json).toArray()
          }
          default: {
            throw new Error(`actionType ${query.extra.actionTypes} does not exist on DB for update`)
          }
        }
      } catch (err) {
        console.error("Error writing to mongodb", err)
        throw err
      } finally {
        await this.client.close()
      }
    }

    async delete(query: { json: object, extra: { [key: string]: string } }) {
      try {
        await this.connect()
        const db = this.client.db(this.config.db)
        const collection = db.collection(query.extra.collection)

        switch(query.extra.actionTypes) {
          case 'deleteOne': {
            return collection.deleteOne(query.json)
          }
          case 'deleteMany': {
            return collection.deleteMany(query.json).toArray()
          }
          default: {
            throw new Error(`actionType ${query.extra.actionTypes} does not exist on DB for delete`)
          }
        }
      } catch (err) {
        console.error("Error writing to mongodb", err)
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
