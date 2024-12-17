import {
  FetchClientScreenRoutingResponse,
  FetchScreenRoutingResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface RouteEndpoints {
  fetchClientAppRoutes: () => Promise<FetchClientScreenRoutingResponse>
  fetchAppRoutes: () => Promise<FetchScreenRoutingResponse>
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
