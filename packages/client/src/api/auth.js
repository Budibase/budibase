import API from "./api"
import { enrichRows } from "./rows"
import { TableNames } from "../constants"

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

/**
 * Fetches the currently logged in user object
 */
export const fetchSelf = async () => {
  const user = await API.get({ url: "/api/self" })
  if (user?._id) {
    return (await enrichRows([user], TableNames.USERS))[0]
  } else {
    return null
  }
}
