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
