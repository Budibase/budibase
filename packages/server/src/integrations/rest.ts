import {
  BodyType,
  DatasourceFieldType,
  HttpMethod,
  Integration,
  IntegrationBase,
  IntegrationRequestOpts,
  JSONValue,
  OAuth2RestAuthConfig,
  PaginationConfig,
  PaginationValues,
  QueryType,
  RestAuthType,
  RestConfig,
  RestPreviewConfig,
  RestQueryFields as RestQuery,
  RestRequestPreview,
} from "@budibase/types"
import get from "lodash/get"
import qs from "querystring"
import { performance } from "perf_hooks"
import { URLSearchParams } from "url"
import { utils as coreUtils } from "@budibase/backend-core"
import { handleFileResponse, handleXml } from "./utils"
import { parse } from "content-disposition"
import path from "path"
import { Builder as XmlBuilder } from "xml2js"
import {
  getAttachmentHeaders,
  normaliseHeaders,
  sanitiseBody,
  sanitiseHeaders,
} from "./utils/restUtils"
import { helpers } from "@budibase/shared-core"
import sdk from "../sdk"
import { getDispatcher } from "../utilities"
import {
  fetch,
  Request,
  Response,
  RequestInit,
  Headers,
  FormData,
  getGlobalDispatcher,
  MockAgent,
} from "undici"
import environment from "../environment"

interface AuthConfig {
  type: string
  config: {
    username?: string
    password?: string
    token?: string
    key?: string
    value?: string
    location?: string
  }
}

type ResolvedAuthConfig =
  | { type: "auth"; auth: AuthConfig }
  | { type: "oauth2"; sourceId: string }

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
    request?: RestRequestPreview
  }
  pagination?: {
    cursor: JSONValue | undefined
  }
}

interface BuiltRequest {
  url: string
  input: RequestInit
  authHeaders: Record<string, string>
  authType?: string
}

interface RequestOpts extends IntegrationRequestOpts {
  retry401?: boolean
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

