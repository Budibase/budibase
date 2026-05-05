import type { AgentKnowledgeSourceConnectionSummary } from "@budibase/types"
import { API } from "@/api"
import { BudiStore } from "../BudiStore"

interface KnowledgeConnectionsState {
  connections: AgentKnowledgeSourceConnectionSummary[]
  loaded: boolean
}

class KnowledgeConnectionsStore extends BudiStore<KnowledgeConnectionsState> {
  constructor() {
    super({
      connections: [],
      loaded: false,
    })
  }

  fetch = async () => {
    const response = await API.fetchAgentKnowledgeSourceConnections()
    this.update(state => {
      state.connections = response.connections || []
      state.loaded = true
      return state
    })
    return response.connections || []
  }
}

export const knowledgeConnectionsStore = new KnowledgeConnectionsStore()
