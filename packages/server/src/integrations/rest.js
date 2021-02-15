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
    create: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        path: {
          type: FIELD_TYPES.STRING,
        },
        headers: {
          type: FIELD_TYPES.OBJECT,
        },
        requestBody: {
          type: FIELD_TYPES.JSON,
        },
      },
    },
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
    update: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        path: {
          type: FIELD_TYPES.STRING,
        },
        headers: {
          type: FIELD_TYPES.OBJECT,
        },
        requestBody: {
          type: FIELD_TYPES.JSON,
        },
      },
    },
    delete: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        path: {
          type: FIELD_TYPES.STRING,
        },
        headers: {
          type: FIELD_TYPES.OBJECT,
        },
        requestBody: {
          type: FIELD_TYPES.JSON,
        },
      },
    },
  },
}

class RestIntegration {
  constructor(config) {
    this.config = config
  }

  async create({ path, headers = {}, requestBody }) {
    const response = await fetch(this.config.url + path, {
      method: "POST",
      headers,
      body: requestBody,
    })

    return await response.json()
  }

  async read({ path, headers = {} }) {
    const response = await fetch(this.config.url + path, {
      headers,
    })

    return await response.json()
  }

  async update({ path, headers = {}, requestBody }) {
    const response = await fetch(this.config.url + path, {
      method: "POST",
      headers,
      body: requestBody,
    })

    return await response.json()
  }

  async delete({ path, headers = {} }) {
    const response = await fetch(this.config.url + path, {
      method: "DELETE",
      headers,
    })

    return await response.json()
  }
}

module.exports = {
  schema: SCHEMA,
  integration: RestIntegration,
}
