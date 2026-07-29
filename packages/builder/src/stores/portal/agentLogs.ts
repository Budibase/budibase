import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  DownloadAgentConversationLogsRequest,
  SearchAgentConversationLogsRequest,
  SearchAgentConversationLogsResponse,
} from "@budibase/types"

interface PortalAgentLogsStore {
  logs?: SearchAgentConversationLogsResponse
}

class AgentLogsStore extends BudiStore<PortalAgentLogsStore> {
  constructor() {
    super({})
  }

  async search(opts: SearchAgentConversationLogsRequest = {}) {
    const res = await API.searchAgentConversationLogs(opts)
    this.update(state => ({
      ...state,
      logs: res,
    }))
    return res
  }

  getDownloadUrl(opts: DownloadAgentConversationLogsRequest = {}) {
    return API.getAgentConversationLogDownloadUrl(opts)
  }
}

export const agentLogs = new AgentLogsStore()
