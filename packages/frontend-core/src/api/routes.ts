import { BaseAPIClient } from "./types"

export interface RouteEndpoints {
  // Missing request or response types
  fetchClientAppRoutes: () => Promise<{ routes: any }>
  fetchAppRoutes: () => Promise<{ routes: any }>
}

export const buildRouteEndpoints = (API: BaseAPIClient): RouteEndpoints => ({
  /**
   * Fetches available routes for the client app.
   */
  fetchClientAppRoutes: async () => {
    return await API.get({
      url: `/api/routing/client`,
    })
  },

  /**
   * Fetches all routes for the current app.
   */
  fetchAppRoutes: async () => {
    return await API.get({
      url: "/api/routing",
    })
  },
})
