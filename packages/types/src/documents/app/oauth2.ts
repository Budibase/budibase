import { Document } from "../document"

export enum OAuth2CredentialsMethod {
  HEADER = "HEADER",
  BODY = "BODY",
}

export interface OAuth2Config extends Document {
  name: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
}
