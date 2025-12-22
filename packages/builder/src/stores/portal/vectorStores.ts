import { API } from "@/api"
import {
  CreateVectorDbRequest,
  UpdateVectorDbRequest,
  VectorDb,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface VectorStoreConfigState {
  configs: VectorDb[]
}

export class VectorStoreStore extends BudiStore<VectorStoreConfigState> {
  constructor() {
    super({
      configs: [],
    })
  }

  fetchVectorStores = async () => {
    const configs = await API.vectorStore.fetch()
    this.update(state => {
      state.configs = configs
      return state
    })
    return configs
  }

  createVectorStore = async (config: CreateVectorDbRequest) => {
    const created = await API.vectorStore.create(config)
    await this.fetchVectorStores()
    return created
  }

  updateVectorStore = async (config: UpdateVectorDbRequest) => {
    const updated = await API.vectorStore.update(config)
    await this.fetchVectorStores()
    return updated
  }

  deleteVectorStore = async (id: string) => {
    await API.vectorStore.delete(id)
    await this.fetchVectorStores()
  }
}

export const vectorStoreStore = new VectorStoreStore()
