const apiCall = method => async (url, body) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "x-user-agent": "Budibase Builder",
    },
    body: body && JSON.stringify(body),
  })

  // if (response.status === 500) {
  //   throw new Error("Server Error");
  // }

  return response
}

export const post = apiCall("POST")
export const get = apiCall("GET")
export const patch = apiCall("PATCH")
export const del = apiCall("DELETE")
export const put = apiCall("PUT")

export default {
  post,
  get,
  patch,
  delete: del,
  put,
}
