import { BaseEvent } from "./event"
import { PluginSource, PluginType } from "../../"

export interface PluginInitEvent extends BaseEvent {
  type: PluginType
  name: string
  version: string
  description: string
}

export interface PluginImportedEvent extends BaseEvent {
  pluginId: string
  type: PluginType
  source: PluginSource
  name: string
  version: string
  description: string
}

export interface PluginDeletedEvent extends BaseEvent {
  pluginId: string
  type: PluginType
  name: string
  version: string
  description: string
}
