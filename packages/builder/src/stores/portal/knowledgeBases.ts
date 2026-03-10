import { API } from "@/api"
import {
  CreateKnowledgeBaseRequest,
  KnowledgeBase,
  KnowledgeBaseFile,
  UpdateKnowledgeBaseRequest,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"
import { derived } from "svelte/store"

export interface KnowledgeBaseWithFiles extends KnowledgeBase {
  files: KnowledgeBaseFile[]
}

interface KnowledgeBaseState {
  list: KnowledgeBase[]
  currentKnowledgeBaseId?: string
  files: KnowledgeBaseFile[]
  filesByKnowledgeBaseId: Record<string, KnowledgeBaseFile[]>
}

type KnowledgeBaseFormDraft = Partial<
  Pick<KnowledgeBase, "_id" | "_rev" | "name" | "embeddingModel" | "vectorDb">
>

export class KnowledgeBaseStore extends BudiStore<KnowledgeBaseState> {
  private formDraft: KnowledgeBaseFormDraft | undefined

  constructor() {
    super({
      list: [],
      files: [],
      filesByKnowledgeBaseId: {},
    })
  }

  fetch = async () => {
    const configs = await API.knowledgeBase.fetch()
    this.update(state => {
      state.list = configs
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
    this.update(state => {
      delete state.filesByKnowledgeBaseId[id]
      return state
    })
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
      state.filesByKnowledgeBaseId[knowledgeBaseId] = files
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
      state.filesByKnowledgeBaseId[knowledgeBaseId] = [
        uploaded,
        ...(state.filesByKnowledgeBaseId[knowledgeBaseId] || []).filter(
          existing => existing._id !== uploaded._id
        ),
      ]
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
      state.filesByKnowledgeBaseId[knowledgeBaseId] = (
        state.filesByKnowledgeBaseId[knowledgeBaseId] || []
      ).filter(file => file._id !== fileId)
      if (state.currentKnowledgeBaseId === knowledgeBaseId) {
        state.files = state.files.filter(file => file._id !== fileId)
      }
      return state
    })
  }
}

export const knowledgeBaseStore = new KnowledgeBaseStore()
export const knowledgeBasesWithFiles = derived(knowledgeBaseStore, state =>
  state.list.map(
    knowledgeBase =>
      ({
        ...knowledgeBase,
        files: state.filesByKnowledgeBaseId[knowledgeBase._id || ""] || [],
      }) satisfies KnowledgeBaseWithFiles
  )
)
