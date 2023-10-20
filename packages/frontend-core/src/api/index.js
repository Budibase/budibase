import { Helpers } from "@budibase/bbui"
import { ApiVersion } from "../constants"
import { buildAnalyticsEndpoints } from "./analytics"
import { buildAppEndpoints } from "./app"
import { buildAttachmentEndpoints } from "./attachments"
import { buildAuthEndpoints } from "./auth"
import { buildAutomationEndpoints } from "./automations"
import { buildConfigEndpoints } from "./configs"
import { buildDatasourceEndpoints } from "./datasources"
import { buildFlagEndpoints } from "./flags"
import { buildHostingEndpoints } from "./hosting"
import { buildLayoutEndpoints } from "./layouts"
import { buildOtherEndpoints } from "./other"
import { buildPermissionsEndpoints } from "./permissions"
import { buildQueryEndpoints } from "./queries"
import { buildRelationshipEndpoints } from "./relationships"
import { buildRoleEndpoints } from "./roles"
import { buildRouteEndpoints } from "./routes"
import { buildRowEndpoints } from "./rows"
import { buildScreenEndpoints } from "./screens"
import { buildTableEndpoints } from "./tables"
import { buildTemplateEndpoints } from "./templates"
import { buildUserEndpoints } from "./user"
import { buildSelfEndpoints } from "./self"
import { buildViewEndpoints } from "./views"
import { buildViewV2Endpoints } from "./viewsV2"
import { buildLicensingEndpoints } from "./licensing"
import { buildGroupsEndpoints } from "./groups"
import { buildPluginEndpoints } from "./plugins"
import { buildBackupsEndpoints } from "./backups"
import { buildEnvironmentVariableEndpoints } from "./environmentVariables"
import { buildEventEndpoints } from "./events"
import { buildAuditLogsEndpoints } from "./auditLogs"
import { buildLogsEndpoints } from "./logs"

/**
 * Random identifier to uniquely identify a session in a tab. This is
 * used to determine the originator of calls to the API, which is in
 * turn used to determine who caused a websocket message to be sent, so
 * that we can ignore events caused by ourselves.
 */
export const APISessionID = Helpers.uuid()

const defaultAPIClientConfig = {
  /**
   * Certain definitions can't change at runtime for client apps, such as the
   * schema of tables. The endpoints that are cacheable can be cached by passing
   * in this flag. It's disabled by default to avoid bugs with stale data.
   */
  enableCaching: false,

  /**
   * A function can be passed in to attach headers to all outgoing requests.
   * This function is passed in the headers object, which should be directly
   * mutated. No return value is required.
   */
  attachHeaders: null,

  /**
   * A function can be passed in which will be invoked any time an API error
   * occurs. An error is defined as a status code >= 400. This function is
   * invoked before the actual JS error is thrown up the stack.
   */
  onError: null,
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
  let cache = {}

  // Generates an error object from an API response
  const makeErrorFromResponse = async (
    response,
    method,
    suppressErrors = false
  ) => {
    // Try to read a message from the error
    let message = response.statusText
    let json = null
    try {
      json = await response.json()
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
      suppressErrors,
    }
  }

  // Generates an error object from a string
  const makeError = (message, request) => {
    return {
      message,
      json: null,
      status: 400,
      url: request?.url,
      method: request?.method,
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
    parseResponse,
    suppressErrors = false,
  }) => {
    // Ensure we don't do JSON processing if sending a GET request
    json = json && method !== "GET"

    // Build headers
    let headers = { Accept: "application/json" }
    headers["x-budibase-session-id"] = APISessionID
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
        throw makeError("Invalid JSON body", { url, method })
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
      delete cache[url]
      throw makeError("Failed to send request", { url, method })
    }

    // Handle response
    if (response.status >= 200 && response.status < 400) {
      try {
        if (parseResponse) {
          return await parseResponse(response)
        } else {
          return await response.json()
        }
      } catch (error) {
        delete cache[url]
        return null
      }
    } else {
      delete cache[url]
      throw await makeErrorFromResponse(response, method, suppressErrors)
    }
  }

  // Performs an API call to the server and caches the response.
  // Future invocation for this URL will return the cached result instead of
  // hitting the server again.
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

      // Cache the request if possible and desired
      const cacheRequest = cache && config?.enableCaching
      const handler = cacheRequest ? makeCachedApiCall : makeApiCall

      const enrichedParams = { ...params, method, url }
      return await handler(enrichedParams)
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
    invalidateCache: () => {
      cache = {}
    },

    // Generic utility to extract the current app ID. Assumes that any client
    // that exists in an app context will be attaching our app ID header.
    getAppID: () => {
      let headers = {}
      config?.attachHeaders(headers)
      return headers?.["x-budibase-app-id"]
    },
  }

  // Attach all endpoints
  return {
    ...API,
    ...buildAnalyticsEndpoints(API),
    ...buildAppEndpoints(API),
    ...buildAttachmentEndpoints(API),
    ...buildAuthEndpoints(API),
    ...buildAutomationEndpoints(API),
    ...buildConfigEndpoints(API),
    ...buildDatasourceEndpoints(API),
    ...buildFlagEndpoints(API),
    ...buildHostingEndpoints(API),
    ...buildLayoutEndpoints(API),
    ...buildOtherEndpoints(API),
    ...buildPermissionsEndpoints(API),
    ...buildQueryEndpoints(API),
    ...buildRelationshipEndpoints(API),
    ...buildRoleEndpoints(API),
    ...buildRouteEndpoints(API),
    ...buildRowEndpoints(API),
    ...buildScreenEndpoints(API),
    ...buildTableEndpoints(API),
    ...buildTemplateEndpoints(API),
    ...buildUserEndpoints(API),
    ...buildViewEndpoints(API),
    ...buildSelfEndpoints(API),
    ...buildLicensingEndpoints(API),
    ...buildGroupsEndpoints(API),
    ...buildPluginEndpoints(API),
    ...buildBackupsEndpoints(API),
    ...buildEnvironmentVariableEndpoints(API),
    ...buildEventEndpoints(API),
    ...buildAuditLogsEndpoints(API),
    ...buildLogsEndpoints(API),
    viewV2: buildViewV2Endpoints(API),
  }
}
