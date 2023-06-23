import { Document } from "../document"

export interface Config<T = any> extends Document {
  type: ConfigType
  config: T
}

export interface SMTPInnerConfig {
  port: number
  host: string
  from: string
  subject?: string
  secure: boolean
  auth?: {
    user: string
    pass: string
  }
  connectionTimeout?: any
}

export interface SMTPConfig extends Config<SMTPInnerConfig> {}

/**
 * Accessible only via pro.
 */
export interface SettingsBrandingConfig {
  faviconUrl?: string
  faviconUrlEtag?: string

  emailBrandingEnabled?: boolean
  testimonialsEnabled?: boolean
  platformTitle?: string
  loginHeading?: string
  loginButton?: string

  metaDescription?: string
  metaImageUrl?: string
  metaTitle?: string
}

export interface SettingsInnerConfig {
  platformUrl?: string
  company?: string
  logoUrl?: string // Populated on read
  logoUrlEtag?: string
  uniqueTenantId?: string
  analyticsEnabled?: boolean
  isSSOEnforced?: boolean
}

export interface SettingsConfig extends Config<SettingsInnerConfig> {}

export type SSOConfigType = ConfigType.GOOGLE | ConfigType.OIDC
export type SSOConfig = GoogleInnerConfig | OIDCInnerConfig

export interface GoogleInnerConfig {
  clientID: string
  clientSecret: string
  activated: boolean
  /**
   * @deprecated read only
   */
  callbackURL?: string
}

export interface GoogleConfig extends Config<GoogleInnerConfig> {}

export interface OIDCStrategyConfiguration {
  issuer: string
  authorizationURL: string
  tokenURL: string
  userInfoURL: string
  clientID: string
  clientSecret: string
  callbackURL: string
}

export interface OIDCConfigs {
  configs: OIDCInnerConfig[]
}

export interface OIDCLogosInnerConfig {
  [key: string]: string
}

export interface OIDCLogosConfig extends Config<OIDCLogosInnerConfig> {}

export interface OIDCInnerConfig {
  configUrl: string
  clientID: string
  clientSecret: string
  logo: string
  name: string
  uuid: string
  activated: boolean
  scopes: string[]
}

export interface OIDCConfig extends Config<OIDCConfigs> {}

export interface OIDCWellKnownConfig {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  userinfo_endpoint: string
}

export interface SCIMInnerConfig {
  enabled: boolean
}

export interface SCIMConfig extends Config<SCIMInnerConfig> {}

export const isSettingsConfig = (config: Config): config is SettingsConfig =>
  config.type === ConfigType.SETTINGS

export const isSMTPConfig = (config: Config): config is SMTPConfig =>
  config.type === ConfigType.SMTP

export const isGoogleConfig = (config: Config): config is GoogleConfig =>
  config.type === ConfigType.GOOGLE

export const isOIDCConfig = (config: Config): config is OIDCConfig =>
  config.type === ConfigType.OIDC

export const isSCIMConfig = (config: Config): config is SCIMConfig =>
  config.type === ConfigType.SCIM

export enum ConfigType {
  SETTINGS = "settings",
  ACCOUNT = "account",
  SMTP = "smtp",
  GOOGLE = "google",
  OIDC = "oidc",
  OIDC_LOGOS = "logos_oidc",
  SCIM = "scim",
}
