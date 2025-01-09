import { get } from "svelte/store"
import { API } from "@/api"
import { auth } from "@/stores/portal"
import { BudiStore } from "../BudiStore"
import { PublicOIDCConfig } from "@budibase/types"

class OIDCStore extends BudiStore<PublicOIDCConfig> {
  constructor() {
    super({})
  }

  async init() {
    const tenantId = get(auth).tenantId
    const configs = await API.getOIDCConfigs(tenantId)
    // Just use the first config for now.
    // We will be support multiple logins buttons later on.
    this.set(configs[0] || {})
  }
}

export const oidc = new OIDCStore()
