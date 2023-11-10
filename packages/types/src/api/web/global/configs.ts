import { SettingsConfig, SettingsInnerConfig } from "../../../documents"

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
