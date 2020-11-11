import { get } from "svelte/store"
import { getAppId } from "../utils"
import { configStore } from "../store"

const makeURL = path => {
  const { proto, domain, port } = get(configStore).config
  let url = `/${path}`.replace("//", "/")
  return domain ? `${proto}://${domain}:${port}${url}` : url
}

const handleError = error => {
  store.actions.handleError(error)
  return { error }
}

const apiCall = method => async ({ url, body }) => {
  try {
    const fullURL = makeURL(url)
    const response = await fetch(fullURL, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "x-budibase-app-id": getAppId(window.document.cookie),
      },
      body: body && JSON.stringify(body),
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

export default {
  post: apiCall("POST"),
  get: apiCall("GET"),
  patch: apiCall("PATCH"),
  del: apiCall("DELETE"),
  error: handleError,
}
