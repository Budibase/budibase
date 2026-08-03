import { API, productionAPI } from "@/api"
import { duplicateName } from "@/helpers/duplicate"
import { getErrorMessage } from "@/helpers/errors"
import { BudiStore } from "@/stores/BudiStore"
import type {
  CreateFunctionRequest,
  FunctionQueryCapabilityInput,
  FunctionQueryCatalogEntry,
  FunctionResponse,
  UpdateFunctionRequest,
} from "@budibase/types"
import { get } from "svelte/store"

export type FunctionDeploymentState =
  | "not_deployed"
  | "published"
  | "unpublished_changes"

export interface UIFunction extends FunctionResponse {
  deploymentState: FunctionDeploymentState
}

interface FunctionStoreState {
  functions: FunctionResponse[]
  publishedFunctions: FunctionResponse[]
  queryCatalog: FunctionQueryCatalogEntry[]
  loading: boolean
  catalogLoading: boolean
  error?: string
  catalogError?: string
}

const initialState: FunctionStoreState = {
  functions: [],
  publishedFunctions: [],
  queryCatalog: [],
  loading: false,
  catalogLoading: false,
}

const toCapabilityInputs = (
  fn: FunctionResponse
): FunctionQueryCapabilityInput[] =>
  fn.capabilities.map(capability => ({
    queryId: capability.queryId,
    datasourceAlias: capability.datasourceAlias,
    queryAlias: capability.queryAlias,
  }))

const toUpdateRequest = (
  fn: FunctionResponse,
  name = fn.name
): UpdateFunctionRequest => ({
  _rev: fn._rev!,
  name,
  source: fn.source,
  capabilities: toCapabilityInputs(fn),
})

const getDeploymentState = (
  fn: FunctionResponse,
  publishedFunctions: FunctionResponse[]
): FunctionDeploymentState => {
  const published = publishedFunctions.find(
    candidate => candidate._id === fn._id
  )
  if (!published) {
    return "not_deployed"
  }
  return published.updatedAt === fn.updatedAt
    ? "published"
    : "unpublished_changes"
}

export class FunctionStore extends BudiStore<FunctionStoreState> {
  constructor() {
    super(initialState)
  }

  get list(): UIFunction[] {
    return this.getList(get(this.store))
  }

  getList(state: FunctionStoreState): UIFunction[] {
    return state.functions.map(fn => ({
      ...fn,
      deploymentState: getDeploymentState(fn, state.publishedFunctions),
    }))
  }

  async fetch() {
    this.update(state => ({ ...state, loading: true, error: undefined }))
    try {
      const [development, published] = await Promise.all([
        API.getFunctions(),
        productionAPI.getFunctions(),
      ])
      this.update(state => ({
        ...state,
        functions: development.functions,
        publishedFunctions: published.functions,
        loading: false,
      }))
    } catch (error) {
      const message = getErrorMessage(error) || "Unable to load Functions"
      this.update(state => ({ ...state, loading: false, error: message }))
    }
  }

  async fetchOne(functionId: string) {
    const response = await API.getFunction(functionId)
    this.upsert(response.function)
    return response.function
  }

  async fetchQueryCatalog() {
    this.update(state => ({
      ...state,
      catalogLoading: true,
      catalogError: undefined,
    }))
    try {
      const response = await API.getFunctionQueryCatalog()
      this.update(state => ({
        ...state,
        queryCatalog: response.queries,
        catalogLoading: false,
      }))
    } catch (error) {
      const message = getErrorMessage(error) || "Unable to load saved queries"
      this.update(state => ({
        ...state,
        catalogLoading: false,
        catalogError: message,
      }))
    }
  }

  async create(draft: CreateFunctionRequest) {
    const response = await API.createFunction(draft)
    this.upsert(response.function)
    return response.function
  }

  async save(fn: FunctionResponse, request: UpdateFunctionRequest) {
    const response = await API.updateFunction(fn._id, request)
    this.upsert(response.function)
    return response.function
  }

  async rename(fn: FunctionResponse, name: string) {
    return await this.save(fn, toUpdateRequest(fn, name))
  }

  async duplicate(fn: FunctionResponse) {
    const existingNames = get(this.store).functions.map(item => item.name)
    return await this.create({
      name: duplicateName(fn.name, existingNames),
      source: fn.source,
      capabilities: toCapabilityInputs(fn),
    })
  }

  async delete(fn: FunctionResponse) {
    if (!fn._rev) {
      throw new Error("Function revision is missing")
    }
    await API.deleteFunction(fn._id, fn._rev)
    this.update(state => ({
      ...state,
      functions: state.functions.filter(item => item._id !== fn._id),
    }))
  }

  reset() {
    this.set(initialState)
  }

  private upsert(fn: FunctionResponse) {
    this.update(state => {
      const existingIndex = state.functions.findIndex(
        item => item._id === fn._id
      )
      const functions = [...state.functions]
      if (existingIndex === -1) {
        functions.push(fn)
      } else {
        functions[existingIndex] = fn
      }
      functions.sort((a, b) => a.name.localeCompare(b.name))
      return { ...state, functions }
    })
  }
}

export const functionStore = new FunctionStore()
