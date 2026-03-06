import { API } from "@/api"
import { notifications } from "@budibase/bbui"
import type { PublishedChatAppData } from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface ClientChatAppsStoreState {
  chatApps: PublishedChatAppData[]
  loaded: boolean
}

export class ClientChatAppsStore extends BudiStore<ClientChatAppsStoreState> {
  constructor() {
    super({
      chatApps: [],
      loaded: false,
    })
  }

  async load() {
    this.update(state => ({
      ...state,
      loaded: false,
    }))

    try {
      const chatApps = await API.getPublishedChatApps()
      this.update(state => ({
        ...state,
        chatApps,
        loaded: true,
      }))
    } catch (_error) {
      notifications.error("Error loading chat apps")
      this.update(state => ({
        ...state,
        chatApps: [],
        loaded: true,
      }))
    }
  }
}

export const clientChatAppsStore = new ClientChatAppsStore()
