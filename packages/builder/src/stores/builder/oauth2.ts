import { API } from "@/api"
import { BudiStore } from "@/stores/BudiStore"
import { OAuth2Config } from "@/types"
import {
  InsertOAuth2ConfigRequest,
  UpdateOAuth2ConfigRequest,
  ValidateConfigRequest,
} from "@budibase/types"

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
          _id: c._id,
          _rev: c._rev,
          name: c.name,
          url: c.url,
          clientId: c.clientId,
          clientSecret: c.clientSecret,
          scope: c.scope,
          method: c.method,
          grantType: c.grantType,
          lastUsage: c.lastUsage,
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

  async create(config: InsertOAuth2ConfigRequest) {
    await API.oauth2.create(config)
    await this.fetch()
  }

  async edit(config: UpdateOAuth2ConfigRequest) {
    await API.oauth2.update(config)
    await this.fetch()
  }

  async delete(id: string, rev: string) {
    await API.oauth2.delete(id, rev)
    await this.fetch()
  }

  async validate(config: ValidateConfigRequest) {
    return await API.oauth2.validate(config)
  }
}

export const oauth2 = new OAuth2Store()
