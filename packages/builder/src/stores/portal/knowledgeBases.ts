import { API } from "@/api"
import {
  CreateKnowledgeBaseRequest,
  KnowledgeBase,
  KnowledgeBaseFile,
  UpdateKnowledgeBaseRequest,
} from "@budibase/types"
import { DerivedBudiStore } from "../BudiStore"
import { derived, Writable } from "svelte/store"

interface KnowledgeBaseWithFiles extends KnowledgeBase {
  files: KnowledgeBaseFile[]
}

interface KnowledgeBaseState {
  list: KnowledgeBase[]
  loading: boolean
  loaded: boolean
  currentKnowledgeBaseId?: string
  filesByKnowledgeBaseId: Record<string, KnowledgeBaseFile[]>
}

interface DerivedKnowledgeBaseState {
  loading: boolean
  loaded: boolean
  currentKnowledgeBaseId?: string
  list: KnowledgeBaseWithFiles[]
  selectedKnowledgeBase: KnowledgeBaseWithFiles | undefined
}

type KnowledgeBaseFormDraft = Partial<
  Pick<KnowledgeBase, "_id" | "_rev" | "name" | "embeddingModel" | "vectorDb">
>

export class KnowledgeBaseStore extends DerivedBudiStore<
  KnowledgeBaseState,
  DerivedKnowledgeBaseState
> {
  private formDraft: KnowledgeBaseFormDraft | undefined

  constructor() {
    const makeDerivedStore = (store: Writable<KnowledgeBaseState>) => {
      return derived(store, $state => {
        const list = $state.list.map<KnowledgeBaseWithFiles>(knowledgeBase => ({
          ...knowledgeBase,
          files: $state.filesByKnowledgeBaseId[knowledgeBase._id || ""] || [],
        }))
        return {
          loading: $state.loading,
          loaded: $state.loaded,
          currentKnowledgeBaseId: $state.currentKnowledgeBaseId,
          list,
          selectedKnowledgeBase: $state.currentKnowledgeBaseId
            ? list.find(k => k._id === $state.currentKnowledgeBaseId)
            : undefined,
        }
      })
    }

    super(
      {
        list: [],
        loading: false,
        loaded: false,
        filesByKnowledgeBaseId: {},
      },
      makeDerivedStore
    )
  }

  private fetchKnowledgeBaseFiles = async (knowledgeBaseId: string) => {
    const { files } = await API.knowledgeBase.fetchFiles(knowledgeBaseId)
    return files
  }

  private fetchFilesForKnowledgeBases = async (
    knowledgeBases: KnowledgeBase[]
  ) => {
    const fileEntries = await Promise.all(
      knowledgeBases
        .map(knowledgeBase => knowledgeBase._id)
        .filter((id): id is string => !!id)
        .map(async knowledgeBaseId => {
          try {
            return [
              knowledgeBaseId,
              await this.fetchKnowledgeBaseFiles(knowledgeBaseId),
            ] as const
          } catch (error) {
            console.error(
              `Failed to fetch files for knowledge base ${knowledgeBaseId}`,
              error
            )
            return [knowledgeBaseId, []] as const
          }
        })
    )

    return Object.fromEntries(fileEntries)
  }

  fetch = async () => {
    this.update(state => {
      state.loading = true
      return state
    })

    try {
      const configs = await API.knowledgeBase.fetch()
      const filesByKnowledgeBaseId =
        await this.fetchFilesForKnowledgeBases(configs)
      this.update(state => {
        state.list = configs
        state.filesByKnowledgeBaseId = filesByKnowledgeBaseId
        state.loaded = true
        return state
      })
      return configs
    } finally {
      this.update(state => {
        state.loading = false
        return state
      })
    }
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
      return state
    })
  }

  fetchFiles = async (knowledgeBaseId?: string) => {
    if (!knowledgeBaseId) {
      return []
    }

    const files = await this.fetchKnowledgeBaseFiles(knowledgeBaseId)
    this.update(state => {
      state.filesByKnowledgeBaseId[knowledgeBaseId] = files
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
      return state
    })
  }
}

export const knowledgeBaseStore = new KnowledgeBaseStore()
