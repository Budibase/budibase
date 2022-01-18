import API from "./api"

/**
 * Notifies that an end user client app has been loaded.
 */
export const pingEndUser = async () => {
  return await API.post({
    url: `/api/analytics/ping`,
  })
}
