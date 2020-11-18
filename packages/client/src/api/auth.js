import api from "./api"

/**
 * Performs a log in request.
 */
export const logIn = async ({ username, password }) => {
  if (!username) {
    return api.error("Please enter your username")
  }
  if (!password) {
    return api.error("Please enter your password")
  }
  return await api.post({
    url: "/api/authenticate",
    body: { username, password },
  })
}
