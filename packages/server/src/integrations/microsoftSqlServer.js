const sqlServer = require("mssql")

const SCHEMA = {
  datasource: {
    user: {
      type: "string",
      required: true,
      default: "localhost",
    },
    password: {
      type: "password",
      required: true,
    },
    server: {
      type: "string",
      default: "localhost",
    },
    database: {
      type: "string",
      default: "root",
    },
  },
  query: {
    sql: {
      type: "sql",
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

  async read() {
    try {
      await this.connect()
      const response = await this.client.query(this.config.query)
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
