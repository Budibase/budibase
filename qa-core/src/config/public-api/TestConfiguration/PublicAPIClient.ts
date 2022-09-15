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
  apiKey: string
  appId?: string

  constructor(appId?: string) {
    if (!env.BUDIBASE_PUBLIC_API_KEY || !env.BUDIBASE_SERVER_URL) {
      throw new Error(
        "Must set BUDIBASE_PUBLIC_API_KEY and BUDIBASE_SERVER_URL env vars"
      )
    }
    this.host = `${env.BUDIBASE_SERVER_URL}/api/public/v1`
    this.apiKey = env.BUDIBASE_PUBLIC_API_KEY
    this.appId = appId
  }

  apiCall =
    (method: APIMethod) =>
    async (url = "", options: ApiOptions = {}) => {
      const requestOptions = {
        method,
        body: JSON.stringify(options.body),
        headers: {
          "x-budibase-api-key": this.apiKey,
          "x-budibase-app-id": this.appId,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
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
