import API from "./api"

/**
 * Performs a log in request.
 */
export const logIn = async ({ username, password }) => {
  if (!username) {
    return API.error("Please enter your username")
  }
  if (!password) {
    return API.error("Please enter your password")
  }
  return await API.post({
    url: "/api/authenticate",
    body: { username, password },
  })
}
