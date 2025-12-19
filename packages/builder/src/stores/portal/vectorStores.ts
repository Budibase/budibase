import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  VectorStore,
  CreateVectorStoreRequest,
  UpdateVectorStoreRequest,
} from "@budibase/types"

interface VectorStoreConfigState {
  configs: VectorStore[]
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

  createVectorStore = async (config: CreateVectorStoreRequest) => {
    const created = await API.vectorStore.create(config)
    await this.fetchVectorStores()
    return created
  }

  updateVectorStore = async (config: UpdateVectorStoreRequest) => {
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
