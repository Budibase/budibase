import { API } from "@/api"
import { BudiStore } from "@/stores/BudiStore"
import { OAuth2Config, UpsertOAuth2Config } from "@/types"
import { ValidateConfigRequest } from "@budibase/types"

interface OAuth2StoreState {
  configs: OAuth2Config[]
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
          method: c.method,
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

  async create(config: UpsertOAuth2Config) {
    await API.oauth2.create(config)
    await this.fetch()
  }

  async edit(id: string, config: UpsertOAuth2Config) {
    await API.oauth2.update(id, config)
    await this.fetch()
  }

  async delete(id: string) {
    await API.oauth2.delete(id)
    await this.fetch()
  }

  async validate(config: ValidateConfigRequest) {
    return await API.oauth2.validate(config)
  }
}

export const oauth2 = new OAuth2Store()
