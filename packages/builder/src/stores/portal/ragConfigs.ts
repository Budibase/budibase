import { API } from "@/api"
import {
  CreateRagConfigRequest,
  RagConfig,
  UpdateRagConfigRequest,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface RagConfigState {
  configs: RagConfig[]
}

export class RagConfigStore extends BudiStore<RagConfigState> {
  constructor() {
    super({
      configs: [],
    })
  }

  fetch = async () => {
    const configs = await API.ragConfig.fetch()
    this.update(state => {
      state.configs = configs
      return state
    })
    return configs
  }

  create = async (config: CreateRagConfigRequest) => {
    const created = await API.ragConfig.create(config)
    await this.fetch()
    return created
  }

  edit = async (config: UpdateRagConfigRequest) => {
    const updated = await API.ragConfig.update(config)
    await this.fetch()
    return updated
  }

  delete = async (id: string) => {
    await API.ragConfig.delete(id)
    await this.fetch()
  }
}

export const ragConfigStore = new RagConfigStore()
