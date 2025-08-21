import { Config, ConfigType } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class ConfigAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<Config[]> {
    const { data } = await this.client.get<Config[]>("/api/global/configs")
    return data
  }

  async get(configType: ConfigType): Promise<Config> {
    const { data } = await this.client.get<Config>(
      `/api/global/configs/${configType}`
    )
    return data
  }
}
