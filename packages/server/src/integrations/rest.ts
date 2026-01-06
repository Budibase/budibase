import {
  BodyType,
  DatasourceFieldType,
  HttpMethod,
  Integration,
  IntegrationBase,
  JSONValue,
  PaginationConfig,
  PaginationValues,
  QueryType,
  RestAuthType,
  RestConfig,
  RestQueryFields as RestQuery,
} from "@budibase/types"
import get from "lodash/get"
import qs from "querystring"
import { formatBytes } from "../utilities"
import { performance } from "perf_hooks"
import { URLSearchParams } from "url"
import { blacklist } from "@budibase/backend-core"
import { handleFileResponse, handleXml } from "./utils"
import { parse } from "content-disposition"
import path from "path"
import { Builder as XmlBuilder } from "xml2js"
import { getAttachmentHeaders } from "./utils/restUtils"
import { utils } from "@budibase/shared-core"
import sdk from "../sdk"
import { getDispatcher } from "../utilities"
import {
  fetch,
  Response,
  RequestInit,
  Headers,
  FormData,
  getGlobalDispatcher,
  MockAgent,
} from "undici"
import environment from "../environment"

const coreFields = {
  path: {
    type: DatasourceFieldType.STRING,
    display: "URL",
  },
  queryString: {
    type: DatasourceFieldType.STRING,
  },
  headers: {
    type: DatasourceFieldType.OBJECT,
  },
  enabledHeaders: {
    type: DatasourceFieldType.OBJECT,
  },
  requestBody: {
    type: DatasourceFieldType.JSON,
  },
  bodyType: {
    type: DatasourceFieldType.STRING,
    enum: Object.values(BodyType),
  },
  pagination: {
    type: DatasourceFieldType.OBJECT,
  },
}

const SCHEMA: Integration = {
  docs: "https://github.com/node-fetch/node-fetch",
  description:
    "With the REST API datasource, you can connect, query and pull data from multiple REST APIs. You can then use the retrieved data to build apps.",
  friendlyName: "REST API",
  type: "API",
  datasource: {
    url: {
      type: DatasourceFieldType.STRING,
      default: "",
      required: false,
      deprecated: true,
    },
    defaultHeaders: {
      type: DatasourceFieldType.OBJECT,
      required: false,
      default: {},
    },
    rejectUnauthorized: {
      display: "Reject Unauthorized",
      type: DatasourceFieldType.BOOLEAN,
      default: true,
      required: false,
    },
    downloadImages: {
      display: "Download images",
      type: DatasourceFieldType.BOOLEAN,
      default: true,
      required: false,
    },
  },
  query: {
    create: {
      readable: true,
      displayName: HttpMethod.POST,
      type: QueryType.FIELDS,
      fields: coreFields,
    },
    read: {
      displayName: HttpMethod.GET,
      readable: true,
      type: QueryType.FIELDS,
      fields: coreFields,
    },
    update: {
      displayName: HttpMethod.PUT,
      readable: true,
      type: QueryType.FIELDS,
      fields: coreFields,
    },
    patch: {
      displayName: HttpMethod.PATCH,
      readable: true,
      type: QueryType.FIELDS,
      fields: coreFields,
    },
    delete: {
      displayName: HttpMethod.DELETE,
      type: QueryType.FIELDS,
      fields: coreFields,
    },
  },
}

interface ParsedResponse {
  data: JSONValue | undefined
  info: {
    code: number
    size: string
    time: string
  }
  extra?: {
    raw: string | undefined
    headers: Record<string, string[] | string>
  }
  pagination?: {
    cursor: JSONValue | undefined
  }
}

interface NormalisedBody {
  bodyString: string
  bodyObject: Record<string, JSONValue>
  jsonValue?: JSONValue
  parseError?: unknown
}

const isPlainRecord = (value: unknown): value is Record<string, JSONValue> => {
  return Object.prototype.toString.call(value) === "[object Object]"
}

