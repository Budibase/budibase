import { Document } from "../document"
import { TranslationOverrides } from "../workspace/workspace"

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
  platformTitle?: string
  loginHeading?: string
  loginButton?: string
  metaDescription?: string
  metaImageUrl?: string
  metaTitle?: string
}

export enum LockReason {
  FREE_TIER = "free_tier", // Locked because grace period in free tier has ended
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
  createdVersion?: string
  lockedBy?: LockReason
  active?: boolean
  liteLLM?: { keyId: string; secretKey: string }
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

export interface MicrosoftInnerConfig {
  clientID: string
  clientSecret: string
  tenantId?: string
  activated: boolean
}

export interface MicrosoftConfig extends Config<MicrosoftInnerConfig> {}

export interface OIDCStrategyConfiguration {
  issuer: string
  authorizationURL: string
  tokenURL: string
  userInfoURL: string
  clientID: string
  clientSecret: string
  callbackURL: string
  pkce?: PKCEMethod
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
  pkce?: PKCEMethod
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

export interface RecaptchaInnerConfig {
  siteKey: string
  secretKey: string
}

export interface RecaptchaConfig extends Config<RecaptchaInnerConfig> {}

export interface TranslationLocaleConfig {
  label?: string
  overrides: TranslationOverrides
  updatedAt?: string
  updatedBy?: string
}

export interface TranslationsConfigInner {
  defaultLocale: string
  locales: Record<string, TranslationLocaleConfig>
}

export interface TranslationsConfig extends Config<TranslationsConfigInner> {}

export const isConfig = (config: Object): config is Config =>
  "type" in config && "config" in config

export const isSettingsConfig = (config: Config): config is SettingsConfig =>
  config.type === ConfigType.SETTINGS

export const isSMTPConfig = (config: Config): config is SMTPConfig =>
  config.type === ConfigType.SMTP

export const isGoogleConfig = (config: Config): config is GoogleConfig =>
  config.type === ConfigType.GOOGLE

export const isMicrosoftConfig = (config: Config): config is MicrosoftConfig =>
  config.type === ConfigType.MICROSOFT

export const isOIDCConfig = (config: Config): config is OIDCConfig =>
  config.type === ConfigType.OIDC

export const isSCIMConfig = (config: Config): config is SCIMConfig =>
  config.type === ConfigType.SCIM

export const isRecaptchaConfig = (config: Config): config is RecaptchaConfig =>
  config.type === ConfigType.RECAPTCHA

export const isTranslationsConfig = (
  config: Config
): config is TranslationsConfig => config.type === ConfigType.TRANSLATIONS

export enum PKCEMethod {
  S256 = "S256",
  PLAIN = "plain",
}

export enum ConfigType {
  SETTINGS = "settings",
  ACCOUNT = "account",
  SMTP = "smtp",
  GOOGLE = "google",
  MICROSOFT = "microsoft",
  OIDC = "oidc",
  OIDC_LOGOS = "logos_oidc",
  SCIM = "scim",
  /** @deprecated use the ai sdk instead */
  AI = "ai",
  RECAPTCHA = "recaptcha",
  TRANSLATIONS = "translations",
}

export interface ConfigTypeMap {
  [ConfigType.SETTINGS]: SettingsConfig
  [ConfigType.ACCOUNT]: never
  [ConfigType.SMTP]: SMTPConfig
  [ConfigType.GOOGLE]: GoogleConfig
  [ConfigType.MICROSOFT]: MicrosoftConfig
  [ConfigType.OIDC]: OIDCConfig
  [ConfigType.OIDC_LOGOS]: OIDCLogosConfig
  [ConfigType.SCIM]: SCIMConfig
  [ConfigType.AI]: never
  [ConfigType.RECAPTCHA]: RecaptchaConfig
  [ConfigType.TRANSLATIONS]: TranslationsConfig
}

export type ConfigTypeToConfig<T extends ConfigType> = ConfigTypeMap[T]
