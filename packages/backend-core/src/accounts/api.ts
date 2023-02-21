import fetch from "node-fetch"
import * as logging from "../logging"

export default class API {
  host: string

  constructor(host: string) {
    this.host = host
  }

  async apiCall(method: string, url: string, options?: any) {
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

  async post(url: string, options?: any) {
    return this.apiCall("POST", url, options)
  }

  async get(url: string, options?: any) {
    return this.apiCall("GET", url, options)
  }

  async patch(url: string, options?: any) {
    return this.apiCall("PATCH", url, options)
  }

  async del(url: string, options?: any) {
    return this.apiCall("DELETE", url, options)
  }

  async put(url: string, options?: any) {
    return this.apiCall("PUT", url, options)
  }
}
