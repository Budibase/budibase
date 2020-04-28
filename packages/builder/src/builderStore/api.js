const apiCall = method => async (url, body) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body && JSON.stringify(body),
  })

  // if (response.status === 500) {
  //   throw new Error("Server Error");
  // }

  return response;
}

const post = apiCall("POST")
const get = apiCall("GET")
const patch = apiCall("PATCH")
const del = apiCall("DELETE")

export default {
  post,
  get,
  patch,
  delete: del,
}
