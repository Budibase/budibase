import { SystemStatusResponse } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface OtherEndpoints {
  getSystemStatus: () => Promise<SystemStatusResponse>
  getBudibaseVersion: () => Promise<string>

  // Missing request or response types
  getEnvironment: () => Promise<Record<string, any>>
  getIntegrations: () => Promise<Record<string, any>>
  getBasePermissions: () => Promise<any[]>
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
      await API.get<{ version: string }>({
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
