const { Client } = require("pg")

const SCHEMA = {
  datasource: {
    host: {
      type: "string",
      default: "localhost",
      required: true,
    },
    port: {
      type: "number",
      required: true,
      default: 5432,
    },
    database: {
      type: "string",
      default: "postgres",
      required: true,
    },
    username: {
      type: "string",
      default: "root",
      required: true,
    },
    password: {
      type: "password",
      default: "root",
      required: true,
    },
  },
  query: {
    SQL: {
      type: "sql",
    },
  },
}

class PostgresIntegration {
  constructor(config, query) {
    this.config = config
    this.queryString = this.buildQuery(query)
    this.client = new Client(config)
    this.connect()
  }

  buildQuery(query) {
    // TODO: account for different types
    return query
  }

  async connect() {
    return this.client.connect()
  }

  async create() {
    const response = await this.client.query(this.queryString)
    return response.rows
  }

  async read() {
    const response = await this.client.query(this.queryString)
    return response.rows
  }

  async update() {
    const response = await this.client.query(this.queryString)
    return response.rows
  }

  async delete() {
    const response = await this.client.query(this.queryString)
    return response.rows
  }
}

module.exports = {
  schema: SCHEMA,
  integration: PostgresIntegration,
}
