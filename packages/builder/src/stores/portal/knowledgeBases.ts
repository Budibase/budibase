import { API } from "@/api"
import {
  CreateKnowledgeBaseRequest,
  KnowledgeBase,
  UpdateKnowledgeBaseRequest,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface KnowledgeBaseState {
  configs: KnowledgeBase[]
}

export class KnowledgeBaseStore extends BudiStore<KnowledgeBaseState> {
  constructor() {
    super({
      configs: [],
    })
  }

  fetch = async () => {
    const configs = await API.knowledgeBase.fetch()
    this.update(state => {
      state.configs = configs
      return state
    })
    return configs
  }

  create = async (config: CreateKnowledgeBaseRequest) => {
    const created = await API.knowledgeBase.create(config)
    await this.fetch()
    return created
  }

  edit = async (config: UpdateKnowledgeBaseRequest) => {
    const updated = await API.knowledgeBase.update(config)
    await this.fetch()
    return updated
  }

  delete = async (id: string) => {
    await API.knowledgeBase.delete(id)
    await this.fetch()
  }
}

export const knowledgeBaseStore = new KnowledgeBaseStore()
