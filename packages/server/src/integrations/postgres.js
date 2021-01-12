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
    "Simple Query": {
      type: "fields",
      fields: {
        table: {
          type: "string",
        },
        column: {
          type: "string",
        },
        condition: {
          type: "options",
          options: [
            {
              name: "Equals",
              value: "=",
            },
            {
              name: "Not Equals",
              value: "!=",
            },
            {
              name: "Greater Than",
              value: ">",
            },
            {
              name: "Less Than",
              value: "<",
            },
          ],
        },
        value: {
          type: "string",
        },
      },
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

  // async create() {

  // }

  async read() {
    const response = await this.client.query(this.queryString)
    return response.rows
  }

  // async update() {

  // }

  // async delete() {

  // }

  // async query() {
  //   const response = await this.client.query(this.queryString)
  //   return response.rows
  // }
}

module.exports = {
  schema: SCHEMA,
  integration: PostgresIntegration,
}
