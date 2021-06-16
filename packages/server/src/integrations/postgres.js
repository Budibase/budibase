const { Pool } = require("pg")
const { FIELD_TYPES } = require("./Integration")
const Sql = require("./base/sql")
const { FieldTypes } = require("../constants")
const { SEPARATOR } = require("@budibase/auth/db")
const { buildExternalTableId } = require("./utils")

const SCHEMA = {
  docs: "https://node-postgres.com",
  plus: true,
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

const TYPE_MAP = {
  text: FieldTypes.LONGFORM,
  varchar: FieldTypes.STRING,
  integer: FieldTypes.NUMBER,
  bigint: FieldTypes.NUMBER,
  decimal: FieldTypes.NUMBER,
  smallint: FieldTypes.NUMBER,
  timestamp: FieldTypes.DATETIME,
  time: FieldTypes.DATETIME,
  boolean: FieldTypes.BOOLEAN,
  json: FIELD_TYPES.JSON,
}

async function internalQuery(client, sql) {
  try {
    return await client.query(sql.sql, sql.bindings)
  } catch (err) {
    throw new Error(err)
  }
}

class PostgresIntegration extends Sql {
  static pool

  COLUMNS_SQL =
    "select * from information_schema.columns where table_schema = 'public'"

  PRIMARY_KEYS_SQL = `
    select tc.table_schema, tc.table_name, kc.column_name as primary_key 
    from information_schema.table_constraints tc
    join 
      information_schema.key_column_usage kc on kc.table_name = tc.table_name 
      and kc.table_schema = tc.table_schema 
      and kc.constraint_name = tc.constraint_name
    where tc.constraint_type = 'PRIMARY KEY';
  `

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

  /**
   * Fetches the tables from the postgres table and assigns them to the datasource.
   * @param {*} datasourceId - datasourceId to fetch
   */
  async buildSchema(datasourceId) {
    let keys = []
    try {
      const primaryKeysResponse = await this.client.query(this.PRIMARY_KEYS_SQL)
      for (let table of primaryKeysResponse.rows) {
        keys.push(table.column_name || table.primary_key)
      }
    } catch (err) {
      // TODO: this try catch method isn't right
      keys = ["id"]
    }

    const columnsResponse = await this.client.query(this.COLUMNS_SQL)
    const tables = {}

    for (let column of columnsResponse.rows) {
      const tableName = column.table_name
      const columnName = column.column_name

      // table key doesn't exist yet
      if (!tables[tableName]) {
        tables[tableName] = {
          _id: buildExternalTableId(datasourceId, tableName),
          // TODO: this needs to accommodate composite keys
          primary: keys,
          name: tableName,
          schema: {},
        }
      }

      tables[tableName].schema[columnName] = {
        name: columnName,
        type: TYPE_MAP[column.data_type] || FIELD_TYPES.STRING,
      }
    }
    this.tables = tables
  }

  async create(sql) {
    const response = await internalQuery(this.client, sql)
    return response.rows.length ? response.rows : [{ created: true }]
  }

  async read(sql) {
    const response = await internalQuery(this.client, sql)
    return response.rows
  }

  async update(sql) {
    const response = await internalQuery(this.client, sql)
    return response.rows.length ? response.rows : [{ updated: true }]
  }

  async delete({ sql }) {
    const response = await internalQuery(this.client, sql)
    return response.rows.length ? response.rows : [{ deleted: true }]
  }

  async query(json) {
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
