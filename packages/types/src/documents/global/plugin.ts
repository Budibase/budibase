import { Document } from "../document"

export enum PluginType {
  DATASOURCE = "datasource",
  COMPONENT = "component",
}

export enum PluginSource {
  NPM = "NPM",
  GITHUB = "Github",
  URL = "URL",
  FILE = "File Upload",
}
export interface FileType {
  path: string
  name: string
}

export interface Plugin extends Document {
  description: string
  name: string
  version: string
  jsUrl?: string
  iconUrl?: string
  source: PluginSource
  package: { [key: string]: any }
  hash: string
  schema: {
    type: PluginType
    [key: string]: any
  }
}

export const PLUGIN_TYPE_ARR = Object.values(PluginType)
