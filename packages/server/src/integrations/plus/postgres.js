const Sql = require("../base/sql")
const { Pool } = require("pg")
const { FieldTypes } = require("../../constants")
const { FIELD_TYPES } = require("../Integration")

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
}

const SCHEMA = {
  friendlyName: "PostgreSQL",
  description:
    "PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.",
  plus: true,
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
}

class PostgresPlus extends Sql {
  static pool
  COLUMNS_SQL =
    "select * from information_schema.columns where table_schema = 'public'"

  constructor(config) {
    super("pg")
    this.config = config
    if (!this.pool) {
      this.pool = new Pool(this.config)
    }

    this.client = this.pool
  }

  async init() {
    const response = await this.client.query(this.COLUMNS_SQL)

    const tables = {}
    for (let column of response.rows) {
      const tableName = column.table_name
      const columnName = column.column_name

      // table key doesn't exist yet
      if (!tables[tableName]) {
        tables[tableName] = {
          _id: "something",
          name: tableName,
          schema: {},
        }
      }

      tables[tableName].schema[columnName] = {
        name: columnName,
        type: TYPE_MAP[column.data_type],
      }
    }
    this.tables = tables
  }

  async query(json) {
    const operation = this._operation(json).toLowerCase()
    const sql = this._query(json)
    const response = await this.client.query(sql)
    return response.rows.length ? response.rows : [{ [operation]: true }]
  }
}

module.exports = {
  schema: SCHEMA,
  integration: PostgresPlus,
}
