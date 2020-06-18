const apiCall = (method, instanceId) => async (url, body) => {
  const headers = {
    "Content-Type": "application/json",
    "x-user-agent": "Budibase Builder",
  }
  if (instanceId) {
    headers["x-budibase-instanceid"] = instanceId
  }
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

// usage: api(instanceId).post(...) ... will supply instance Id in header
const api = instanceId => ({
  post: apiCall("POST", instanceId),
  get: apiCall("GET", instanceId),
  patch: apiCall("PATCH", instanceId),
  delete: apiCall("DELETE", instanceId),
  put: apiCall("PUT", instanceId),
})

// usage: api.post(...)... will not supply instanceid in header
api.post = apiCall("POST")
api.get = apiCall("GET")
api.patch = apiCall("PATCH")
api.delete = apiCall("DELETE")
api.put = apiCall("PUT")

export default api
