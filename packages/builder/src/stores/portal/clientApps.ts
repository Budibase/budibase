import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { PublishedAppData } from "@budibase/types"

interface ClientAppsStoreState {
  apps: PublishedAppData[]
}

export class ClientAppsStore extends BudiStore<ClientAppsStoreState> {
  constructor() {
    super({
      apps: [],
    })
  }

  async load() {
    const apps = await API.getPublishedApps()
    this.update(state => ({
      ...state,
      apps,
    }))
  }
}

export const clientAppsStore = new ClientAppsStore()
