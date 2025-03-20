import { Document } from "../document"

export enum OAuth2CredentialsMethod {
  HEADER = "HEADER",
  BODY = "BODY",
}

export interface OAuth2Config {
  id: string
  name: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
}

export interface OAuth2Configs extends Document {
  configs: Record<string, OAuth2Config>
}
