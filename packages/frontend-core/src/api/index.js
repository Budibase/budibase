import { ApiVersion } from "../constants"
import { buildAnalyticsEndpoints } from "./analytics"
import { buildAppEndpoints } from "./app"
import { buildAttachmentEndpoints } from "./attachments"
import { buildAuthEndpoints } from "./auth"
import { buildAutomationEndpoints } from "./automations"
import { buildDatasourceEndpoints } from "./datasources"
import { buildFlagEndpoints } from "./flags"
import { buildHostingEndpoints } from "./hosting"
import { buildPermissionsEndpoints } from "./permissions"
import { buildQueryEndpoints } from "./queries"
import { buildRelationshipEndpoints } from "./relationships"
import { buildRoleEndpoints } from "./roles"
import { buildRouteEndpoints } from "./routes"
import { buildRowEndpoints } from "./rows"
import { buildScreenEndpoints } from "./screens"
import { buildTableEndpoints } from "./tables"
import { buildTemplateEndpoints } from "./templates"
import { buildViewEndpoints } from "./views"

const defaultAPIClientConfig = {
  attachHeaders: null,
  onError: null,
  patches: null,
}

/**
 * Constructs an API client with the provided configuration.
 * @param config the API client configuration
 * @return {object} the API client
 */
export const createAPIClient = config => {
  config = {
    ...defaultAPIClientConfig,
    ...config,
  }

  // Generates an error object from an API response
  const makeErrorFromResponse = async (response, method) => {
    console.log("making error from", response)

    // Try to read a message from the error
    let message = response.statusText
    let json = null
    try {
      const json = await response.json()
      if (json?.message) {
        message = json.message
      } else if (json?.error) {
        message = json.error
      }
    } catch (error) {
      // Do nothing
    }
    return {
      message,
      json,
      status: response.status,
      url: response.url,
      method,
      handled: true,
    }
  }

  // Generates an error object from a string
  const makeError = message => {
    return {
      message,
      json: null,
      status: 400,
      url: "",
      method: "",
      handled: true,
    }
  }

  // Performs an API call to the server.
  const makeApiCall = async ({
    method,
    url,
    body,
    json = true,
    external = false,
  }) => {
    // Ensure we don't do JSON processing if sending a GET request
    json = json && method !== "GET"

    // Build headers
    let headers = { Accept: "application/json" }
    if (!external) {
      headers["x-budibase-api-version"] = ApiVersion
    }
    if (json) {
      headers["Content-Type"] = "application/json"
    }
    if (config?.attachHeaders) {
      config.attachHeaders(headers)
    }

    // Build request body
    let requestBody = body
    if (json) {
      try {
        requestBody = JSON.stringify(body)
      } catch (error) {
        throw makeError("Invalid JSON body")
      }
    }

    // Make request
    let response
    try {
      response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        credentials: "same-origin",
      })
    } catch (error) {
      throw makeError("Failed to send request")
    }

    // Handle response
    if (response.status >= 200 && response.status < 400) {
      try {
        if (config?.parseResponse) {
          return await config.parseResponse(response)
        } else {
          return await response.json()
        }
      } catch (error) {
        return null
      }
    } else {
      throw await makeErrorFromResponse(response, method)
    }
  }

  // Performs an API call to the server and caches the response.
  // Future invocation for this URL will return the cached result instead of
  // hitting the server again.
  let cache = {}
  const makeCachedApiCall = async params => {
    const identifier = params.url
    if (!identifier) {
      return null
    }
    if (!cache[identifier]) {
      cache[identifier] = makeApiCall(params)
      cache[identifier] = await cache[identifier]
    }
    return await cache[identifier]
  }

  // Constructs an API call function for a particular HTTP method
  const requestApiCall = method => async params => {
    try {
      let { url, cache = false, external = false } = params
      if (!external) {
        url = `/${url}`.replace("//", "/")
      }
      const enrichedParams = { ...params, method, url }
      return await (cache ? makeCachedApiCall : makeApiCall)(enrichedParams)
    } catch (error) {
      if (config?.onError) {
        config.onError(error)
      }
      throw error
    }
  }

  // Build the underlying core API methods
  let API = {
    post: requestApiCall("POST"),
    get: requestApiCall("GET"),
    patch: requestApiCall("PATCH"),
    delete: requestApiCall("DELETE"),
    put: requestApiCall("PUT"),
    error: message => {
      throw makeError(message)
    },
  }

  // Attach all endpoints
  API = {
    ...API,
    ...buildAnalyticsEndpoints(API),
    ...buildAppEndpoints(API),
    ...buildAttachmentEndpoints(API),
    ...buildAuthEndpoints(API),
    ...buildAutomationEndpoints(API),
    ...buildDatasourceEndpoints(API),
    ...buildFlagEndpoints(API),
    ...buildHostingEndpoints(API),
    ...buildPermissionsEndpoints(API),
    ...buildQueryEndpoints(API),
    ...buildRelationshipEndpoints(API),
    ...buildRoleEndpoints(API),
    ...buildRouteEndpoints(API),
    ...buildRowEndpoints(API),
    ...buildScreenEndpoints(API),
    ...buildTableEndpoints(API),
    ...buildTemplateEndpoints(API),
    ...buildViewEndpoints(API),
  }

  // Assign any patches
  const patches = Object.entries(config.patches || {})
  if (patches.length) {
    patches.forEach(([method, fn]) => {
      const baseFn = API[method]
      API[method] = async (...params) => {
        const output = await baseFn(...params)
        return await fn({ params, output })
      }
    })
  }

  return API
}
