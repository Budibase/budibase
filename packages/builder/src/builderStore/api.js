import { store } from "./index"
import { get as svelteGet } from "svelte/store"
import { removeCookie, Cookies } from "./cookies"

const apiCall = method => async (
  url,
  body,
  headers = { "Content-Type": "application/json" }
) => {
  headers["x-budibase-app-id"] = svelteGet(store).appId
  const json = headers["Content-Type"] === "application/json"
  const resp = await fetch(url, {
    method: method,
    body: json ? JSON.stringify(body) : body,
    headers,
  })
  if (resp.status === 403) {
    removeCookie(Cookies.Auth)
  }
  return resp
}

export const post = apiCall("POST")
export const get = apiCall("GET")
export const patch = apiCall("PATCH")
export const del = apiCall("DELETE")
export const put = apiCall("PUT")

export default {
  post: apiCall("POST"),
  get: apiCall("GET"),
  patch: apiCall("PATCH"),
  delete: apiCall("DELETE"),
  put: apiCall("PUT"),
}
