import { Document } from "../document"

export interface Config extends Document {
  type: ConfigType
  config: any
}

export interface SMTPConfig extends Config {
  config: {
    port: number
    host: string
    from: string
    subject: string
    secure: boolean
  }
}

export interface SettingsConfig extends Config {
  config: {
    company: string
    // Populated on read
    logoUrl?: string
    logoUrlEtag?: boolean
    platformUrl: string
    uniqueTenantId?: string
    analyticsEnabled?: boolean
  }
}

export interface GoogleConfig extends Config {
  config: {
    clientID: string
    clientSecret: string
    activated: boolean
  }
}

export interface OIDCConfiguration {
  issuer: string
  authorizationURL: string
  tokenURL: string
  userInfoURL: string
  clientID: string
  clientSecret: string
  callbackURL: string
}

export interface OIDCInnerCfg {
  configUrl: string
  clientID: string
  clientSecret: string
  logo: string
  name: string
  uuid: string
  activated: boolean
}

export interface OIDCConfig extends Config {
  config: {
    configs: OIDCInnerCfg[]
  }
}

export const isSettingsConfig = (config: Config): config is SettingsConfig =>
  config.type === ConfigType.SETTINGS

export const isSMTPConfig = (config: Config): config is SMTPConfig =>
  config.type === ConfigType.SMTP

export const isGoogleConfig = (config: Config): config is GoogleConfig =>
  config.type === ConfigType.GOOGLE

export const isOIDCConfig = (config: Config): config is OIDCConfig =>
  config.type === ConfigType.OIDC

export enum ConfigType {
  SETTINGS = "settings",
  ACCOUNT = "account",
  SMTP = "smtp",
  GOOGLE = "google",
  OIDC = "oidc",
  OIDC_LOGOS = "logos_oidc",
}
