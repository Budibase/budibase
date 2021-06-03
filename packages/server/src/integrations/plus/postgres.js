const { Pool } = require("pg")
const { FieldTypes } = require("../../constants")

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

class PostgresPlus {
  static pool
  COLUMNS_SQL =
    "select * from information_schema.columns where table_schema = 'public'"

  constructor(config) {
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
      // table key doesn't exist yet
      if (!tables[column.table_name]) {
        tables[column.table_name] = []
      }

      // Add the new column
      const columnData = {
        type: TYPE_MAP[column.data_type] || "unknown",
        table: column.table_name,
        name: column.column_name,
        updateable: column.is_updatable,
        precision: column.numeric_precision,
        nullable: column.is_nullable === "YES",
      }
      tables[column.table_name].push(columnData)
    }
    this.tables = tables
  }
}

module.exports = PostgresPlus
