const fetch = require("node-fetch")
import logging from "../logging"

class API {
  host: string

  constructor(host: string) {
    this.host = host
  }

  apiCall =
    (method: string) =>
    async (url = "", options: any = {}) => {
      if (!options.headers) {
        options.headers = {}
      }

      if (!options.headers["Content-Type"]) {
        options.headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        }
      }

      let json = options.headers["Content-Type"] === "application/json"

      // add x-budibase-correlation-id header
      logging.correlation.setHeader(options.headers)

      const requestOptions = {
        method: method,
        body: json ? JSON.stringify(options.body) : options.body,
        headers: options.headers,
        // TODO: See if this is necessary
        credentials: "include",
      }

      return await fetch(`${this.host}${url}`, requestOptions)
    }

  post = this.apiCall("POST")
  get = this.apiCall("GET")
  patch = this.apiCall("PATCH")
  del = this.apiCall("DELETE")
  put = this.apiCall("PUT")
}

export = API
