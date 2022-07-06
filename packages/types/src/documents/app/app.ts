import { Document } from "../document"

export type AppMetadataErrors = { [key: string]: string[] }

export interface App extends Document {
  appId: string
  type: string
  version: string
  componentLibraries: string[]
  name: string
  url: string | undefined
  template: string | undefined
  instance: AppInstance
  tenantId: string
  status: string
  revertableVersion?: string
  automationErrors?: AppMetadataErrors
}

export interface AppInstance {
  _id: string
}
