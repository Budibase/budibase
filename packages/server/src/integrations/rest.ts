import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"
import { IntegrationBase } from "./base/IntegrationBase"

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
      patch: {
        displayName: "PATCH",
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

  class RestIntegration implements IntegrationBase {
    private config: RestConfig
    private headers: {
      [key: string]: string
    } = {}

    constructor(config: RestConfig) {
      this.config = config
    }

    async parseResponse(response: any) {
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json()
      } else {
        return await response.text()
      }
    }

    getUrl(path: string, queryString: string): string {
      return `${this.config.url}/${path}?${queryString}`
    }

    async create({ path = "", queryString = "", headers = {}, json = {} }) {
      this.headers = {
        ...this.config.defaultHeaders,
        ...headers,
      }

      const response = await fetch(this.getUrl(path, queryString), {
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

      const response = await fetch(this.getUrl(path, queryString), {
        headers: this.headers,
      })

      return await this.parseResponse(response)
    }

    async update({ path = "", queryString = "", headers = {}, json = {} }) {
      this.headers = {
        ...this.config.defaultHeaders,
        ...headers,
      }

      const response = await fetch(this.getUrl(path, queryString), {
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(json),
      })

      return await this.parseResponse(response)
    }

    async patch({ path = "", queryString = "", headers = {}, json = {} }) {
      this.headers = {
        ...this.config.defaultHeaders,
        ...headers,
      }

      const response = await fetch(this.getUrl(path, queryString), {
        method: "PATCH",
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

      const response = await fetch(this.getUrl(path, queryString), {
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
