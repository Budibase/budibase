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

export const PLUGIN_TYPE_ARR = Object.values(PluginType)
