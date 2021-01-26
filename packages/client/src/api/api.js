/**
 * API cache for cached request responses.
 */
import { notificationStore } from "../store/notification"
let cache = {}

/**
 * Handler for API errors.
 */
const handleError = error => {
  return { error }
}

/**
 * Performs an API call to the server.
 * App ID header is always correctly set.
 */
const makeApiCall = async ({ method, url, body, json = true }) => {
  try {
    const requestBody = json ? JSON.stringify(body) : body
    let headers = {
      Accept: "application/json",
      ...(json && { "Content-Type": "application/json" }),
      "x-budibase-app-id": window["##BUDIBASE_APP_ID##"],
    }

    if (!window["##BUDIBASE_IN_BUILDER##"]) {
      headers["x-budibase-type"] = "client"
    }
    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
      credentials: "same-origin",
    })
    switch (response.status) {
      case 200:
        return response.json()
      case 404:
        notificationStore.danger("Not found")
        return handleError(`${url}: Not Found`)
      case 400:
        return handleError(`${url}: Bad Request`)
      case 403:
        notificationStore.danger("Forbidden")
        return handleError(`${url}: Forbidden`)
      default:
        if (response.status >= 200 && response.status < 400) {
          return response.json()
        }
        return handleError(`${url} - ${response.statusText}`)
    }
  } catch (error) {
    return handleError(error)
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
  const { url, cache = false } = params
  const fixedUrl = `/${url}`.replace("//", "/")
  const enrichedParams = { ...params, method, fixedUrl }
  return await (cache ? makeCachedApiCall : makeApiCall)(enrichedParams)
}

export default {
  post: requestApiCall("POST"),
  get: requestApiCall("GET"),
  patch: requestApiCall("PATCH"),
  del: requestApiCall("DELETE"),
  error: handleError,
}
