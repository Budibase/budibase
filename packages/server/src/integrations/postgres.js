const { Client } = require("pg")

const SCHEMA = {
  docs: "https://node-postgres.com",
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
    user: {
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
    create: {
      type: "sql",
    },
    read: {
      type: "sql",
    },
    update: {
      type: "sql",
    },
    delete: {
      type: "sql",
    },
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

  async create({ sql }) {
    const response = await this.client.query(sql)
    return response.rows
  }

  async read({ sql }) {
    const response = await this.client.query(sql)
    return response.rows
  }

  async update({ sql }) {
    const response = await this.client.query(sql)
    return response.rows
  }

  async delete({ sql }) {
    const response = await this.client.query(sql)
    return response.rows
  }
}

module.exports = {
  schema: SCHEMA,
  integration: PostgresIntegration,
}
