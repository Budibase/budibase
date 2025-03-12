import { Document } from "../document"

export interface OAuth2Config {
  id: string
  name: string
  url: string
}

export interface OAuth2Configs extends Document {
  configs: Record<string, OAuth2Config>
}
