const mysql = require("mysql")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")
const Sql = require("./base/sql")
const { buildExternalTableId, convertType } = require("./utils")
const { FieldTypes } = require("../constants")

const TYPE_MAP = {
  text: FieldTypes.LONGFORM,
  blob: FieldTypes.LONGFORM,
  enum: FieldTypes.STRING,
  varchar: FieldTypes.STRING,
  int: FieldTypes.NUMBER,
  numeric: FieldTypes.NUMBER,
  bigint: FieldTypes.NUMBER,
  mediumint: FieldTypes.NUMBER,
  decimal: FieldTypes.NUMBER,
  dec: FieldTypes.NUMBER,
  double: FieldTypes.NUMBER,
  real: FieldTypes.NUMBER,
  fixed: FieldTypes.NUMBER,
  smallint: FieldTypes.NUMBER,
  timestamp: FieldTypes.DATETIME,
  date: FieldTypes.DATETIME,
  datetime: FieldTypes.DATETIME,
  time: FieldTypes.DATETIME,
  tinyint: FieldTypes.BOOLEAN,
  json: FIELD_TYPES.JSON,
}

const SCHEMA = {
  docs: "https://github.com/mysqljs/mysql",
  plus: true,
  friendlyName: "MySQL",
  description:
    "MySQL Database Service is a fully managed database service to deploy cloud-native applications. ",
  datasource: {
    host: {
      type: FIELD_TYPES.STRING,
      default: "localhost",
      required: true,
    },
    port: {
      type: FIELD_TYPES.NUMBER,
      default: 3306,
      required: false,
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
    database: {
      type: FIELD_TYPES.STRING,
      required: true,
    },
    ssl: {
      type: FIELD_TYPES.OBJECT,
      required: false,
    },
  },
  query: {
    create: {
      type: QUERY_TYPES.SQL,
    },
    read: {
      type: QUERY_TYPES.SQL,
    },
    update: {
      type: QUERY_TYPES.SQL,
    },
    delete: {
      type: QUERY_TYPES.SQL,
    },
  },
}

function internalQuery(client, query, connect = true) {
  const sql = typeof query === "string" ? query : query.sql
  const bindings = typeof query === "string" ? {} : query.bindings
  // Node MySQL is callback based, so we must wrap our call in a promise
  return new Promise((resolve, reject) => {
    if (connect) {
      client.connect()
    }
    return client.query(sql, bindings, (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
      if (connect) {
        client.end()
      }
    })
  })
}

class MySQLIntegration extends Sql {
  GET_TABLES_SQL =
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
    super("mysql")
    this.config = config
    if (config.ssl && Object.keys(config.ssl).length === 0) {
      delete config.ssl
    }
    this.client = mysql.createConnection(config)
  }

  async buildSchema(datasourceId) {
    const tables = {}
    const database = this.config.database
    this.client.connect()

    // get the tables first
    const tablesResp = await internalQuery(this.client, "SHOW TABLES;", false)
    const tableNames = tablesResp.map(obj => obj[`Tables_in_${database}`])
    for (let tableName of tableNames) {
      const primaryKeys = []
      const schema = {}
      const descResp = await internalQuery(this.client, `DESCRIBE ${tableName};`, false)
      for (let column of descResp) {
        const columnName = column.Field
        if (column.Key === "PRI") {
          primaryKeys.push(columnName)
        }
        const constraints = {}
        if (column.Null !== "YES") {
          constraints.required = true
        }
        schema[columnName] = {
          name: columnName,
          type: convertType(column.Type, TYPE_MAP),
          constraints,
        }
      }
      // for now just default to first column
      if (primaryKeys.length === 0) {
        primaryKeys.push(descResp[0].Field)
      }
      if (!tables[tableName]) {
        tables[tableName] = {
          _id: buildExternalTableId(datasourceId, tableName),
          primary: primaryKeys,
          name: tableName,
          schema,
        }
      }
    }

    this.client.end()
    this.tables = tables
  }

  async create(query) {
    const results = await internalQuery(this.client, query)
    return results.length ? results : [{ created: true }]
  }

  read(query) {
    return internalQuery(this.client, query)
  }

  async update(query) {
    const results = await internalQuery(this.client, query)
    return results.length ? results : [{ updated: true }]
  }

  async delete(query) {
    const results = await internalQuery(this.client, query)
    return results.length ? results : [{ deleted: true }]
  }

  async query(json) {
    const operation = this._operation(json).toLowerCase()
    const input = this._query(json)
    const results = await internalQuery(this.client, input)
    return results.length ? results : [{ [operation]: true }]
  }
}

module.exports = {
  schema: SCHEMA,
  integration: MySQLIntegration,
}
