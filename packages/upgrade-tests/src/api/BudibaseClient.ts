import { ApplicationAPI } from "./application"
import { TableAPI } from "./table"
import { RowAPI } from "./row"
import { AutomationAPI } from "./automation"
import { ViewAPI } from "./view"
import { BudibaseError } from "../utils/BudibaseError"
import { v4 as uuidv4 } from "uuid"
import { JSONValue } from "@budibase/types"
import { ScreenAPI } from "./screen"
import { DatasourceAPI } from "./datasource"
import { QueryAPI } from "./query"
import { UserAPI } from "./user"
import { ConfigAPI } from "./config"
import { RoleAPI } from "./role"
import { WebhookAPI } from "./webhook"
import { PluginAPI } from "./plugin"

export interface AuthCredentials {
  email: string
  password: string
}

export interface ClientConfig {
  baseURL: string
  headers?: Record<string, string>
}

export interface RequestOptions {
  body?: any
  headers?: Record<string, string>
  query?: Record<string, string>
}

export class BudibaseClient {
  private _config: ClientConfig

  application: ApplicationAPI
  automation: AutomationAPI
  config: ConfigAPI
  datasource: DatasourceAPI
  plugin: PluginAPI
  query: QueryAPI
  role: RoleAPI
  row: RowAPI
  screen: ScreenAPI
  table: TableAPI
  user: UserAPI
  view: ViewAPI
  webhook: WebhookAPI

