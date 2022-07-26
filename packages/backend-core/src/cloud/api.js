const fetch = require("node-fetch")
class API {
  constructor(host) {
    this.host = host
  }

  apiCall =
    method =>
    async (url = "", options = {}) => {
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

module.exports = API
