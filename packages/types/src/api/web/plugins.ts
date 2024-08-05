import { PluginSource } from "../../documents"

export interface CreatePluginRequest {
  source: PluginSource
  url: string
  githubToken?: string
  headers?: { [key: string]: string }
}

export interface CreatePluginResponse {
  plugin: any
}
