const sqlServer = require("mssql")
const { FIELD_TYPES } = require("./Integration")
const Sql = require("./base/sql")

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
    encrypt: {
      type: FIELD_TYPES.BOOLEAN,
      default: true,
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

async function internalQuery(client, sql) {
  try {
    return await client.query(sql)
  } catch (err) {
    throw new Error(err)
  }
}


class SqlServerIntegration extends Sql {
  static pool

  constructor(config) {
    super("mssql")
    this.config = config
    this.config.options = {
      encrypt: this.config.encrypt,
    }
    delete this.config.encrypt
    if (!this.pool) {
      this.pool = new sqlServer.ConnectionPool(this.config)
    }
  }

  async connect() {
    try {
      const client = await this.pool.connect()
      this.client = client.request()
    } catch (err) {
      throw new Error(err)
    }
  }

  async read(query) {
    await this.connect()
    const response = await internalQuery(this.client, query.sql)
    return response.recordset
  }

  async create(query) {
    await this.connect()
    const response = await internalQuery(this.client, query.sql)
    return response.recordset || [{ created: true }]
  }

  async update(query) {
    await this.connect()
    const response = await internalQuery(this.client, query.sql)
    return response.recordset || [{ updated: true }]
  }

  async delete(query) {
    await this.connect()
    const response = await internalQuery(this.client, query.sql)
    return response.recordset || [{ deleted: true }]
  }

  async query(json) {
    const operation = this._operation(json).toLowerCase()
    const input = this._query(json)
    const response = await internalQuery(this.client, input)
    return response.recordset ? response.recordset : [{ [operation]: true }]
  }
}

module.exports = {
  schema: SCHEMA,
  integration: SqlServerIntegration,
}