const normaliseBody = (raw: unknown): NormalisedBody => {
  if (raw == null) {
    return { bodyString: "", bodyObject: {}, jsonValue: undefined }
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as JSONValue
      if (isPlainRecord(parsed)) {
        return {
          bodyString: raw,
          bodyObject: parsed,
          jsonValue: parsed,
        }
      }
      return {
        bodyString: raw,
        bodyObject: {},
        jsonValue: parsed,
      }
    } catch (err) {
      return {
        bodyString: raw,
        bodyObject: {},
        parseError: err,
      }
    }
  }

  if (Buffer.isBuffer(raw)) {
    return {
      bodyString: raw.toString(),
      bodyObject: {},
      jsonValue: raw.toString(),
    }
  }

  if (raw instanceof Uint8Array) {
    return {
      bodyString: Buffer.from(raw).toString(),
      bodyObject: {},
      jsonValue: Buffer.from(raw).toString(),
    }
  }

  if (isPlainRecord(raw)) {
    return {
      bodyString: JSON.stringify(raw),
      bodyObject: raw as Record<string, JSONValue>,
      jsonValue: raw as JSONValue,
    }
  }

  if (Array.isArray(raw)) {
    return {
      bodyString: JSON.stringify(raw),
      bodyObject: {},
      jsonValue: raw as JSONValue,
    }
  }

  return {
    bodyString: JSON.stringify(raw),
    bodyObject: {},
    jsonValue: undefined,
  }
}

export class RestIntegration implements IntegrationBase {
  private config: RestConfig
  private headers: {
    [key: string]: string
  } = {}
  private startTimeMs: number = performance.now()

  constructor(config: RestConfig) {
    this.config = config
  }

  async parseResponse(
    response: Response,
    pagination?: PaginationConfig
  ): Promise<ParsedResponse> {
    let data: JSONValue | undefined,
      raw: string | undefined,
      headers: Record<string, string[] | string> = {},
      filename: string | undefined

    const { contentType, contentDisposition } = getAttachmentHeaders(
      response.headers,
      { downloadImages: this.config.downloadImages }
    )
    let contentLength = response.headers.get("content-length")
    let isSuccess = response.status >= 200 && response.status < 300
    if (
      (contentDisposition.includes("filename") ||
        contentDisposition.includes("attachment") ||
        contentDisposition.includes("form-data")) &&
      isSuccess
    ) {
      filename =
        path.basename(parse(contentDisposition).parameters?.filename) || ""
    }

    let triedParsing = false,
      responseTxt: string | undefined
    try {
      if (filename) {
        return handleFileResponse(response, filename, this.startTimeMs)
      } else {
        responseTxt = response.text ? await response.text() : ""
        if (!contentLength && responseTxt) {
          contentLength = Buffer.byteLength(responseTxt, "utf8").toString()
        }
        const hasContent =
          (contentLength && parseInt(contentLength) > 0) ||
          responseTxt.length > 0
        if (response.status === 204) {
          data = []
          raw = ""
        } else if (hasContent && contentType.includes("application/json")) {
          triedParsing = true
          data = JSON.parse(responseTxt) as JSONValue
          raw = responseTxt
        } else if (
          (hasContent && contentType.includes("text/xml")) ||
          contentType.includes("application/xml")
        ) {
          triedParsing = true
          let xmlResponse = await handleXml(responseTxt)
          data = xmlResponse.data as JSONValue
          raw = xmlResponse.rawXml
        } else {
          data = responseTxt
          raw = responseTxt
        }
      }
    } catch (err) {
      if (triedParsing) {
        data = responseTxt
        raw = responseTxt
      } else {
        throw new Error(`Failed to parse response body: ${err}`)
      }
    }

    const size = formatBytes(contentLength || "0")
    const time = `${Math.round(performance.now() - this.startTimeMs)}ms`
    // converts headers to plain object
    for (const [key, value] of response.headers.entries()) {
      headers[key] = value
    }

    // Check if a pagination cursor exists in the response
    let nextCursor: JSONValue | undefined
    if (pagination?.responseParam) {
      nextCursor = get(data, pagination.responseParam) as JSONValue | undefined
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
      pagination: {
        cursor: nextCursor,
      },
    }
  }

