import { API } from "@/api"
import { BudiStore } from "@/stores/BudiStore"
import { CreateOAuth2Config } from "@/types"

interface Config {
  id: string
  name: string
}

export class OAuth2Store extends BudiStore<Config[]> {
  constructor() {
    super([])
  }

  async fetch() {
    const configs = await API.oauth2.fetch()
    this.store.set(configs.map(c => ({ id: c.id, name: c.name })))
  }

  async create(config: CreateOAuth2Config) {
    await API.oauth2.create(config)
    await this.fetch()
  }
}

export const oauth2 = new OAuth2Store()
