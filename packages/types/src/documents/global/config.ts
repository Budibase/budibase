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
  fallback?: boolean
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
  docsUrl?: string
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

export type AIProvider =
  | "OpenAI"
  | "Anthropic"
  | "AzureOpenAI"
  | "TogetherAI"
  | "Custom"
  | "BudibaseAI"

export interface ProviderConfig {
  provider: AIProvider
  isDefault: boolean
  name: string
  active: boolean
  baseUrl?: string
  apiKey?: string
  defaultModel?: string
}

export interface AIInnerConfig {
  [key: string]: ProviderConfig
}

export interface AIConfig extends Config<AIInnerConfig> {}

export interface RecaptchaInnerConfig {
  siteKey: string
  secretKey: string
}

export interface RecaptchaConfig extends Config<RecaptchaInnerConfig> {}

export const isConfig = (config: Object): config is Config =>
  "type" in config && "config" in config

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

export const isAIConfig = (config: Config): config is AIConfig =>
  config.type === ConfigType.AI

export const isRecaptchaConfig = (config: Config): config is RecaptchaConfig =>
  config.type === ConfigType.RECAPTCHA

export enum ConfigType {
  SETTINGS = "settings",
  ACCOUNT = "account",
  SMTP = "smtp",
  GOOGLE = "google",
  OIDC = "oidc",
  OIDC_LOGOS = "logos_oidc",
  SCIM = "scim",
  AI = "ai",
  RECAPTCHA = "recaptcha",
}

export type ConfigTypeToConfig<T extends ConfigType> =
  T extends ConfigType.SETTINGS
    ? SettingsConfig
    : T extends ConfigType.SMTP
      ? SMTPConfig
      : T extends ConfigType.GOOGLE
        ? GoogleConfig
        : T extends ConfigType.OIDC
          ? OIDCConfig
          : T extends ConfigType.OIDC_LOGOS
            ? OIDCLogosConfig
            : T extends ConfigType.SCIM
              ? SCIMConfig
              : T extends ConfigType.AI
                ? AIConfig
                : never
