const { Client } = require("pg")

const POSTGRES_OPTIONS = {
  host: {
    type: "string",
    required: true,
    default: "localhost",
  },
  port: {
    type: "number",
    required: true,
    default: 5432,
  },
  database: {
    type: "string",
    default: "postgres",
  },
  username: {
    type: "string",
    default: "root",
  },
  password: {
    type: "password",
    default: "root",
  },
  query: {
    type: "query",
    required: true,
  },
}

class PostgresIntegration {
  constructor(config) {
    this.config = config
    this.client = new Client(config)
    this.connect()
  }

  async connect() {
    return this.client.connect()
  }

  async query() {
    const response = await this.client.query(this.config.query)
    return response.rows
  }
}

module.exports = {
  schema: POSTGRES_OPTIONS,
  integration: PostgresIntegration,
}
