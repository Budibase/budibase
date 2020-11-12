import { get } from "svelte/store"
import { getAppId } from "../utils"
import { configStore } from "../store"

/**
 * API cache for cached request responses.
 */
let cache = {}

/**
 * Makes a fully formatted URL based on the SDK configuration.
 */
const makeFullURL = path => {
  const { proto, domain, port } = get(configStore)
  let url = `/${path}`.replace("//", "/")
  return domain ? `${proto}://${domain}:${port}${url}` : url
}

/**
 * Handler for API errors.
 */
const handleError = error => {
  configStore.actions.handleError(error)
  return { error }
}

/**
 * Performs an API call to the server.
 * App ID header is always correctly set.
 */
const makeApiCall = async ({ method, url, body, json = true }) => {
  try {
    const requestBody = json ? JSON.stringify(body) : body
    const response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-budibase-app-id": getAppId(window.document.cookie),
      },
      body: requestBody,
      credentials: "same-origin",
    })
    switch (response.status) {
      case 200:
        return response.json()
      case 404:
        return handleError(`${url}: Not Found`)
      case 400:
        return handleError(`${url}: Bad Request`)
      case 403:
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
  const fullURL = makeFullURL(url)
  const enrichedParams = { ...params, method, url: fullURL }
  return await (cache ? makeCachedApiCall : makeApiCall)(enrichedParams)
}

export default {
  post: requestApiCall("POST"),
  get: requestApiCall("GET"),
  patch: requestApiCall("PATCH"),
  del: requestApiCall("DELETE"),
  error: handleError,
}