  getUrl(
    path: string,
    queryString: string,
    pagination?: PaginationConfig,
    paginationValues?: PaginationValues
  ): string {
    // Add pagination params to query string if required
    if (pagination?.location === "query" && paginationValues) {
      const { pageParam, sizeParam } = pagination
      const params = new URLSearchParams()

      // Append page number or cursor param if configured
      if (pageParam && paginationValues.page != null) {
        params.append(pageParam, paginationValues.page as string)
      }

      // Append page size param if configured
      if (sizeParam && paginationValues.limit != null) {
        params.append(sizeParam, String(paginationValues.limit))
      }

      // Prepend query string with pagination params
      let paginationString = params.toString()
      if (paginationString) {
        queryString = `${paginationString}&${queryString}`
      }
    }

    if (queryString) {
      // decode the query string to get individual parameters
      const decoded = qs.decode(queryString)

      // filter out parameters with empty string values
      const filtered: Record<string, string | string[]> = {}
      for (const [key, value] of Object.entries(decoded)) {
        if (value !== "" && value != null) {
          filtered[key] = value
        }
      }

      // only add query string if there are remaining parameters
      if (Object.keys(filtered).length > 0) {
        queryString = "?" + qs.encode(filtered)
      } else {
        queryString = ""
      }
    }
    const main = `${path}${queryString}`

    let complete = main
    if (this.config.url && !main.startsWith("http")) {
      complete = !this.config.url ? main : `${this.config.url}/${main}`
    }
    if (!complete.startsWith("http")) {
      complete = `http://${complete}`
    }
    return complete
  }

