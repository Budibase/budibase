const mysql = require("mysql")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://github.com/mysqljs/mysql",
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

class MySQLIntegration {
  constructor(config) {
    this.config = config
    if (Object.keys(config.ssl).length === 0) {
      delete config.ssl
    }
    this.client = mysql.createConnection(config)
  }

  query(query) {
    // Node MySQL is callback based, so we must wrap our call in a promise
    return new Promise((resolve, reject) => {
      this.client.connect()
      console.log(this.client.query())
      return this.client.query(query.sql, (error, results) => {
        if (error) return reject(error)
        resolve(results)
        this.client.end()
      })
    })
  }

  async create(query) {
    const results = await this.query(query)
    return results.length ? results : { created: true }
  }

  read(query) {
    return this.query(query)
  }

  async update(query) {
    const results = await this.query(query)
    return results.length ? results : { updated: true }
  }

  async delete(query) {
    const results = await this.query(query)
    return results.length ? results : { deleted: true }
  }
}

module.exports = {
  schema: SCHEMA,
  integration: MySQLIntegration,
}
