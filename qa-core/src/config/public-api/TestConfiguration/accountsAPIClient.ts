import env from "../../../environment"
import fetch, { HeadersInit } from "node-fetch"

type APIMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface ApiOptions {
  method?: APIMethod
  body?: object
  headers?: HeadersInit | undefined
}

class AccountsAPIClient {
  host: string
  appId?: string
  cookie?: string

  constructor(appId?: string) {
    if (!env.BUDIBASE_ACCOUNTS_URL) {
      throw new Error("Must set BUDIBASE_SERVER_URL env var")
    }
    this.host = `${env.BUDIBASE_ACCOUNTS_URL}/api`
    this.appId = appId
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

      // @ts-ignore
      const response = await fetch(`${this.host}${url}`, requestOptions)
      if (
        response.status == 404 ||
        response.status == 500 ||
        response.status == 400
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

export default AccountsAPIClient
