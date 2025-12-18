import { PluginSource, Plugin } from "../../documents"

export interface UploadPluginRequest {}
export interface UploadPluginResponse {
  message: string
  plugins: Plugin[]
}

export interface CreatePluginRequest {
  source: PluginSource
  url: string
  githubToken?: string
  headers?: { [key: string]: string }
}

export interface CreatePluginResponse {
  plugin: any
}

export type FetchPluginResponse = Plugin[]

export interface DeletePluginResponse {
  message: string
}

export interface PluginUpdateInfo {
  pluginId: string
  name: string
  currentVersion: string
  latestVersion: string
  releaseUrl?: string
  releasePublishedAt?: string
  releaseNotes?: string
}

export interface PluginUpdateCheckResponse {
  updates: PluginUpdateInfo[]
}

export interface PluginUpdateCheckRequest {
  token?: string
}

export interface PluginUpdateApplyRequest {
  pluginIds?: string[]
  token?: string
}

export interface PluginUpdateResult {
  pluginId: string
  name: string
  previousVersion: string
  updatedVersion: string
}

export interface PluginUpdateApplyResponse {
  updated: PluginUpdateResult[]
  failed: { pluginId: string; name: string; error: string }[]
}
