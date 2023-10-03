import { Document } from "../document"
import { SourceName } from "../../sdk"
import { Table } from "./table"

export interface Datasource extends Document {
  type: string
  name?: string
  source: SourceName
  // the config is defined by the schema
  config?: Record<string, any>
  plus?: boolean
  isSQL?: boolean
  entities?: {
    [key: string]: Table
  }
}

export enum RestAuthType {
  BASIC = "basic",
  BEARER = "bearer",
}

export interface RestBasicAuthConfig {
  username: string
  password: string
}

export interface RestBearerAuthConfig {
  token: string
}

export interface RestAuthConfig {
  _id: string
  name: string
  type: RestAuthType
  config: RestBasicAuthConfig | RestBearerAuthConfig
}

export interface RestConfig {
  url: string
  rejectUnauthorized: boolean
  defaultHeaders: {
    [key: string]: any
  }
  legacyHttpParser: boolean
  authConfigs: RestAuthConfig[]
  staticVariables: {
    [key: string]: string
  }
  dynamicVariables: [
    {
      name: string
      queryId: string
      value: string
    }
  ]
}
