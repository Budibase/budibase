const { MongoClient } = require("mongodb")

const MONGODB_OPTIONS = {
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
  query: {
    type: "query",
    required: true,
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

  async query() {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(this.config.collection)
      const result = await collection.find(this.config.query).toArray()
      return result
    } finally {
      await this.client.close()
    }
  }
}

module.exports = {
  schema: MONGODB_OPTIONS,
  integration: MongoIntegration,
}
