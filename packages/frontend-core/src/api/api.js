import { ApiVersion } from "../constants"

const defaultAPIClientConfig = {
  attachHeaders: null,
  onError: null,
}

export const createAPIClient = config => {
  config = {
    ...defaultAPIClientConfig,
    ...config,
  }

  /**
   * API cache for cached request responses.
   */
  let cache = {}

  /**
   * Handler for API errors.
   */
  const makeErrorFromResponse = async response => {
    // Try to read a message from the error
    let message
    try {
      const json = await response.json()
      if (json?.error) {
        message = json.error
      }
    } catch (error) {
      // Do nothing
    }
    console.log("building error from", response)
    return {
      message,
      status: response.status,
    }
  }

  const makeError = message => {
    return {
      message,
      status: 400,
    }
  }

  /**
   * Performs an API call to the server.
   * App ID header is always correctly set.
   */
  const makeApiCall = async ({
    method,
    url,
    body,
    json = true,
    external = false,
  }) => {
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
        return await response.json()
      } catch (error) {
        return null
      }
    } else {
      const error = await makeErrorFromResponse(response)
      if (config?.onError) {
        config.onError(error)
      }
      throw error
    }
  }

  /**
   * Performs an API call to the server and caches the response.
   * Future invocation for this URL will return the cached result instead of
   * hitting the server again.
   */
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

  /**
   * Constructs an API call function for a particular HTTP method.
   */
  const requestApiCall = method => async params => {
    let { url, cache = false, external = false } = params
    if (!external) {
      url = `/${url}`.replace("//", "/")
    }
    const enrichedParams = { ...params, method, url }
    return await (cache ? makeCachedApiCall : makeApiCall)(enrichedParams)
  }

  return {
    post: requestApiCall("POST"),
    get: requestApiCall("GET"),
    patch: requestApiCall("PATCH"),
    delete: requestApiCall("DELETE"),
    error: message => throw makeError(message),
  }
}