    const size = helpers.formatBytes(contentLength || "0")
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
    path = "",
    queryString = "",
    pagination?: PaginationConfig,
    paginationValues?: PaginationValues,
    baseUrl: string | undefined = this.config.url
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
    if (baseUrl && !main.startsWith("http")) {
      complete = `${baseUrl}/${main}`
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
        const headers = new Headers(input.headers)

        // Delete Content-Type to allow fetch to auto-generate the correct header/boundary.
        headers.delete("content-type")

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

  buildBasicAuthHeader(username: string, password: string): string {
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
  }

  buildBearerAuthHeader(token: string): string {
    return `Bearer ${token}`
  }

  private buildHeadersFromAuthConfig(auth: AuthConfig): Record<string, string> {
    const { type, config } = auth
    switch (type) {
      case RestAuthType.BASIC:
        return {
          Authorization: this.buildBasicAuthHeader(
            config.username!,
            config.password!
          ),
        }
      case RestAuthType.BEARER:
        return { Authorization: this.buildBearerAuthHeader(config.token!) }
      case RestAuthType.OAUTH2:
        // Token already includes "Bearer " prefix from OAuth2 response
        return { Authorization: config.token! }
      // We dont currently support this but it is available and outlined
      // in supported openapi specs.
      case "apiKey":
        if (config.location === "header") {
          return { [config.key!]: config.value! }
        }
        return {}
      default:
        return {}
    }
  }

  private async resolveAuthConfig(
    authConfigId?: string,
    authConfigType?: RestAuthType
  ): Promise<ResolvedAuthConfig | null> {
    if (!authConfigId) return null
    if (authConfigType === RestAuthType.OAUTH2) {
      return { type: "oauth2", sourceId: authConfigId }
    }
    if (!this.config.authConfigs) return null
    const authConfig = this.config.authConfigs.find(
      c => c._id === authConfigId && c.type !== RestAuthType.OAUTH2
    )
    if (!authConfig) return null
    return { type: "auth", auth: authConfig as AuthConfig }
  }

  async getAuthHeaders(
    authConfigId?: string,
    authConfigType?: RestAuthType
  ): Promise<{ headers: Record<string, string>; authType?: string }> {
    if (authConfigId && authConfigType === RestAuthType.OAUTH2) {
      const inlineOAuth2 = this.config.authConfigs?.find(
        c => c._id === authConfigId && c.type === RestAuthType.OAUTH2
      )
      if (inlineOAuth2) {
        const token = await sdk.oauth2.getTokenFromConfig(
          authConfigId,
          inlineOAuth2 as OAuth2RestAuthConfig
        )
        return {
          headers: { Authorization: token },
          authType: RestAuthType.OAUTH2,
        }
      }
    }

    const resolved = await this.resolveAuthConfig(authConfigId, authConfigType)

    if (!resolved) {
      return { headers: {} }
    }

    if (resolved.type === "oauth2") {
      return {
        headers: {
          Authorization: await sdk.oauth2.getToken(resolved.sourceId),
        },
        authType: RestAuthType.OAUTH2,
      }
    }

    return {
      headers: this.buildHeadersFromAuthConfig(resolved.auth),
      authType: resolved.auth.type,
    }
  }

  private getOrigin(urlString: string): string | null {
    try {
      const parsed = new URL(urlString)
      return `${parsed.protocol}//${parsed.host}`
    } catch {
      return null
    }
  }

  private assertSameOrigin(url: string, rawPath: string | undefined) {
    const finalOrigin = this.getOrigin(url)

    const expectedOriginUrls: string[] = []
    if (this.config.url) {
      expectedOriginUrls.push(this.getUrl())
    }
    if (rawPath !== undefined) {
      expectedOriginUrls.push(this.getUrl(rawPath))
    }

    const isCrossOrigin = expectedOriginUrls.some(
      expectedUrl => this.getOrigin(expectedUrl) !== finalOrigin
    )
    if (isCrossOrigin) {
      throw new Error("REST query path must remain on the datasource origin")
    }
  }

  private mergedQueryParams(fields: RestQuery, config: RestPreviewConfig) {
    const queryParams = fields.queryString ? qs.decode(fields.queryString) : {}
    return { ...(config.defaultQueryParameters || {}), ...queryParams }
  }

  private composeUrl(fields: RestQuery, config: RestPreviewConfig): string {
    const { path = "", queryString = "", pagination, paginationValues } = fields
    const defaultQueryParameters = config.defaultQueryParameters || {}
    let mergedQueryString = queryString
    if (Object.keys(defaultQueryParameters).length > 0) {
      mergedQueryString = qs.encode(this.mergedQueryParams(fields, config))
    }

    return this.getUrl(
      path,
      mergedQueryString,
      pagination,
      paginationValues,
      config.url
    )
  }

  private composeRequest({
    fields,
    config,
    authHeaders,
  }: {
    fields: RestQuery
    config: RestPreviewConfig
    authHeaders: Record<string, string>
  }): { url: string; input: RequestInit } {
    const {
      headers = {},
      method = HttpMethod.GET,
      disabledHeaders,
      bodyType = BodyType.NONE,
      requestBody,
      pagination,
      paginationValues,
    } = fields

    const url = this.composeUrl(fields, config)

    const mergedHeaders: Record<string, string> = {
      ...(config.defaultHeaders || {}),
      ...headers,
      ...authHeaders,
    }
    if (disabledHeaders) {
      for (let headerKey of Object.keys(mergedHeaders)) {
        if (disabledHeaders[headerKey]) {
          delete mergedHeaders[headerKey]
        }
      }
    }

    let input: RequestInit = { method, headers: mergedHeaders }
    input = this.addBody(
      bodyType,
      requestBody,
      input,
      pagination,
      paginationValues
    )
    return { url, input }
  }

  private async buildRequest(query: RestQuery): Promise<BuiltRequest> {
    const { rawPath, authConfigId, authConfigType } = query

    // Resolve and validate the destination BEFORE attaching any
    // datasource-scoped credentials or headers below.
    const url = this.composeUrl(query, this.config)
    this.assertSameOrigin(url, rawPath)

    const { headers: authHeaders, authType } = await this.getAuthHeaders(
      authConfigId,
      authConfigType
    )

    const { input } = this.composeRequest({
      fields: query,
      config: this.config,
      authHeaders,
    })
    this.headers = normaliseHeaders(input.headers)

    return {
      url,
      input,
      authHeaders,
      authType,
    }
  }

  // Headers derived from the body, such as the multipart content-type
  private resolveHeaders(built: BuiltRequest): Record<string, string> {
    const headers = normaliseHeaders(built.input.headers)
    try {
      const request = new Request(built.url, built.input)
      for (const [key, value] of request.headers.entries()) {
        if (!Object.keys(headers).some(k => k.toLowerCase() === key)) {
          headers[key] = value
        }
      }
    } catch (err) {
      console.log("[rest integration] Unable to materialise request headers", {
        error: (err as Error).message,
      })
    }
    return headers
  }

  // The preview is only ever built from the unresolved preview inputs - the
  // resolved request contains real credential values, so on failure there is
  // no preview rather than an unmasked fallback.
  private buildRequestPreview(
    built: BuiltRequest,
    opts: IntegrationRequestOpts
  ): RestRequestPreview | undefined {
    const { previewFields, previewConfig } = opts
    if (!previewFields) {
      return undefined
    }
    try {
      const fields: RestQuery = {
        ...previewFields,
        method: built.input.method as HttpMethod,
      }
      const config = previewConfig ?? this.config
      const { url, input } = this.composeRequest({
        fields,
        config,
        authHeaders: built.authHeaders,
      })

      const headers = normaliseHeaders(input.headers)
      for (const [key, value] of Object.entries(this.resolveHeaders(built))) {
        if (
          !Object.keys(headers).some(k => k.toLowerCase() === key.toLowerCase())
        ) {
          headers[key] = value
        }
      }

      const displayUrl = decodeURI(url)
      let path = ""
      try {
        path = decodeURI(new URL(url).pathname)
      } catch {
        // url contains bindings
      }
      const params: Record<string, string> = {}
      for (const [key, value] of Object.entries(
        this.mergedQueryParams(fields, config)
      )) {
        if (value == null || value === "") {
          continue
        }
        // for scenarios with tag=a&tag=b, take the last
        params[key] = Array.isArray(value)
          ? String(value.at(-1))
          : String(value)
      }
      return {
        url: displayUrl,
        path,
        method: input.method || HttpMethod.GET,
        headers: sanitiseHeaders({
          headers,
          authHeaderKeys: Object.keys(built.authHeaders),
          authType: built.authType,
        }),
        params,
        body: sanitiseBody(input.body),
      }
    } catch (err) {
      console.log("[rest integration] Unable to build request preview", {
        error: (err as Error).message,
      })
      return undefined
    }
  }

  async _req(
    query: RestQuery,
    opts: RequestOpts = {}
  ): Promise<ParsedResponse> {
    const { retry401 = true, includeRequest = false } = opts
    const { pagination } = query

    this.startTimeMs = performance.now()

    const built = await this.buildRequest(query)
    const { url, input } = built

    // Deprecated by rejectUnauthorized
    if (this.config.legacyHttpParser) {
      // NOTE(samwho): it seems like this code doesn't actually work because it requires
      // node-fetch >=3, and we're not on that because upgrading to it produces errors to
      // do with ESM that are above my pay grade.

      // https://github.com/nodejs/node/issues/43798
      // @ts-ignore
      input.extraHttpOptions = { insecureHTTPParser: true }
    }

    // Configure dispatcher for proxy and/or TLS settings
    // Use datasource config if set, otherwise fall back to environment variable
    const rejectUnauthorized =
      this.config.rejectUnauthorized === undefined
        ? environment.REST_REJECT_UNAUTHORIZED
        : this.config.rejectUnauthorized

    const globalDispatcher = getGlobalDispatcher()
    const isHttpMockingActive = globalDispatcher instanceof MockAgent
    let hasDispatcher = false
    let usedProxyDispatcher = false

    const setDispatcher = (
      requestInput: RequestInit,
      requestUrl: string,
      pinnedIp: string
    ) => {
      if (isHttpMockingActive) {
        return requestInput
      }

      const dispatcher = getDispatcher({
        rejectUnauthorized,
        url: requestUrl,
        lookup: coreUtils.createPinnedLookup(pinnedIp),
      }) as unknown as typeof requestInput.dispatcher

      hasDispatcher = true
      usedProxyDispatcher = dispatcher?.constructor.name === "ProxyAgent"

      return {
        ...requestInput,
        dispatcher,
      }
    }

    let response: Response
    try {
      response = await coreUtils.fetchWithBlacklist<RequestInit, Response>(
        url,
        input,
        {
          rejectCrossOriginRedirects: true,
          fetchFn: async (
            requestUrl: string,
            requestInput: RequestInit,
            pinnedIp: string
          ) =>
            fetch(
              requestUrl,
              setDispatcher(requestInput, requestUrl, pinnedIp)
            ),
        }
      )
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
        hasDispatcher,
        usedProxyDispatcher,
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

      if (error.cause?.code === "ECONNREFUSED" && usedProxyDispatcher) {
        throw new Error(
          `Connection refused when using proxy. Check proxy configuration and ensure the proxy server is accessible. Original error: ${error.message}`
        )
      }
      throw error
    }
    if (response.status === 401 && retry401) {
      const { authConfigId, authConfigType } = query
      if (authConfigType === RestAuthType.OAUTH2 && authConfigId) {
        await sdk.oauth2.cleanStoredTokensForAuthConfig(authConfigId)
        return await this._req(query, { ...opts, retry401: false })
      }
    }
    const parsed = await this.parseResponse(response, pagination)
    if (includeRequest) {
      const request = this.buildRequestPreview(built, opts)
      if (request) {
        parsed.extra = {
          raw: undefined,
          headers: {},
          ...parsed.extra,
          request,
        }
      }
    }
    return parsed
  }

  async create(opts: RestQuery, reqOpts?: RequestOpts) {
    return this._req({ ...opts, method: HttpMethod.POST }, reqOpts)
  }

  async read(opts: RestQuery, reqOpts?: RequestOpts) {
    return this._req({ ...opts, method: HttpMethod.GET }, reqOpts)
  }

  async update(opts: RestQuery, reqOpts?: RequestOpts) {
    return this._req({ ...opts, method: HttpMethod.PUT }, reqOpts)
  }

  async patch(opts: RestQuery, reqOpts?: RequestOpts) {
    return this._req({ ...opts, method: HttpMethod.PATCH }, reqOpts)
  }

  async delete(opts: RestQuery, reqOpts?: RequestOpts) {
    return this._req({ ...opts, method: HttpMethod.DELETE }, reqOpts)
  }
}

export default {
  schema: SCHEMA,
  integration: RestIntegration,
}