  constructor(config?: ClientConfig) {
    if (!config) {
      const url = process.env.BUDIBASE_URL
      if (!url) {
        throw new Error("BUDIBASE_URL environment variable is required")
      }

      const apiKey = process.env.INTERNAL_API_KEY
      if (!apiKey) {
        throw new Error("INTERNAL_API_KEY environment variable is required")
      }

      const appId = process.env.TEST_APP_ID
      if (!appId) {
        throw new Error("TEST_APP_ID environment variable is required")
      }

      config = {
        baseURL: url,
        headers: {
          "x-budibase-api-key": apiKey,
          "x-budibase-app-id": appId,
          "Content-Type": "application/json",
        },
      }
    }

    this._config = config

    this.application = new ApplicationAPI(this)
    this.automation = new AutomationAPI(this)
    this.config = new ConfigAPI(this)
    this.datasource = new DatasourceAPI(this)
    this.plugin = new PluginAPI(this)
    this.query = new QueryAPI(this)
    this.role = new RoleAPI(this)
    this.row = new RowAPI(this)
    this.screen = new ScreenAPI(this)
    this.table = new TableAPI(this)
    this.user = new UserAPI(this)
    this.view = new ViewAPI(this)
    this.webhook = new WebhookAPI(this)
  }

  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: any
      headers?: Record<string, string>
      query?: Record<string, string>
    }
  ): Promise<{ data: T; headers: Headers; status: number }> {
    const correlationId = uuidv4()

    // Build URL with query parameters
    let url = `${this._config.baseURL}${path}`
    if (options?.query) {
      const params = new URLSearchParams(options.query)
      url += `?${params.toString()}`
    }

    // Prepare headers
    const headers: Record<string, string> = {
      ...this._config.headers,
      "x-budibase-correlation-id": correlationId,
    }

    // Check if body is FormData before setting up fetch options
    let isFormData = false
    if (options?.body && options.body instanceof FormData) {
      isFormData = true
      // Remove Content-Type to let fetch set it automatically with boundary
      delete headers["Content-Type"]
      delete headers["content-type"]
    }

    // Merge options headers after FormData check
    if (options?.headers) {
      Object.assign(headers, options.headers)
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(30000),
    }

    if (options?.body) {
      if (isFormData) {
        fetchOptions.body = options.body as FormData
      } else {
        fetchOptions.body = JSON.stringify(options.body)
      }
    }

    const response = await fetch(url, fetchOptions)
    const contentType = response.headers.get("content-type") || ""

    // Read response body
    let data: JSONValue = await response.text()

    // Parse JSON if content type indicates it
    if (contentType.includes("application/json") && data) {
      try {
        data = JSON.parse(data)
      } catch (e) {
        // If parsing fails, keep as text
      }
    }

    // Check for error responses
    if (!response.ok) {
      throw await BudibaseError.fromFetchResponse(response, data, {
        method,
        url,
        correlationId,
      })
    }

    // Check if we got HTML when we shouldn't
    if (
      contentType.includes("text/html") &&
      !headers.Accept?.includes("text/html")
    ) {
      throw await BudibaseError.fromFetchResponse(
        response,
        data,
        { method, url, correlationId },
        "Received HTML error page instead of expected response"
      )
    }

    return {
      data: data as T,
      headers: response.headers,
      status: response.status,
    }
  }

  async get<T>(path: string, options?: Omit<RequestOptions, "body">) {
    return this.request<T>("GET", path, options)
  }

  async post<T, R = any>(
    path: string,
    body?: R,
    options?: { headers?: Record<string, string> }
  ) {
    return this.request<T>("POST", path, { body, ...options })
  }

  async put<T>(
    path: string,
    body?: JSONValue,
    options?: { headers?: Record<string, string> }
  ) {
    return this.request<T>("PUT", path, { body, ...options })
  }

  async delete<T>(
    path: string,
    options?: { headers?: Record<string, string> }
  ) {
    return this.request<T>("DELETE", path, options)
  }

  async patch<T>(
    path: string,
    body?: JSONValue,
    options?: { headers?: Record<string, string> }
  ) {
    return this.request<T>("PATCH", path, { body, ...options })
  }

  static async withInternalAPIKey(): Promise<BudibaseClient> {
    const url = process.env.BUDIBASE_URL
    if (!url) {
      throw new Error("BUDIBASE_URL environment variable is required")
    }

    const apiKey = process.env.INTERNAL_API_KEY
    if (!apiKey) {
      throw new Error("INTERNAL_API_KEY environment variable is required")
    }

    return new BudibaseClient({
      baseURL: url,
      headers: {
        "x-budibase-api-key": apiKey,
        "Content-Type": "application/json",
      },
    })
  }

  static async authenticated(
    credentials?: AuthCredentials
  ): Promise<BudibaseClient> {
    const url = process.env.BUDIBASE_URL
    if (!url) {
      throw new Error("BUDIBASE_URL environment variable is required")
    }

    const appId = process.env.TEST_APP_ID
    if (!appId) {
      throw new Error("TEST_APP_ID environment variable is required")
    }

    // Use provided credentials or BB_ADMIN environment variables
    let creds: AuthCredentials
    if (credentials) {
      creds = credentials
    } else {
      const email = process.env.BB_ADMIN_USER_EMAIL
      const password = process.env.BB_ADMIN_USER_PASSWORD

      if (!email) {
        throw new Error(
          "BB_ADMIN_USER_EMAIL environment variable is required when no credentials are provided"
        )
      }
      if (!password) {
        throw new Error(
          "BB_ADMIN_USER_PASSWORD environment variable is required when no credentials are provided"
        )
      }

      creds = { email, password }
    }

    const client = new BudibaseClient({
      baseURL: url,
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response = await client.post("/api/global/auth/default/login", {
      username: creds.email,
      password: creds.password,
    })

    let token =
      response.headers.get("x-budibase-token") || response.headers.get("token")

    if (!token) {
      throw new Error(
        "No token received from authentication (checked headers and body)"
      )
    }

    // Create authenticated client with token
    // Note: In older versions, token must be passed as x-budibase-token header
    return new BudibaseClient({
      baseURL: url,
      headers: {
        "x-budibase-token": token,
        "x-budibase-app-id": appId,
        "Content-Type": "application/json",
      },
    })
  }
}
