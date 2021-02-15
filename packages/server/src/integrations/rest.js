const fetch = require("node-fetch")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://github.com/node-fetch/node-fetch",
  datasource: {
    url: {
      type: FIELD_TYPES.STRING,
      default: "localhost",
      required: true,
    },
  },
  query: {
    read: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        path: {
          type: FIELD_TYPES.STRING,
        },
        headers: {
          type: FIELD_TYPES.OBJECT,
        },
      },
    },
  },
}

class RestIntegration {
  constructor(config) {
    this.config = config
  }

  // create(query) {
  //   return this.query(query)
  // }

  async read({ path, headers = {} }) {
    const response = await fetch(this.config.url + path, {
      headers,
    })

    return await response.json()
  }

  // update(query) {
  //   return this.query(query)
  // }

  // delete(query) {
  //   return this.query(query)
  // }
}

module.exports = {
  schema: SCHEMA,
  integration: RestIntegration,
}
