import { Document } from "../document"
import { SourceName } from "../../sdk"
import { Table } from "./table"
import {
  RestTemplateId,
  RestTemplateName,
  RestTemplateSpecVersion,
} from "../../ui/rest"
import { OAuth2Config } from "./oauth2"

export interface Datasource extends Document {
  type: string
  name?: string
  source: SourceName
  // this is a googlesheets specific property which
  // can be found in the GSheets schema - pertains to SSO creds
  auth?: { type: string }
  // the config is defined by the schema
  config?: Record<string, any>
  plus?: boolean
  isSQL?: boolean
  /**
   * @deprecated Use restTemplateId instead. This field stored template names
   * which could change. restTemplateId stores stable identifiers.
   * Use getRestTemplateIdentifier() helper for backwards-compatible lookups.
   */
  restTemplate?: RestTemplateName
  restTemplateId?: RestTemplateId
  restTemplateVersion?: RestTemplateSpecVersion
  usesEnvironmentVariables?: boolean
  entities?: Record<string, Table>
}

export enum RestAuthType {
  BASIC = "basic",
  BEARER = "bearer",
  OAUTH2 = "oauth2",
  API_KEY = "apiKey",
}

export interface RestBasicAuthConfig {
  username: string
  password: string
}

export interface RestBearerAuthConfig {
  token: string
}

export interface BasicRestAuthConfig {
  _id: string
  name: string
  type: RestAuthType.BASIC
  config: RestBasicAuthConfig
}

export interface BearerRestAuthConfig {
  _id: string
  name: string
  type: RestAuthType.BEARER
  config: RestBearerAuthConfig
}

export interface OAuth2RestAuthConfig
  extends Omit<OAuth2Config, keyof Document> {
  _id: string
  type: RestAuthType.OAUTH2
}

export const REST_AUTH_SECRET_FIELD: Partial<Record<RestAuthType, string>> = {
  [RestAuthType.BASIC]: "password" satisfies keyof RestBasicAuthConfig,
  [RestAuthType.BEARER]: "token" satisfies keyof RestBearerAuthConfig,
  [RestAuthType.OAUTH2]: "clientSecret" satisfies keyof OAuth2RestAuthConfig,
}

export type RestAuthConfig =
  | BasicRestAuthConfig
  | BearerRestAuthConfig
  | OAuth2RestAuthConfig

export interface DynamicVariable {
  name: string
  queryId: string
  value: string
}

export interface RestConfig {
  // Base URL
  url: string
  rejectUnauthorized?: boolean
  downloadImages?: boolean
  defaultHeaders?: {
    [key: string]: any
  }
  defaultQueryParameters?: {
    [key: string]: string
  }
  legacyHttpParser?: boolean
  authConfigs?: RestAuthConfig[]
  staticVariables?: {
    [key: string]: string
  }
  templateStaticVariables?: string[]
  dynamicVariables?: DynamicVariable[]
}

export enum SourceType {
  DATASOURCE = "datasource",
  QUERY = "query",
  TABLE = "table",
  VIEW = "view",
}
