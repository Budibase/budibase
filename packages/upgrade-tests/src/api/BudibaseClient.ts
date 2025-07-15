import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios"
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

export class BudibaseClient extends Axios {
  application: ApplicationAPI
  table: TableAPI
  row: RowAPI
  automation: AutomationAPI
  query: QueryAPI
  view: ViewAPI

  constructor(config?: AxiosRequestConfig) {
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
        // Add default axios transformations for JSON parsing
        transformResponse: [
          (data: any) => {
            // Attempt to parse JSON responses
            if (typeof data === 'string') {
              try {
                return JSON.parse(data)
              } catch (e) {
                return data
              }
            }
            return data
          }
        ],
      }
    }

    // Call parent constructor
    super(config)

    // Initialize API classes with this client
    this.application = new ApplicationAPI(this)
    this.table = new TableAPI(this)
    this.row = new RowAPI(this)
    this.automation = new AutomationAPI(this)
    this.query = new QueryAPI(this)
    this.view = new ViewAPI(this)
  }

  // Override the request method to add our custom error handling
  async request<T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R> {
    const correlationId = uuidv4()
    if (!config.headers) {
      config.headers = {}
    }
    config.headers["x-budibase-correlation-id"] = correlationId

    try {
      return await super.request<T, R, D>(config)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw await BudibaseError.fromAxiosError(error)
      }
      throw error
    }
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

    // Create a base client for authentication
    const baseClient = axios.create({
      baseURL: url,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

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
      // Authenticate and get token
      // When MULTI_TENANCY=0, tenant ID is "default"
      const response = await baseClient.post("/api/global/auth/default/login", {
        username: creds.email,
        password: creds.password,
      })

      // Try to get token from response header first (older versions)
      let token = response.headers['x-budibase-token'] || response.headers['token']
      
      // If not in headers, check response body
      if (!token) {
        token = response.data.token
      }
      
      if (!token) {
        throw new Error("No token received from authentication (checked headers and body)")
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
        // Add default axios transformations for JSON parsing
        transformResponse: [
          (data: any) => {
            // Attempt to parse JSON responses
            if (typeof data === 'string') {
              try {
                return JSON.parse(data)
              } catch (e) {
                return data
              }
            }
            return data
          }
        ],
      })
    } catch (error: any) {
      console.error("Authentication failed:", error.response?.data || error.message)
      throw error
    }
  }
}
