import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { AgentHistory, SaveAgentHistoryRequest } from "@budibase/types"

interface AgentStore {
  history: AgentHistory[]
  currentHistoryId?: string
}

export class AgentsStore extends BudiStore<AgentStore> {
  constructor() {
    super({
      history: [],
    })

    this.saveHistory = this.saveHistory.bind(this)
    this.removeHistory = this.removeHistory.bind(this)
    this.fetchHistory = this.fetchHistory.bind(this)
    this.setCurrentHistoryId = this.setCurrentHistoryId.bind(this)
    this.init = this.init.bind(this)
  }

  async init() {
    await this.fetchHistory()
  }

  async fetchHistory() {
    const history = await API.fetchHistory()
    this.update(state => {
      state.history = history
      return state
    })
    return history
  }

  async saveHistory(history: SaveAgentHistoryRequest) {
    return await API.saveHistory(history)
  }

  async removeHistory(historyId: string) {
    return await API.removeHistory(historyId)
  }

  setCurrentHistoryId(historyId: string) {
    this.update(state => {
      state.currentHistoryId = historyId
      return state
    })
  }

  clearCurrentHistoryId() {
    this.update(state => {
      state.currentHistoryId = undefined
      return state
    })
  }
}

export const agentsStore = new AgentsStore()
