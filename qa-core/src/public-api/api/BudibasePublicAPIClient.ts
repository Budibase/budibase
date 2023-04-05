import env from "../../environment"
import fetch, { HeadersInit } from "node-fetch"
import { State } from "../../types"

type APIMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface ApiOptions {
  method?: APIMethod
  body?: object
  headers?: HeadersInit | undefined
}

class BudibasePublicAPIClient {
  state: State
  host: string

  constructor(state: State) {
    if (!env.BUDIBASE_URL) {
      throw new Error("Must set BUDIBASE_URL env var")
    }
    this.host = `${env.BUDIBASE_URL}/api/public/v1`
    this.state = state
  }

  apiCall =
    (method: APIMethod) =>
    async (url = "", options: ApiOptions = {}) => {
      const requestOptions = {
        method,
        body: JSON.stringify(options.body),
        headers: {
          "x-budibase-api-key": this.state.apiKey,
          "x-budibase-app-id": this.state.appId,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
          redirect: "follow",
          follow: 20,
        },
      }

      // prettier-ignore
      // @ts-ignore
      const response = await fetch(`${this.host}${url}`, requestOptions)

      let body: any
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        body = await response.json()
      } else {
        body = await response.text()
      }

      const message = `${method} ${url} - ${response.status} 
        Response body: ${JSON.stringify(body)}
        Request body: ${requestOptions.body}`

      if (response.status > 499) {
        console.error(message)
      } else if (response.status >= 400) {
        console.warn(message)
      }

      return [response, body]
    }

  post = this.apiCall("POST")
  get = this.apiCall("GET")
  patch = this.apiCall("PATCH")
  del = this.apiCall("DELETE")
  put = this.apiCall("PUT")
}

export default BudibasePublicAPIClient
