const fetch = require("node-fetch")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://github.com/node-fetch/node-fetch",
  friendlyName: "REST API",
  datasource: {
    url: {
      type: FIELD_TYPES.STRING,
      default: "localhost",
      required: true,
    },
    defaultHeaders: {
      type: FIELD_TYPES.OBJECT,
      required: false,
      default: {},
    },
  },
  query: {
    create: {
      displayName: "POST",
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
      displayName: "GET",
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
      displayName: "PUT",
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
      displayName: "DELETE",
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

  async create({ path, headers = {}, json }) {
    const response = await fetch(this.config.url + path, {
      method: "POST",
      headers: {
        ...this.config.defaultHeaders,
        ...headers,
      },
      body: JSON.stringify(json),
    })

    return await response.json()
  }

  async read({ path, headers = {} }) {
    const response = await fetch(this.config.url + path, {
      headers: {
        ...this.config.defaultHeaders,
        ...headers,
      },
    })

    return await response.json()
  }

  async update({ path, headers = {}, json }) {
    const response = await fetch(this.config.url + path, {
      method: "POST",
      headers: {
        ...this.config.defaultHeaders,
        ...headers,
      },
      body: JSON.stringify(json),
    })

    return await response.json()
  }

  async delete({ path, headers = {} }) {
    const response = await fetch(this.config.url + path, {
      method: "DELETE",
      headers: {
        ...this.config.defaultHeaders,
        ...headers,
      },
    })

    return await response.json()
  }
}

module.exports = {
  schema: SCHEMA,
  integration: RestIntegration,
}
