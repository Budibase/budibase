const apiCall = method => async (url, body, headers = {
    "Content-Type": "application/json",
}) => {
  const response = await fetch(url, {
    method: method,
    body: body && JSON.stringify(body),
    headers,
  })

  return response
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
