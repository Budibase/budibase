import { publishEvent } from "../events"
import {
  Event,
  Plugin,
  PluginDeletedEvent,
  PluginImportedEvent,
  PluginInitEvent,
} from "@budibase/types"

async function init(plugin: Plugin) {
  const properties: PluginInitEvent = {
    type: plugin.schema.type,
    name: plugin.name,
    description: plugin.description,
    version: plugin.version,
  }
  await publishEvent(Event.PLUGIN_INIT, properties)
}

async function imported(plugin: Plugin) {
  const properties: PluginImportedEvent = {
    pluginId: plugin._id as string,
    type: plugin.schema.type,
    source: plugin.source,
    name: plugin.name,
    description: plugin.description,
    version: plugin.version,
  }
  await publishEvent(Event.PLUGIN_IMPORTED, properties)
}

async function deleted(plugin: Plugin) {
  const properties: PluginDeletedEvent = {
    pluginId: plugin._id as string,
    type: plugin.schema.type,
    name: plugin.name,
    description: plugin.description,
    version: plugin.version,
  }
  await publishEvent(Event.PLUGIN_DELETED, properties)
}

export default {
  init,
  imported,
  deleted,
}
