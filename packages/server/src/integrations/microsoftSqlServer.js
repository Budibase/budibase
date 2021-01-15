const sqlServer = require("mssql")
const { FIELD_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://github.com/tediousjs/node-mssql",
  datasource: {
    user: {
      type: FIELD_TYPES.STRING,
      required: true,
      default: "localhost",
    },
    password: {
      type: FIELD_TYPES.PASSWORD,
      required: true,
    },
    server: {
      type: FIELD_TYPES.STRING,
      default: "localhost",
    },
    database: {
      type: FIELD_TYPES.STRING,
      default: "root",
    },
  },
  query: {
    create: {
      SQL: {
        type: "sql",
      },
    },
    read: {
      SQL: {
        type: "sql",
      },
    },
  },
}

class SqlServerIntegration {
  constructor(config) {
    this.config = config
    this.client = sqlServer
  }

  async connect() {
    return await this.client.connect(this.config)
  }

  async read(query) {
    try {
      await this.connect()
      const response = await this.client.query(query.sql)
      return response.recordset
    } catch (err) {
      console.error("Error querying MS SQL Server", err)
      throw err
    }
  }

  async create(query) {
    try {
      await this.connect()
      const response = await this.client.query(query.sql)
      return response.recordset
    } catch (err) {
      console.error("Error querying MS SQL Server", err)
      throw err
    }
  }
}

module.exports = {
  schema: SCHEMA,
  integration: SqlServerIntegration,
}
