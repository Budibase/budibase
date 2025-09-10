import { API } from "@/api"
import { PublishedWorkspaceData } from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface ClientAppsStoreState {
  apps: PublishedWorkspaceData[]
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
