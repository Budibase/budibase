import { API } from "@/api"
import {
  CreateKnowledgeBaseRequest,
  KnowledgeBase,
  KnowledgeBaseFile,
  UpdateKnowledgeBaseRequest,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface KnowledgeBaseState {
  configs: KnowledgeBase[]
  currentKnowledgeBaseId?: string
  files: KnowledgeBaseFile[]
}

type KnowledgeBaseFormDraft = Partial<
  Pick<KnowledgeBase, "_id" | "_rev" | "name" | "embeddingModel" | "vectorDb">
>

export class KnowledgeBaseStore extends BudiStore<KnowledgeBaseState> {
  private formDraft: KnowledgeBaseFormDraft | undefined

  constructor() {
    super({
      configs: [],
      files: [],
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

  setFormDraft = (draft: KnowledgeBaseFormDraft) => {
    this.formDraft = draft
  }

  getFormDraft = (): KnowledgeBaseFormDraft | undefined => {
    return this.formDraft
  }

  clearFormDraft = () => {
    this.formDraft = undefined
  }

  selectKnowledgeBase = (knowledgeBaseId?: string) => {
    this.update(state => {
      state.currentKnowledgeBaseId = knowledgeBaseId
      if (!knowledgeBaseId) {
        state.files = []
      }
      return state
    })
  }

  fetchFiles = async (knowledgeBaseId?: string) => {
    if (!knowledgeBaseId) {
      this.update(state => {
        state.files = []
        return state
      })
      return []
    }
    const { files } = await API.knowledgeBase.fetchFiles(knowledgeBaseId)
    this.update(state => {
      if (state.currentKnowledgeBaseId === knowledgeBaseId) {
        state.files = files
      }
      return state
    })
    return files
  }

  uploadFile = async (knowledgeBaseId: string, file: File) => {
    const { file: uploaded } = await API.knowledgeBase.uploadFile(
      knowledgeBaseId,
      file
    )
    this.update(state => {
      if (state.currentKnowledgeBaseId === knowledgeBaseId) {
        state.files = [
          uploaded,
          ...state.files.filter(existing => existing._id !== uploaded._id),
        ]
      }
      return state
    })
    return uploaded
  }

  deleteFile = async (knowledgeBaseId: string, fileId: string) => {
    await API.knowledgeBase.deleteFile(knowledgeBaseId, fileId)
    this.update(state => {
      if (state.currentKnowledgeBaseId === knowledgeBaseId) {
        state.files = state.files.filter(file => file._id !== fileId)
      }
      return state
    })
  }
}

export const knowledgeBaseStore = new KnowledgeBaseStore()
