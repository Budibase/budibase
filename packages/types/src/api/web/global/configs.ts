import {
  Config,
  ConfigType,
  SettingsBrandingConfig,
  SettingsConfig,
  SettingsInnerConfig,
} from "../../../documents"

/**
 * Settings that aren't stored in the database - enriched at runtime.
 */
export interface PublicSettingsInnerConfig extends SettingsInnerConfig {
  google: boolean
  googleDatasourceConfigured: boolean
  oidc: boolean
  oidcCallbackUrl: string
  googleCallbackUrl: string
}

export interface GetPublicSettingsResponse extends SettingsConfig {
  config: PublicSettingsInnerConfig
}

export interface PublicOIDCConfig {
  logo?: string
  name?: string
  uuid?: string
}

export type GetPublicOIDCConfigResponse = PublicOIDCConfig[]

export interface SaveConfigRequest extends Config {}
export interface SaveConfigResponse {
  type: ConfigType
  _id: string
  _rev: string
}

export interface DeleteConfigResponse {
  message: string
}

interface ChecklistItem {
  checked: boolean
  label: string
  link: string
}
export interface ConfigChecklistResponse {
  apps: ChecklistItem
  smtp: ChecklistItem
  adminUser: ChecklistItem
  sso: ChecklistItem
  branding: SettingsBrandingConfig
}

export type FindConfigResponse = Config | {}

export interface UploadConfigFileResponse {
  message: string
  url: string
}
