import { API } from "@/api"
import { BudiStore } from "@/stores/BudiStore"
import { CreateOAuth2Config } from "@/types"

interface Config {
  id: string
  name: string
}

interface OAuth2StoreState {
  configs: Config[]
  loading: boolean
  error?: string
}

export class OAuth2Store extends BudiStore<OAuth2StoreState> {
  constructor() {
    super({
      configs: [],
      loading: false,
    })
  }

  async fetch() {
    this.store.update(store => ({
      ...store,
      loading: true,
    }))
    try {
      const configs = await API.oauth2.fetch()
      this.store.update(store => ({
        ...store,
        configs: configs.map(c => ({
          id: c.id,
          name: c.name,
          url: c.url,
          clientId: c.clientId,
          clientSecret: c.clientSecret,
        })),
        loading: false,
      }))
    } catch (e: any) {
      this.store.update(store => ({
        ...store,
        loading: false,
        error: e.message,
      }))
    }
  }

  async create(config: CreateOAuth2Config) {
    await API.oauth2.create(config)
    await this.fetch()
  }

  async delete(id: string) {
    await API.oauth2.delete(id)
    await this.fetch()
  }
}

export const oauth2 = new OAuth2Store()
