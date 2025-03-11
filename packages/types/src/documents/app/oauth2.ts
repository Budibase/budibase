import { Document } from "../document"

export interface OAuth2Config {}

export interface OAuth2Configs extends Document {
  configs: OAuth2Config[]
}
