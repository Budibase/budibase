export enum PluginType {
  DATASOURCE = "datasource",
  COMPONENT = "component",
}

export interface FileType {
  path: string
  name: string
}

export const PLUGIN_TYPE_ARR = Object.values(exports.PluginType)
