import { API } from "@/api"
import {
  CreateVectorDbRequest,
  UpdateVectorDbRequest,
  VectorDb,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface VectorDbConfigState {
  configs: VectorDb[]
}

export class VectorDbStore extends BudiStore<VectorDbConfigState> {
  constructor() {
    super({
      configs: [],
    })
  }

  fetch = async () => {
    const configs = await API.vectorDb.fetch()
    this.update(state => {
      state.configs = configs
      return state
    })
    return configs
  }

  create = async (config: CreateVectorDbRequest) => {
    const created = await API.vectorDb.create(config)
    await this.fetch()
    return created
  }

  edit = async (config: UpdateVectorDbRequest) => {
    const updated = await API.vectorDb.update(config)
    await this.fetch()
    this.update
    return updated
  }

  delete = async (id: string) => {
    await API.vectorDb.delete(id)
    await this.fetch()
  }
}

export const vectorDbStore = new VectorDbStore()
