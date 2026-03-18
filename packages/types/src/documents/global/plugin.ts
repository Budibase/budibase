import { Document } from "../document"
import type { File } from "formidable"

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
export interface KoaFile extends Partial<File> {
  filepath?: File["filepath"]
  originalFilename?: File["originalFilename"]
  mimetype?: File["mimetype"]
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
  // Optional origin metadata to support update checks (e.g. GitHub)
  origin?: PluginOrigin
}

export const PLUGIN_TYPE_ARR = Object.values(PluginType)

export interface PluginSchema {
  type: PluginType
  [key: string]: any
}

export interface Package {
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
  cleanupDirectory: string
}

export interface PluginOrigin {
  source: "github"
  url: string
  repo: string
  etag?: string
  lastCheckedAt?: string
  latestKnownVersion?: string
}
