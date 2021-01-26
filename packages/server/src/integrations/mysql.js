const mysql = require("mysql")

const SCHEMA = {
  docs: "https://github.com/mysqljs/mysql",
  datasource: {
    host: {
      type: "string",
      default: "localhost",
      required: true,
    },
    user: {
      type: "string",
      default: "root",
      required: true,
    },
    password: {
      type: "password",
      default: "root",
      required: true,
    },
    database: {
      type: "string",
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
