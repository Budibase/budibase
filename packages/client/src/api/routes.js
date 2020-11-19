import API from "./api"

/**
 * Fetches available routes for the client app.
 */
export const fetchRoutes = async () => {
  return await API.get({
    url: `/api/routing/client`,
  })
}
