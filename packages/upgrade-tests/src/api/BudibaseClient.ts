import { ApplicationAPI } from "./application"
import { TableAPI } from "./table"
import { RowAPI } from "./row"
import { AutomationAPI } from "./automation"
import { QueryAPI } from "./query"
import { ViewAPI } from "./view"
import { BudibaseError } from "../utils/BudibaseError"
import { v4 as uuidv4 } from "uuid"

export interface AuthCredentials {
  email: string
  password: string
}

export interface ClientConfig {
  baseURL: string
  headers?: Record<string, string>
  timeout?: number
}

export class BudibaseClient {
  private config: ClientConfig

  application: ApplicationAPI
  table: TableAPI
  row: RowAPI
  automation: AutomationAPI
  query: QueryAPI
  view: ViewAPI

  constructor(config?: ClientConfig) {
    // Set up default config if not provided
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
        timeout: 30000,
        headers: {
          "x-budibase-api-key": apiKey,
          "x-budibase-app-id": appId,
          "Content-Type": "application/json",
        },
      }
    }

    this.config = config

    // Initialize API classes with this client
    this.application = new ApplicationAPI(this)
    this.table = new TableAPI(this)
    this.row = new RowAPI(this)
    this.automation = new AutomationAPI(this)
    this.query = new QueryAPI(this)
    this.view = new ViewAPI(this)
  }

  private async request<T = any>(
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
    let url = `${this.config.baseURL}${path}`
    if (options?.query) {
      const params = new URLSearchParams(options.query)
      url += `?${params.toString()}`
    }

    // Prepare headers
    const headers: Record<string, string> = {
      ...this.config.headers,
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
      signal: AbortSignal.timeout(this.config.timeout || 30000),
    }

    // Add body if present
    if (options?.body) {
      if (isFormData) {
        fetchOptions.body = options.body as FormData
      } else {
        fetchOptions.body = JSON.stringify(options.body)
      }
    }

    try {
      const response = await fetch(url, fetchOptions)
      const contentType = response.headers.get("content-type") || ""

      // Read response body
      const text = await response.text()
      let data: any = text

      // Parse JSON if content type indicates it
      if (contentType.includes("application/json") && text) {
        try {
          data = JSON.parse(text)
        } catch (e) {
          // If parsing fails, keep as text
        }
      }

      // Check for error responses
      if (!response.ok) {
        const error = await BudibaseError.fromFetchResponse(response, data, {
          method,
          url,
          correlationId,
        })
        throw error
      }

      // Check if we got HTML when we shouldn't
      if (
        contentType.includes("text/html") &&
        !headers.Accept?.includes("text/html")
      ) {
        const error = await BudibaseError.fromFetchResponse(
          response,
          data,
          { method, url, correlationId },
          "Received HTML error page instead of expected response"
        )
        throw error
      }

      return {
        data,
        headers: response.headers,
        status: response.status,
      }
    } catch (error: any) {
      // Handle timeout
      if (error.name === "AbortError") {
        throw new BudibaseError(
          `Request timeout after ${this.config.timeout}ms`,
          {
            correlationId,
            method,
            url,
            statusCode: 0,
            statusText: "Timeout",
            responseBody: null,
            requestHeaders: headers,
          }
        )
      }

      // Re-throw if already a BudibaseError
      if (error instanceof BudibaseError) {
        throw error
      }

      // Wrap other errors
      throw new BudibaseError(`Request failed: ${error.message}`, {
        correlationId,
        method,
        url,
        statusCode: 0,
        statusText: error.message,
        responseBody: null,
        requestHeaders: headers,
      })
    }
  }

  // HTTP method helpers
  async get<T = any>(
    path: string,
    options?: {
      headers?: Record<string, string>
      query?: Record<string, string>
    }
  ) {
    return this.request<T>("GET", path, options)
  }

  async post<T = any>(
    path: string,
    body?: any,
    options?: { headers?: Record<string, string> }
  ) {
    return this.request<T>("POST", path, { body, ...options })
  }

  async put<T = any>(
    path: string,
    body?: any,
    options?: { headers?: Record<string, string> }
  ) {
    return this.request<T>("PUT", path, { body, ...options })
  }

  async delete<T = any>(
    path: string,
    options?: { headers?: Record<string, string> }
  ) {
    return this.request<T>("DELETE", path, options)
  }

  async patch<T = any>(
    path: string,
    body?: any,
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

    // Create client with just the internal API key
    // This is used for operations that don't require user authentication
    // like importing apps
    return new BudibaseClient({
      baseURL: url,
      timeout: parseInt(process.env.BUDIBASE_TIMEOUT || "60000"),
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

    try {
      // Create a temporary client for authentication
      const tempClient = new BudibaseClient({
        baseURL: url,
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Authenticate and get token
      const response = await tempClient.post("/api/global/auth/default/login", {
        username: creds.email,
        password: creds.password,
      })

      // Try to get token from response header first (older versions)
      let token =
        response.headers.get("x-budibase-token") ||
        response.headers.get("token")

      // If not in headers, check response body
      if (!token) {
        token = response.data.token
      }

      if (!token) {
        throw new Error(
          "No token received from authentication (checked headers and body)"
        )
      }

      // Create authenticated client with token
      // Note: In older versions, token must be passed as x-budibase-token header
      return new BudibaseClient({
        baseURL: url,
        timeout: 30000,
        headers: {
          "x-budibase-token": token,
          "x-budibase-app-id": appId,
          "Content-Type": "application/json",
        },
      })
    } catch (error: any) {
      console.error("Authentication failed:", error.message)
      throw error
    }
  }
}
