const { MongoClient } = require("mongodb")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://github.com/mongodb/node-mongodb-native",
  datasource: {
    connectionString: {
      type: FIELD_TYPES.STRING,
      required: true,
      default: "mongodb://localhost:27017",
    },
    db: {
      type: FIELD_TYPES.STRING,
      required: true,
    },
    collection: {
      type: FIELD_TYPES.STRING,
      required: true,
    },
  },
  query: {
    create: {
      JSON: {
        type: QUERY_TYPES.JSON,
      },
    },
    read: {
      JSON: {
        type: QUERY_TYPES.JSON,
      },
    },
  },
}

class MongoIntegration {
  constructor(config) {
    this.config = config
    this.client = new MongoClient(config.connectionString)
  }

  async connect() {
    return this.client.connect()
  }

  async create(query) {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(this.config.collection)
      const result = await collection.insertOne(query.json)
      return result
    } catch (err) {
      console.error("Error writing to mongodb", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async read(query) {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(this.config.collection)
      const result = await collection.find(query.json).toArray()
      return result
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