  addBody(
    bodyType: string,
    body: string | unknown,
    input: RequestInit,
    pagination?: PaginationConfig,
    paginationValues?: PaginationValues
  ): RequestInit {
    if (!input.headers) {
      input.headers = {}
    }
    if (bodyType === BodyType.NONE) {
      return input
    }
    let error: unknown
    let object: Record<string, JSONValue> = {}
    let string = ""
    let jsonValue: JSONValue | undefined

    if (body != null) {
      const {
        bodyString,
        bodyObject,
        parseError,
        jsonValue: parsedJson,
      } = normaliseBody(body)
      string = bodyString
      object = bodyObject
      error = parseError
      jsonValue = parsedJson
    }

    // Util to add pagination values to a certain body type
    const addPaginationToBody = (
      insertFn: (pageParam: string, page?: string | number) => void
    ) => {
      if (pagination?.location === "body") {
        if (pagination?.pageParam && paginationValues?.page != null) {
          insertFn(pagination.pageParam, paginationValues.page)
        }
        if (pagination?.sizeParam && paginationValues?.limit != null) {
          insertFn(pagination.sizeParam, paginationValues.limit)
        }
      }
    }

    switch (bodyType) {
      case BodyType.TEXT:
        // content type defaults to plaintext
        input.body = string
        break
      case BodyType.ENCODED: {
        const params = new URLSearchParams()
        for (let [key, value] of Object.entries(object)) {
          params.append(key, String(value))
        }
        addPaginationToBody(
          (key: string, value: number | string | undefined) => {
            if (value != null) {
              params.append(key, String(value))
            }
          }
        )
        input.body = params
        break
      }
      case BodyType.FORM_DATA: {
        const form = new FormData()
        const appendFormValue = (key: string, value: unknown) => {
          if (value == null) {
            form.append(key, "")
            return
          }
          if (typeof value === "string") {
            form.append(key, value)
            return
          }
          if (value instanceof Blob) {
            form.append(key, value)
            return
          }
          if (Buffer.isBuffer(value)) {
            form.append(key, Buffer.from(value).toString())
            return
          }
          if (value instanceof Uint8Array) {
            form.append(key, Buffer.from(value).toString())
            return
          }
          form.append(key, String(value))
        }
        for (let [key, value] of Object.entries(object)) {
          appendFormValue(key, value)
        }
        addPaginationToBody(
          (key: string, value: number | string | undefined) => {
            if (value != null) {
              appendFormValue(key, value)
            }
          }
        )
        const ensureHeaderObject = (): Record<
          string,
          string | readonly string[]
        > => {
          if (!input.headers) {
            const headerObject: Record<string, string> = {}
            return headerObject
          }
          if (Array.isArray(input.headers)) {
            const headerObject = input.headers.reduce<Record<string, string>>(
              (acc, [name, value]) => {
                acc[name] = value
                return acc
              },
              {}
            )
            return headerObject
          }
          if (input.headers instanceof Headers) {
            return Object.fromEntries(input.headers)
          }
          return input.headers
        }

        const headers = ensureHeaderObject()

        // Delete Content-Type to allow fetch to auto-generate the correct header/boundary.
        const existingContentTypeKey = Object.keys(headers).find(
          key => key.toLowerCase() === "content-type"
        )
        if (existingContentTypeKey) {
          delete headers[existingContentTypeKey]
        }

        input.headers = headers
        input.body = form
        break
      }
      case BodyType.XML:
        if (object != null && Object.keys(object).length) {
          string = new XmlBuilder().buildObject(object)
        }
        input.body = string
        // @ts-expect-error
        input.headers["Content-Type"] = "application/xml"
        break
      case BodyType.JSON: {
        if (error) {
          throw "Invalid JSON for request body"
        }

        let payload: JSONValue
        if (typeof jsonValue !== "undefined") {
          payload = jsonValue
        } else if (string) {
          try {
            payload = JSON.parse(string) as JSONValue
          } catch (_err) {
            payload = object as JSONValue
          }
        } else {
          payload = object as JSONValue
        }

        if (pagination?.location === "body" && isPlainRecord(payload)) {
          const mutablePayload: Record<string, JSONValue> = {
            ...payload,
          }
          if (pagination.pageParam && paginationValues?.page != null) {
            mutablePayload[pagination.pageParam] =
              paginationValues.page as JSONValue
          }
          if (pagination.sizeParam && paginationValues?.limit != null) {
            mutablePayload[pagination.sizeParam] =
              paginationValues.limit as JSONValue
          }
          payload = mutablePayload
        } else if (pagination?.location === "body") {
          const fallback: Record<string, JSONValue> = { ...object }
          if (pagination.pageParam && paginationValues?.page != null) {
            fallback[pagination.pageParam] = paginationValues.page as JSONValue
          }
          if (pagination.sizeParam && paginationValues?.limit != null) {
            fallback[pagination.sizeParam] = paginationValues.limit as JSONValue
          }
          if (Object.keys(fallback).length > 0) {
            payload = fallback
          }
        }

        input.body =
          typeof payload === "string" ? payload : JSON.stringify(payload)
        // @ts-expect-error
        input.headers["Content-Type"] = "application/json"
        break
      }
    }
    return input
  }

  async getAuthHeaders(
    authConfigId?: string,
    authConfigType?: RestAuthType
  ): Promise<Record<string, string>> {
    if (!authConfigId) {
      return {}
    }

    if (authConfigType === RestAuthType.OAUTH2) {
      return { Authorization: await sdk.oauth2.getToken(authConfigId) }
    }

    if (!this.config.authConfigs) {
      return {}
    }

    const headers: Record<string, string> = {}
    const authConfig = this.config.authConfigs.filter(
      c => c._id === authConfigId
    )[0]
    // check the config still exists before proceeding
    // if not - do nothing
    if (authConfig) {
      const { type, config } = authConfig
      switch (type) {
        case RestAuthType.BASIC:
          headers.Authorization = `Basic ${Buffer.from(
            `${config.username}:${config.password}`
          ).toString("base64")}`
          break
        case RestAuthType.BEARER:
          headers.Authorization = `Bearer ${config.token}`
          break
        default:
          throw utils.unreachable(type)
      }
    }

    return headers
  }

