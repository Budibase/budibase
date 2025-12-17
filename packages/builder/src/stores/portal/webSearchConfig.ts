import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  WebSearchConfigResponse,
  WebSearchProvider,
  SaveWebSearchConfigRequest,
} from "@budibase/types"

interface WebSearchConfigState {
  config: WebSearchConfigResponse | null
  loaded: boolean
}

export class WebSearchConfigStore extends BudiStore<WebSearchConfigState> {
  constructor() {
    super({
      config: null,
      loaded: false,
    })
  }

  fetch = async () => {
    const response = await API.webSearchConfig.getWebSearchConfig()
    this.update(state => ({
      ...state,
      config: response.config,
      loaded: true,
    }))
    return response.config
  }

  save = async (
    provider: WebSearchProvider,
    apiKey: string,
    enabled: boolean
  ) => {
    const request: SaveWebSearchConfigRequest = {
      provider,
      apiKey,
      enabled,
    }
    const response = await API.webSearchConfig.saveWebSearchConfig(request)
    this.update(state => ({
      ...state,
      config: response.config,
    }))
    return response.config
  }

  remove = async () => {
    await API.webSearchConfig.deleteWebSearchConfig()
    this.update(state => ({
      ...state,
      config: null,
    }))
  }
}

export const webSearchConfigStore = new WebSearchConfigStore()
