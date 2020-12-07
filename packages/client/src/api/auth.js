import API from "./api"

/**
 * Performs a log in request.
 */
export const logIn = async ({ email, password }) => {
  if (!email) {
    return API.error("Please enter your email")
  }
  if (!password) {
    return API.error("Please enter your password")
  }
  return await API.post({
    url: "/api/authenticate",
    body: { email, password },
  })
}
