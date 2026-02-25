import { API } from "@/api"
import { notifications } from "@budibase/bbui"
import type { PublishedChatAppData } from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface ClientChatAppsStoreState {
  chatApps: PublishedChatAppData[]
  loaded: boolean
}

interface PublishedChatAppAgent {
  agentId?: string
  agentName?: string
  name?: string
  isEnabled?: boolean
}

interface PublishedChatAppWithAgents extends PublishedChatAppData {
  agents?: PublishedChatAppAgent[]
}

const normalizePublishedChatApps = (
  chatApps: PublishedChatAppWithAgents[]
): PublishedChatAppData[] =>
  chatApps.flatMap(chatApp => {
    const agents = chatApp.agents || []
    if (!agents.length) {
      return [chatApp]
    }

    const enabledAgents = agents.filter(agent => agent.isEnabled !== false)
    if (!enabledAgents.length) {
      return []
    }

    return enabledAgents.map(agent => {
      const agentId = agent.agentId
      const baseUrl = chatApp.url.replace(/\/$/, "")
      return {
        ...chatApp,
        agentId,
        agentName: agent.agentName || agent.name,
        name: agent.agentName || agent.name || chatApp.name,
        url:
          agentId && !baseUrl.endsWith(`/agent/${encodeURIComponent(agentId)}`)
            ? `${baseUrl}/agent/${encodeURIComponent(agentId)}`
            : baseUrl,
      }
    })
  })

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
      const chatApps = normalizePublishedChatApps(
        (await API.getPublishedChatApps()) as PublishedChatAppWithAgents[]
      )
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
