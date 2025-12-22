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

  fetchVectorDbs = async () => {
    const configs = await API.vectorDb.fetch()
    this.update(state => {
      state.configs = configs
      return state
    })
    return configs
  }

  createVectorDb = async (config: CreateVectorDbRequest) => {
    const created = await API.vectorDb.create(config)
    await this.fetchVectorDbs()
    return created
  }

  updateVectorDb = async (config: UpdateVectorDbRequest) => {
    const updated = await API.vectorDb.update(config)
    await this.fetchVectorDbs()
    return updated
  }

  deleteVectorDb = async (id: string) => {
    await API.vectorDb.delete(id)
    await this.fetchVectorDbs()
  }
}

export const vectorDbStore = new VectorDbStore()
