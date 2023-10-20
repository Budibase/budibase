import { Response } from "node-fetch"
import env from "../../environment"
import fetch, { HeadersInit } from "node-fetch"
import { State } from "../../types"
import { Header } from "@budibase/backend-core"

type APIMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface ApiOptions {
  method?: APIMethod
  body?: object
  headers?: HeadersInit | undefined
  internal?: boolean
}

export default class AccountInternalAPIClient {
  state: State
  host: string

  constructor(state: State) {
    if (!env.ACCOUNT_PORTAL_URL) {
      throw new Error("Must set ACCOUNT_PORTAL_URL env var")
    }
    if (!env.ACCOUNT_PORTAL_API_KEY) {
      throw new Error("Must set ACCOUNT_PORTAL_API_KEY env var")
    }
    this.host = `${env.ACCOUNT_PORTAL_URL}`
    this.state = state
  }

  apiCall =
    (method: APIMethod) =>
    async (url = "", options: ApiOptions = {}): Promise<[Response, any]> => {
      const requestOptions = {
        method,
        body: JSON.stringify(options.body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          cookie: this.state.cookie,
          redirect: "follow",
          follow: 20,
          ...options.headers,
        },
        credentials: "include",
      }

      if (options.internal) {
        requestOptions.headers = {
          ...requestOptions.headers,
          ...{ [Header.API_KEY]: env.ACCOUNT_PORTAL_API_KEY },
          cookie: "",
        }
      }

      // @ts-ignore
      const response = await fetch(`${this.host}${url}`, requestOptions)

      let body: any
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        body = await response.json()
      } else {
        body = await response.text()
      }

      const data = {
        request: requestOptions.body,
        response: body,
      }
      const message = `${method} ${url} - ${response.status}`

      const isDebug = process.env.LOG_LEVEL === "debug"
      if (response.status > 499) {
        console.error(message, data)
      } else if (response.status >= 400) {
        console.warn(message, data)
      } else if (isDebug) {
        console.debug(message, data)
      }

      return [response, body]
    }

  post = this.apiCall("POST")
  get = this.apiCall("GET")
  patch = this.apiCall("PATCH")
  del = this.apiCall("DELETE")
  put = this.apiCall("PUT")
}