  async _req(query: RestQuery, retry401 = true): Promise<ParsedResponse> {
    const {
      path = "",
      queryString = "",
      headers = {},
      method = HttpMethod.GET,
      disabledHeaders,
      bodyType = BodyType.NONE,
      requestBody,
      authConfigId,
      authConfigType,
      pagination,
      paginationValues,
    } = query
    const authHeaders = await this.getAuthHeaders(authConfigId, authConfigType)

    this.headers = {
      ...(this.config.defaultHeaders || {}),
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

    let input: RequestInit = { method, headers: this.headers }
    input = this.addBody(
      bodyType,
      requestBody,
      input,
      pagination,
      paginationValues
    )

    // Deprecated by rejectUnauthorized
    if (this.config.legacyHttpParser) {
      // NOTE(samwho): it seems like this code doesn't actually work because it requires
      // node-fetch >=3, and we're not on that because upgrading to it produces errors to
      // do with ESM that are above my pay grade.

      // https://github.com/nodejs/node/issues/43798
      // @ts-ignore
      input.extraHttpOptions = { insecureHTTPParser: true }
    }

    this.startTimeMs = performance.now()
    const url = this.getUrl(path, queryString, pagination, paginationValues)
    if (await blacklist.isBlacklisted(url)) {
      throw new Error("Cannot connect to URL.")
    }

    // Configure dispatcher for proxy and/or TLS settings
    // Use datasource config if set, otherwise fall back to environment variable
    const rejectUnauthorized =
      this.config.rejectUnauthorized === undefined
        ? environment.REST_REJECT_UNAUTHORIZED
        : this.config.rejectUnauthorized

    const globalDispatcher = getGlobalDispatcher()
    const isHttpMockingActive = globalDispatcher instanceof MockAgent

    if (!isHttpMockingActive) {
      // Cast needed due to undici version differences between packages
      input.dispatcher = getDispatcher({
        rejectUnauthorized,
        url,
      }) as unknown as typeof input.dispatcher
    }

    let response: Response
    try {
      response = await fetch(url, input)
    } catch (err) {
      const error = err as Error & {
        cause?: {
          code?: string
          message?: string
        }
      }
      console.log("[rest integration] Fetch error details", {
        url,
        error: error.message,
        cause: error.cause?.message,
        code: error.cause?.code,
        hasDispatcher: !!input.dispatcher,
        isHttpsUrl: url.startsWith("https://"),
        rejectUnauthorized,
      })
      if (
        error.cause?.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
        error.cause?.code === "CERT_UNTRUSTED" ||
        error.cause?.code === "SELF_SIGNED_CERT_IN_CHAIN"
      ) {
        throw new Error(
          `SSL certificate verification failed for ${url}. Consider setting rejectUnauthorized to false if using self-signed certificates. Original error: ${error.message}`
        )
      }

      if (error.cause?.code === "ECONNREFUSED" && input.dispatcher) {
        throw new Error(
          `Connection refused when using proxy. Check proxy configuration and ensure the proxy server is accessible. Original error: ${error.message}`
        )
      }
      throw error
    }
    if (
      response.status === 401 &&
      authConfigType === RestAuthType.OAUTH2 &&
      retry401
    ) {
      await sdk.oauth2.cleanStoredToken(authConfigId!)
      return await this._req(query, false)
    }
    return await this.parseResponse(response, pagination)
  }

  async create(opts: RestQuery) {
    return this._req({ ...opts, method: HttpMethod.POST })
  }

  async read(opts: RestQuery) {
    return this._req({ ...opts, method: HttpMethod.GET })
  }

  async update(opts: RestQuery) {
    return this._req({ ...opts, method: HttpMethod.PUT })
  }

  async patch(opts: RestQuery) {
    return this._req({ ...opts, method: HttpMethod.PATCH })
  }

  async delete(opts: RestQuery) {
    return this._req({ ...opts, method: HttpMethod.DELETE })
  }
}

export default {
  schema: SCHEMA,
  integration: RestIntegration,
}
