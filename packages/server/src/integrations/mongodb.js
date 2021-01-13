const { MongoClient } = require("mongodb")

const SCHEMA = {
  datasource: {
    connectionString: {
      type: "string",
      required: true,
      default: "localhost",
    },
    db: {
      type: "string",
      required: true,
    },
    collection: {
      type: "string",
      required: true,
    },
  },
  query: {
    create: {
      JSON: {
        type: "json",
      },
    },
    read: {
      JSON: {
        type: "json",
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
      const mongoQuery = query.json ? JSON.parse(query.json) : {}
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(this.config.collection)
      const result = await collection.insertOne(mongoQuery)
      return result
    } catch (err) {
      console.error("Error querying mongodb", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async read(query) {
    try {
      const mongoQuery = query.json ? JSON.parse(query.json) : {}
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(this.config.collection)
      const result = await collection.find(mongoQuery).toArray()
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
