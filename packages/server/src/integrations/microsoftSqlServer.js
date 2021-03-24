const sqlServer = require("mssql")
const { FIELD_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://github.com/tediousjs/node-mssql",
  description:
    "Microsoft SQL Server is a relational database management system developed by Microsoft. ",
  friendlyName: "MS SQL Server",
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
    port: {
      type: FIELD_TYPES.NUMBER,
      required: false,
      default: 1433,
    },
    database: {
      type: FIELD_TYPES.STRING,
      default: "root",
    },
  },
  query: {
    create: {
      type: "sql",
    },
    read: {
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
      return response.recordset || [{ created: true }]
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
