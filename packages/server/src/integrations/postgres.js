const { Pool } = require("pg")
const { FIELD_TYPES } = require("./Integration")
const Sql = require("./base/sql")

const SCHEMA = {
  docs: "https://node-postgres.com",
  friendlyName: "PostgreSQL",
  description:
    "PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.",
  datasource: {
    host: {
      type: FIELD_TYPES.STRING,
      default: "localhost",
      required: true,
    },
    port: {
      type: FIELD_TYPES.NUMBER,
      required: true,
      default: 5432,
    },
    database: {
      type: FIELD_TYPES.STRING,
      default: "postgres",
      required: true,
    },
    user: {
      type: FIELD_TYPES.STRING,
      default: "root",
      required: true,
    },
    password: {
      type: FIELD_TYPES.PASSWORD,
      default: "root",
      required: true,
    },
    ssl: {
      type: FIELD_TYPES.BOOLEAN,
      default: false,
      required: false,
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


class PostgresIntegration extends Sql {
  static pool

  constructor(config) {
    super("pg")
    this.config = config
    if (this.config.ssl) {
      this.config.ssl = {
        rejectUnauthorized: true,
      }
    }

    if (!this.pool) {
      this.pool = new Pool(this.config)
    }

    this.client = this.pool
  }

  async create({ sql }) {
    const response = await internalQuery(this.client, sql)
    return response.rows.length ? response.rows : [{ created: true }]
  }

  async read({ sql }) {
    const response = await internalQuery(this.client, sql)
    return response.rows
  }

  async update({ sql }) {
    const response = await internalQuery(this.client, sql)
    return response.rows.length ? response.rows : [{ updated: true }]
  }

  async delete({ sql }) {
    const response = await internalQuery(this.client, sql)
    return response.rows.length ? response.rows : [{ deleted: true }]
  }

  async query(json) {
    // TODO: get the schema
    const operation = this._operation(json).toLowerCase()
    const input = this._query(json)
    const response = await internalQuery(this.client, input)
    return response.rows.length ? response.rows : [{ [operation]: true }]
  }
}

module.exports = {
  schema: SCHEMA,
  integration: PostgresIntegration,
}
