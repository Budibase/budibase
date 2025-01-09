import {
  Config,
  ConfigChecklistResponse,
  ConfigType,
  DeleteConfigResponse,
  FindConfigResponse,
  GetPublicOIDCConfigResponse,
  GetPublicSettingsResponse,
  OIDCLogosConfig,
  SaveConfigRequest,
  SaveConfigResponse,
  UploadConfigFileResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface ConfigEndpoints {
  getConfig: (type: ConfigType) => Promise<FindConfigResponse>
  getTenantConfig: (tentantId: string) => Promise<GetPublicSettingsResponse>
  getOIDCConfigs: (tenantId: string) => Promise<GetPublicOIDCConfigResponse>
  getOIDCLogos: () => Promise<Config<OIDCLogosConfig>>
  saveConfig: (config: SaveConfigRequest) => Promise<SaveConfigResponse>
  deleteConfig: (id: string, rev: string) => Promise<DeleteConfigResponse>
  getChecklist: (tenantId: string) => Promise<ConfigChecklistResponse>
  uploadLogo: (data: any) => Promise<UploadConfigFileResponse>
  uploadFavicon: (data: any) => Promise<UploadConfigFileResponse>
  uploadOIDCLogo: (name: string, data: any) => Promise<UploadConfigFileResponse>
}

export const buildConfigEndpoints = (API: BaseAPIClient): ConfigEndpoints => ({
  /**
   * Saves a global config.
   * @param config the config to save
   */
  saveConfig: async config => {
    return await API.post({
      url: "/api/global/configs",
      body: config,
    })
  },

  /**
   * Gets a global config of a certain type.
   * @param type the type to fetch
   */
  getConfig: async type => {
    return await API.get({
      url: `/api/global/configs/${type}`,
    })
  },

  /**
   * Deletes a global config
   * @param id the id of the config to delete
   * @param rev the revision of the config to delete
   */
  deleteConfig: async (id, rev) => {
    return await API.delete({
      url: `/api/global/configs/${id}/${rev}`,
    })
  },

  /**
   * Gets the config for a certain tenant.
   * @param tenantId the tenant ID to get the config for
   */
  getTenantConfig: async tenantId => {
    return await API.get({
      url: `/api/global/configs/public?tenantId=${tenantId}`,
    })
  },

  /**
   * Gets the OIDC config for a certain tenant.
   * @param tenantId the tenant ID to get the config for
   */
  getOIDCConfigs: async tenantId => {
    return await API.get({
      url: `/api/global/configs/public/oidc?tenantId=${tenantId}`,
    })
  },

  /**
   * Gets the checklist for a specific tenant.
   * @param tenantId the tenant ID to get the checklist for
   */
  getChecklist: async tenantId => {
    return await API.get({
      url: `/api/global/configs/checklist?tenantId=${tenantId}`,
    })
  },

  /**
   * Updates the company logo for the environment.
   * @param data the logo form data
   */
  uploadLogo: async data => {
    return await API.post({
      url: "/api/global/configs/upload/settings/logoUrl",
      body: data,
      json: false,
    })
  },

  /**
   * Updates the company favicon for the environment.
   * @param data the favicon form data
   */
  uploadFavicon: async data => {
    return await API.post({
      url: "/api/global/configs/upload/settings/faviconUrl",
      body: data,
      json: false,
    })
  },

  /**
   * Uploads a logo for an OIDC provider.
   * @param name the name of the OIDC provider
   * @param data the logo form data to upload
   */
  uploadOIDCLogo: async (name, data) => {
    return await API.post({
      url: `/api/global/configs/upload/logos_oidc/${name}`,
      body: data,
      json: false,
    })
  },

  /**
   * Gets the list of OIDC logos.
   */
  getOIDCLogos: async () => {
    return await API.get({
      url: "/api/global/configs/logos_oidc",
    })
  },
})
