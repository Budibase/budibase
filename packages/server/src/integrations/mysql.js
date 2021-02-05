const mysql = require("mysql")
const { FIELD_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://github.com/mysqljs/mysql",
  datasource: {
    host: {
      type: FIELD_TYPES.STRING,
      default: "localhost",
      required: true,
    },
    port: {
      type: FIELD_TYPES.NUMBER,
      default: 1433,
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

class MySQLIntegration {
  constructor(config) {
    this.config = config
    this.client = mysql.createConnection(config)
  }

  query(query) {
    // Node MySQL is callback based, so we must wrap our call in a promise
    return new Promise((resolve, reject) => {
      this.client.connect()
      return this.client.query(query.sql, (error, results) => {
        if (error) return reject(error)
        resolve(results)
        this.client.end()
      })
    })
  }

  create(query) {
    return this.query(query)
  }

  read(query) {
    return this.query(query)
  }

  update(query) {
    return this.query(query)
  }

  delete(query) {
    return this.query(query)
  }
}

module.exports = {
  schema: SCHEMA,
  integration: MySQLIntegration,
}
