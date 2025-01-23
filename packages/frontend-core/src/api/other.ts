import {
  FetchBuiltinPermissionsResponse,
  FetchIntegrationsResponse,
  GetEnvironmentResponse,
  GetVersionResponse,
  SystemStatusResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface OtherEndpoints {
  getSystemStatus: () => Promise<SystemStatusResponse>
  getBudibaseVersion: () => Promise<string>
  getIntegrations: () => Promise<FetchIntegrationsResponse>
  getBasePermissions: () => Promise<FetchBuiltinPermissionsResponse>
  getEnvironment: () => Promise<GetEnvironmentResponse>
}

export const buildOtherEndpoints = (API: BaseAPIClient): OtherEndpoints => ({
  /**
   * Gets the current environment details.
   */
  getEnvironment: async () => {
    return await API.get({
      url: "/api/system/environment",
    })
  },

  /**
   * Gets the current system status.
   */
  getSystemStatus: async () => {
    return await API.get({
      url: "/api/system/status",
    })
  },

  /**
   * Gets the list of available integrations.
   */
  getIntegrations: async () => {
    return await API.get({
      url: "/api/integrations",
    })
  },

  /**
   * Gets the version of the installed Budibase environment.
   */
  getBudibaseVersion: async () => {
    return (
      await API.get<GetVersionResponse>({
        url: "/api/dev/version",
      })
    ).version
  },

  /**
   * Gets the base permissions for roles.
   */
  getBasePermissions: async () => {
    return await API.get({
      url: "/api/permission/builtin",
    })
  },
})
