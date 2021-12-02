import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"
import { IntegrationBase } from "./base/IntegrationBase"

const BodyTypes = {
  NONE: "none",
  FORM_DATA: "form",
  ENCODED: "encoded",
  JSON: "json",
  TEXT: "text",
}

const coreFields = {
  path: {
    type: DatasourceFieldTypes.STRING,
    display: "URL",
  },
  queryString: {
    type: DatasourceFieldTypes.STRING,
  },
  headers: {
    type: DatasourceFieldTypes.OBJECT,
  },
  enabledHeaders: {
    type: DatasourceFieldTypes.OBJECT,
  },
  requestBody: {
    type: DatasourceFieldTypes.JSON,
  },
  bodyType: {
    type: DatasourceFieldTypes.STRING,
  },
}

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
      "With the REST API datasource, you can connect, query and pull data from multiple REST APIs. You can then use the retrieved data to build apps.",
    friendlyName: "REST API",
    datasource: {
      url: {
        type: DatasourceFieldTypes.STRING,
        default: "",
        required: false,
        deprecated: true,
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
        fields: coreFields,
      },
      read: {
        displayName: "GET",
        readable: true,
        type: QueryTypes.FIELDS,
        fields: coreFields,
      },
      update: {
        displayName: "PUT",
        readable: true,
        type: QueryTypes.FIELDS,
        fields: coreFields,
      },
      patch: {
        displayName: "PATCH",
        readable: true,
        type: QueryTypes.FIELDS,
        fields: coreFields,
      },
      delete: {
        displayName: "DELETE",
        type: QueryTypes.FIELDS,
        fields: coreFields,
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
      const main = `${path}?${queryString}`
      if (!this.config.url) {
        return main
      } else {
        return `${this.config.url}/${main}`
      }
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
