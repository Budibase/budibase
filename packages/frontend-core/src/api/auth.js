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
    url: "/api/global/auth",
    body: { username: email, password },
  })
}

/**
 * Fetches the currently logged in user object
 */
export const fetchSelf = async () => {
  const user = await API.get({ url: "/api/self" })
  if (user && user._id) {
    if (user.roleId === "PUBLIC") {
      // Don't try to enrich a public user as it will 403
      return user
    } else {
      return (await enrichRows([user], TableNames.USERS))[0]
    }
  } else {
    return null
  }
}
