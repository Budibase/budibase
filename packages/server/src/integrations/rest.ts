import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
  RestConfig,
  RestQueryFields as RestQuery,
  AuthType,
  BasicAuthConfig,
  BearerAuthConfig,
} from "../definitions/datasource"
import { IntegrationBase } from "./base/IntegrationBase"

const BodyTypes = {
  NONE: "none",
  FORM_DATA: "form",
  XML: "xml",
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
    enum: Object.values(BodyTypes),
  },
}

module RestModule {
  const fetch = require("node-fetch")
  const { formatBytes } = require("../utilities")
  const { performance } = require("perf_hooks")
  const FormData = require("form-data")
  const { URLSearchParams } = require("url")
  const xmlParser = require("xml2js").parseStringPromise

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
    private startTimeMs: number = performance.now()

    constructor(config: RestConfig) {
      this.config = config
    }

    async parseResponse(response: any) {
      let data, raw, headers
      const contentType = response.headers.get("content-type") || ""
      try {
        if (contentType.includes("application/json")) {
          data = await response.json()
          raw = JSON.stringify(data)
        } else if (
          contentType.includes("text/xml") ||
          contentType.includes("application/xml")
        ) {
          const rawXml = await response.text()
          data =
            (await xmlParser(rawXml, {
              explicitArray: false,
              trim: true,
              explicitRoot: false,
            })) || {}
          // there is only one structure, its an array, return the array so it appears as rows
          const keys = Object.keys(data)
          if (keys.length === 1 && Array.isArray(data[keys[0]])) {
            data = data[keys[0]]
          }
          raw = rawXml
        } else {
          data = await response.text()
          raw = data
        }
      } catch (err) {
        throw "Failed to parse response body."
      }
      const size = formatBytes(
        response.headers.get("content-length") || Buffer.byteLength(raw, "utf8")
      )
      const time = `${Math.round(performance.now() - this.startTimeMs)}ms`
      headers = response.headers.raw()
      for (let [key, value] of Object.entries(headers)) {
        headers[key] = Array.isArray(value) ? value[0] : value
      }
      return {
        data,
        info: {
          code: response.status,
          size,
          time,
        },
        extra: {
          raw,
          headers,
        },
      }
    }

    getUrl(path: string, queryString: string): string {
      const main = `${path}?${queryString}`
      let complete = main
      if (this.config.url && !main.startsWith(this.config.url)) {
        complete = !this.config.url ? main : `${this.config.url}/${main}`
      }
      if (!complete.startsWith("http")) {
        complete = `http://${complete}`
      }
      return complete
    }

    addBody(bodyType: string, body: string | any, input: any) {
      let error, object, string
      try {
        string = typeof body !== "string" ? JSON.stringify(body) : body
        object = typeof body === "object" ? body : JSON.parse(body)
      } catch (err) {
        error = err
      }
      switch (bodyType) {
        case BodyTypes.TEXT:
          // content type defaults to plaintext
          input.body = string
          break
        case BodyTypes.ENCODED:
          const params = new URLSearchParams()
          for (let [key, value] of Object.entries(object)) {
            params.append(key, value)
          }
          input.body = params
          break
        case BodyTypes.FORM_DATA:
          const form = new FormData()
          for (let [key, value] of Object.entries(object)) {
            form.append(key, value)
          }
          input.body = form
          break
        case BodyTypes.XML:
          input.body = string
          input.headers["Content-Type"] = "text/xml"
          break
        default:
        case BodyTypes.JSON:
          // if JSON error, throw it
          if (error) {
            throw "Invalid JSON for request body"
          }
          input.body = object
          input.headers["Content-Type"] = "application/json"
          break
      }
      return input
    }

    getAuthHeaders(authConfigId: string): { [key: string]: any } {
      let headers: any = {}

      if (this.config.authConfigs && authConfigId) {
        const authConfig = this.config.authConfigs.filter(
          c => c._id === authConfigId
        )[0]
        // check the config still exists before proceeding
        // if not - do nothing
        if (authConfig) {
          let config
          switch (authConfig.type) {
            case AuthType.BASIC:
              config = authConfig.config as BasicAuthConfig
              headers.Authorization = `Basic ${Buffer.from(
                `${config.username}:${config.password}`
              ).toString("base64")}`
              break
            case AuthType.BEARER:
              config = authConfig.config as BearerAuthConfig
              headers.Authorization = `Bearer ${config.token}`
              break
          }
        }
      }

      return headers
    }

    async _req(query: RestQuery) {
      const {
        path = "",
        queryString = "",
        headers = {},
        method = "GET",
        disabledHeaders,
        bodyType,
        requestBody,
        authConfigId,
      } = query
      const authHeaders = this.getAuthHeaders(authConfigId)

      this.headers = {
        ...this.config.defaultHeaders,
        ...headers,
        ...authHeaders,
      }

      if (disabledHeaders) {
        for (let headerKey of Object.keys(this.headers)) {
          if (disabledHeaders[headerKey]) {
            delete this.headers[headerKey]
          }
        }
      }

      let input: any = { method, headers: this.headers }
      if (requestBody) {
        input = this.addBody(bodyType, requestBody, input)
      }

      this.startTimeMs = performance.now()
      const url = this.getUrl(path, queryString)
      const response = await fetch(url, input)
      return await this.parseResponse(response)
    }

    async create(opts: RestQuery) {
      return this._req({ ...opts, method: "POST" })
    }

    async read(opts: RestQuery) {
      return this._req({ ...opts, method: "GET" })
    }

    async update(opts: RestQuery) {
      return this._req({ ...opts, method: "PUT" })
    }

    async patch(opts: RestQuery) {
      return this._req({ ...opts, method: "PATCH" })
    }

    async delete(opts: RestQuery) {
      return this._req({ ...opts, method: "DELETE" })
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: RestIntegration,
    AuthType,
  }
}
