import { Document } from "../document"

export enum PluginType {
  DATASOURCE = "datasource",
  COMPONENT = "component",
  AUTOMATION = "automation",
}

export enum PluginSource {
  NPM = "NPM",
  GITHUB = "Github",
  URL = "URL",
  FILE = "File Upload",
}
export interface KoaFile {
  path: string | null
  name: string | null
}

export interface Plugin extends Document {
  description: string
  name: string
  version: string
  source: PluginSource
  package: { [key: string]: any }
  hash: string
  schema: PluginSchema
  iconFileName?: string
  // Populated on read
  jsUrl?: string
  // Populated on read
  iconUrl?: string
}

export const PLUGIN_TYPE_ARR = Object.values(PluginType)

export interface PluginSchema {
  type: PluginType
  [key: string]: any
}

interface Package {
  name: string
  version: string
  description: string
}

export interface PluginMetadata {
  schema: PluginSchema
  package: Package
}

export interface PluginUpload {
  metadata: PluginMetadata
  directory: string
}
