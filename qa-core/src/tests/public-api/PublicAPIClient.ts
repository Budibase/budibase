import env from "../../environment"
import fetch from "node-fetch"

interface HeaderOptions {
  headers?: object;
  body?: object;
  json?: boolean;
}

type APIMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

class PublicAPIClient {
  host: string
  apiKey: string
  appId?: string

  constructor(appId?: string) {
    if (!env.BUDIBASE_PUBLIC_API_KEY || !env.BUDIBASE_SERVER_URL) {
      throw new Error("Must set BUDIBASE_PUBLIC_API_KEY and BUDIBASE_SERVER_URL env vars")
    }
    this.host = `${env.BUDIBASE_SERVER_URL}/api/public/v1`
    this.apiKey = env.BUDIBASE_PUBLIC_API_KEY
    this.appId = appId
  }

  apiCall =
    (method: APIMethod) =>
    async (url = "", options: HeaderOptions = {}) => {
      const requestOptions = {
        method: method,
        body: JSON.stringify(options.body),
        headers: {
          "x-budibase-api-key": this.apiKey,
          "x-budibase-app-id": this.appId,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
        // TODO: See if this is necessary
        credentials: "include",
      }

      // @ts-ignore
      const response = await fetch(`${this.host}${url}`, requestOptions)
      if (response.status !== 200) {
        console.error(response)
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