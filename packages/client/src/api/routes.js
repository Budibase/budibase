import api from "./api"

/**
 * Fetches available routes for the client app.
 */
export const fetchRoutes = async () => {
  return await api.get({
    url: `/api/routing/client`,
  })
}
