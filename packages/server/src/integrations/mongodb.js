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
    JSON: {
      type: "json",
    },
  },
}

class MongoIntegration {
  constructor(config) {
    this.config = config
    this.client = new MongoClient(config.connectionString)
    try {
      this.config.query = JSON.parse(this.config.query)
    } catch (err) {
      this.config.query = {}
    }
    this.connect()
  }

  async connect() {
    return this.client.connect()
  }

  async read() {
    try {
      const db = this.client.db(this.config.db)
      const collection = db.collection(this.config.collection)
      const result = await collection.find(this.config.query).toArray()
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
