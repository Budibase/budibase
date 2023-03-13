import env from "../../../environment"
import fetch, { HeadersInit } from "node-fetch"

type APIMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface ApiOptions {
  method?: APIMethod
  body?: object
  headers?: HeadersInit | undefined
}

class PublicAPIClient {
  host: string
  apiKey?: string
  tenantName?: string
  appId?: string
  cookie?: string

  constructor(appId?: string) {
    if (!env.BUDIBASE_HOST) {
      throw new Error(
        "Must set BUDIBASE_PUBLIC_API_KEY and BUDIBASE_SERVER_URL env vars"
      )
    }
    this.host = `${env.BUDIBASE_HOST}/api/public/v1`

    this.appId = appId
  }

  setTenantName(tenantName: string) {
    this.tenantName = tenantName
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
    process.env.BUDIBASE_PUBLIC_API_KEY = apiKey
    this.host = `${env.BUDIBASE_HOST}/api/public/v1`
  }

  apiCall =
    (method: APIMethod) =>
    async (url = "", options: ApiOptions = {}) => {
      const requestOptions = {
        method,
        body: JSON.stringify(options.body),
        headers: {
          "x-budibase-api-key": this.apiKey ? this.apiKey : null,
          "x-budibase-app-id": this.appId,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
          cookie: this.cookie,
          redirect: "follow",
          follow: 20,
        },
      }

      // prettier-ignore
      // @ts-ignore
      const response = await fetch(`https://${process.env.TENANT_ID}.${this.host}${url}`, requestOptions)

      if (
        response.status == 404 ||
        response.status == 500 ||
        response.status == 403
      ) {
        console.error("Error in apiCall")
        console.error("Response:", response)
        const json = await response.json()
        console.error("Response body:", json)
        console.error("Request body:", requestOptions.body)
      }
      return response
    }

  post = this.apiCall("POST")
  get = this.apiCall("GET")
  patch = this.apiCall("PATCH")
  del = this.apiCall("DELETE")
  put = this.apiCall("PUT")
}

export default PublicAPIClient
