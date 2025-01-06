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
    const config = await API.getOIDCConfig(tenantId)
    if (Object.keys(config || {}).length) {
      // Just use the first config for now.
      // We will be support multiple logins buttons later on.
      this.set(config[0])
    } else {
      this.set({})
    }
  }
}

export const oidc = new OIDCStore()
