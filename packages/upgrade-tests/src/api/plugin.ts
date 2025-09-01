import { Plugin } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class PluginAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<Plugin[]> {
    const { data } = await this.client.get<Plugin[]>("/api/plugin")
    return data
  }

  async get(pluginId: string): Promise<Plugin> {
    const { data } = await this.client.get<Plugin>(`/api/plugin/${pluginId}`)
    return data
  }
}
