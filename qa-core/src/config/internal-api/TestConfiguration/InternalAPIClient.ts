import env from "../../../environment"
import fetch, { HeadersInit } from "node-fetch"

type APIMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface ApiOptions {
  method?: APIMethod
  body?: object
  headers?: HeadersInit | undefined
}

class InternalAPIClient {
  host: string
  tenantName?: string
  appId?: string
  cookie?: string

  constructor(appId?: string) {
    if (!env.BUDIBASE_HOST) {
      throw new Error("Must set BUDIBASE_SERVER_URL env var")
    }
    this.host = `${env.BUDIBASE_HOST}/api`
    this.appId = appId
  }

  setTenantName(tenantName: string) {
    this.tenantName = tenantName
  }

  apiCall =
    (method: APIMethod) =>
    async (url = "", options: ApiOptions = {}) => {
      const requestOptions = {
        method,
        body: JSON.stringify(options.body),
        headers: {
          "x-budibase-app-id": this.appId,
          "Content-Type": "application/json",
          Accept: "application/json",
          cookie: this.cookie,
          redirect: "follow",
          follow: 20,
          ...options.headers,
        },
        credentials: "include",
      }

      // prettier-ignore
      // @ts-ignore
      const response = await fetch(`https://${process.env.TENANT_ID}.${this.host}${url}`, requestOptions)

      if (response.status == 404 || response.status == 500) {
        console.error("Error in apiCall")
        console.error("Response:")
        console.error(response)
        console.error("Response body:")
        console.error(response.body)
        console.error("Request body:")
        console.error(requestOptions.body)
      }
      return response
    }

  post = this.apiCall("POST")
  get = this.apiCall("GET")
  patch = this.apiCall("PATCH")
  del = this.apiCall("DELETE")
  put = this.apiCall("PUT")
}

export default InternalAPIClient
