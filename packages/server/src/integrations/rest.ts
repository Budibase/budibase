import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"

module RestModule {
  const fetch = require("node-fetch")

  interface RestConfig {
    url: string
    defaultHeaders: {
      [key: string]: any
    }
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/node-fetch/node-fetch",
    description:
      "Representational state transfer (REST) is a de-facto standard for a software architecture for interactive applications that typically use multiple Web services. ",
    friendlyName: "REST API",
    datasource: {
      url: {
        type: DatasourceFieldTypes.STRING,
        default: "localhost",
        required: true,
      },
      defaultHeaders: {
        type: DatasourceFieldTypes.OBJECT,
        required: false,
        default: {},
      },
    },
    query: {
      create: {
        readable: true,
        displayName: "POST",
        type: QueryTypes.FIELDS,
        urlDisplay: true,
        fields: {
          path: {
            type: DatasourceFieldTypes.STRING,
          },
          queryString: {
            type: DatasourceFieldTypes.STRING,
          },
          headers: {
            type: DatasourceFieldTypes.OBJECT,
          },
          requestBody: {
            type: DatasourceFieldTypes.JSON,
          },
        },
      },
      read: {
        displayName: "GET",
        readable: true,
        type: QueryTypes.FIELDS,
        urlDisplay: true,
        fields: {
          path: {
            type: DatasourceFieldTypes.STRING,
          },
          queryString: {
            type: DatasourceFieldTypes.STRING,
          },
          headers: {
            type: DatasourceFieldTypes.OBJECT,
          },
        },
      },
      update: {
        displayName: "PUT",
        readable: true,
        type: QueryTypes.FIELDS,
        urlDisplay: true,
        fields: {
          path: {
            type: DatasourceFieldTypes.STRING,
          },
          queryString: {
            type: DatasourceFieldTypes.STRING,
          },
          headers: {
            type: DatasourceFieldTypes.OBJECT,
          },
          requestBody: {
            type: DatasourceFieldTypes.JSON,
          },
        },
      },
      delete: {
        displayName: "DELETE",
        type: QueryTypes.FIELDS,
        urlDisplay: true,
        fields: {
          path: {
            type: DatasourceFieldTypes.STRING,
          },
          queryString: {
            type: DatasourceFieldTypes.STRING,
          },
          headers: {
            type: DatasourceFieldTypes.OBJECT,
          },
          requestBody: {
            type: DatasourceFieldTypes.JSON,
          },
        },
      },
    },
  }

  class RestIntegration {
    private config: RestConfig
    private headers: {
      [key: string]: string
    } = {}

    constructor(config: RestConfig) {
      this.config = config
    }

    async parseResponse(response: any) {
      switch (this.headers.Accept) {
        case "application/json":
          return await response.json()
        case "text/html":
          return await response.text()
        default:
          return await response.json()
      }
    }

    async create({ path = "", queryString = "", headers = {}, json = {} }) {
      this.headers = {
        ...this.config.defaultHeaders,
        ...headers,
      }

      const response = await fetch(this.config.url + path + queryString, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(json),
      })

      return await this.parseResponse(response)
    }

    async read({ path = "", queryString = "", headers = {} }) {
      this.headers = {
        ...this.config.defaultHeaders,
        ...headers,
      }

      const response = await fetch(this.config.url + path + queryString, {
        headers: this.headers,
      })

      return await this.parseResponse(response)
    }

    async update({ path = "", queryString = "", headers = {}, json = {} }) {
      this.headers = {
        ...this.config.defaultHeaders,
        ...headers,
      }

      const response = await fetch(this.config.url + path + queryString, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(json),
      })

      return await this.parseResponse(response)
    }

    async delete({ path = "", queryString = "", headers = {} }) {
      this.headers = {
        ...this.config.defaultHeaders,
        ...headers,
      }

      const response = await fetch(this.config.url + path + queryString, {
        method: "DELETE",
        headers: this.headers,
      })

      return await this.parseResponse(response)
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: RestIntegration,
  }
}
