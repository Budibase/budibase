export const buildRouteEndpoints = API => ({
  /**
   * Fetches available routes for the client app.
   */
  fetchClientAppRoutes: async () => {
    return await API.get({
      url: `/api/routing/client`,
    })
  },
})
