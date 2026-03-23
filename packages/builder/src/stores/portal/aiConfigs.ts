import { API } from "@/api"
import {
  AIConfigResponse,
  AIConfigType,
  CreateAIConfigRequest,
  LLMProvider,
  UpdateAIConfigRequest,
} from "@budibase/types"
import { derived, Writable } from "svelte/store"
import { DerivedBudiStore } from "../BudiStore"

interface AIConfigState {
  customConfigs: AIConfigResponse[]
  providers?: LLMProvider[]
}

interface DerivedAIConfigState extends AIConfigState {
  customConfigsPerType: Record<AIConfigType, AIConfigResponse[]>
}

export class AIConfigStore extends DerivedBudiStore<
  AIConfigState,
  DerivedAIConfigState
> {
  constructor() {
    const makeDerivedStore = (store: Writable<AIConfigState>) => {
      return derived(store, $state => ({
        ...$state,
        customConfigsPerType: $state.customConfigs.reduce<
          DerivedAIConfigState["customConfigsPerType"]
        >(
          (acc, config) => {
            acc[config.configType].push(config)
            return acc
          },
          {
            [AIConfigType.COMPLETIONS]: [],
            [AIConfigType.EMBEDDINGS]: [],
          }
        ),
      }))
    }

    super(
      {
        customConfigs: [],
        providers: undefined,
      },
      makeDerivedStore
    )
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

  fetchProviders = async () => {
    const providers = await API.aiConfig.providers()
    this.update(state => {
      state.providers = providers
      return state
    })
    return providers
  }

  createConfig = async (
    config: CreateAIConfigRequest
  ): Promise<AIConfigResponse> => {
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
  ): Promise<AIConfigResponse> => {
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
