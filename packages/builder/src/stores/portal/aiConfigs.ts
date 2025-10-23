import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  CustomAIProviderConfig,
  CreateAIConfigRequest,
  UpdateAIConfigRequest,
} from "@budibase/types"

interface AIConfigState {
  customConfigs: CustomAIProviderConfig[]
}

export class AIConfigStore extends BudiStore<AIConfigState> {
  constructor() {
    super({
      customConfigs: [],
    })
  }

  init = async () => {
    await this.fetch()
  }

  fetch = async () => {
    const configs = await API.aiConfig.fetch()
    this.update(state => {
      state.customConfigs = configs
      return state
    })
    return configs
  }

  createConfig = async (
    config: CreateAIConfigRequest
  ): Promise<CustomAIProviderConfig> => {
    const created = await API.aiConfig.create(config)
    this.update(state => {
      state.customConfigs = [...state.customConfigs, created]
      return state
    })
    await this.fetch()
    return created
  }

  updateConfig = async (
    config: UpdateAIConfigRequest
  ): Promise<CustomAIProviderConfig> => {
    const updated = await API.aiConfig.update(config)
    this.update(state => {
      const idx = state.customConfigs.findIndex(c => c._id === updated._id)
      if (idx !== -1) {
        state.customConfigs[idx] = updated
      }
      return state
    })
    await this.fetch()
    return updated
  }

  deleteConfig = async (id: string) => {
    await API.aiConfig.delete(id)
    this.update(state => {
      state.customConfigs = state.customConfigs.filter(
        config => config._id !== id
      )
      return state
    })
  }
}

export const aiConfigsStore = new AIConfigStore()
