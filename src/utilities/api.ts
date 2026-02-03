import fetch from "node-fetch"
import { Method, Options } from "../types"
import { logging } from "@budibase/backend-core"
import { tracer } from "dd-trace"
import { HTTP_HEADERS } from "dd-trace/ext/formats"

class API {
  host: string

  constructor(host: string) {
    this.host = host
  }

  apiCall =
    (method: Method) =>
    async (url = "", options: Options = {}) => {
      return await tracer.trace(`api.${method}`, async span => {
        span.setTag("url", url)
        const headers: Record<string, string> = { ...options.headers }

        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json"
          headers.Accept = "application/json"
        }

        const json = headers["Content-Type"] === "application/json"

        // add x-budibase-correlation-id header
        logging.correlation.setHeader(headers)
        tracer.inject(span, HTTP_HEADERS, headers)

        const requestOptions = {
          method: method,
          body: json ? JSON.stringify(options.body) : options.body,
          headers,
          // TODO: See if this is necessary
          credentials: "include",
        }

        return fetch(`${this.host}${url}`, requestOptions)
      })
    }

  post = this.apiCall(Method.POST)
  get = this.apiCall(Method.GET)
  patch = this.apiCall(Method.PATCH)
  del = this.apiCall(Method.DELETE)
  put = this.apiCall(Method.PUT)
}

export default API
