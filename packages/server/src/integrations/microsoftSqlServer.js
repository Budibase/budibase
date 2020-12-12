const sqlServer = require("mssql")

const SQL_SERVER_OPTIONS = {
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
  query: {
    type: "query",
    required: true,
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

  async query() {
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
  schema: SQL_SERVER_OPTIONS,
  integration: SqlServerIntegration,
}
