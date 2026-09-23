import { API } from "@/api"
import { duplicateName } from "@/helpers/duplicate"
import { getErrorMessage } from "@/helpers/errors"
import { BudiStore } from "@/stores/BudiStore"
import type {
  CreateFunctionRequest,
  FunctionQueryCapabilityInput,
  FunctionResponse,
  FunctionSummary,
  PublishStatusResource,
  UpdateFunctionRequest,
} from "@budibase/types"
import { get } from "svelte/store"

export type FunctionDeploymentState =
  | "not_deployed"
  | "published"
  | "unpublished_changes"

export interface UIFunction extends FunctionSummary {
  deploymentState: FunctionDeploymentState
}

interface FunctionStoreState {
  functions: FunctionSummary[]
  deployment: Record<string, PublishStatusResource>
  loading: boolean
  error?: string
}

const initialState: FunctionStoreState = {
  functions: [],
  deployment: {},
  loading: false,
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
  fn: FunctionSummary,
  deployment: Record<string, PublishStatusResource>
): FunctionDeploymentState => {
  const published = deployment[fn._id]
  if (!published?.published) {
    return "not_deployed"
  }
  return !published.unpublishedChanges ? "published" : "unpublished_changes"
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
      deploymentState: getDeploymentState(fn, state.deployment),
    }))
  }

  async fetch() {
    this.update(state => ({ ...state, loading: true, error: undefined }))
    try {
      const [development, published] = await Promise.all([
        API.getFunctions(),
        API.deployment.getPublishStatus(),
      ])
      this.update(state => ({
        ...state,
        functions: development.functions,
        deployment: published.functions,
        loading: false,
      }))
    } catch (error) {
      const message = getErrorMessage(error) || "Unable to load Functions"
      this.update(state => ({ ...state, loading: false, error: message }))
    }
  }

  async fetchOne(functionId: string) {
    const response = await API.getFunction(functionId)
    this.upsert(response.function, false)
    return response.function
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

  async rename(fn: FunctionSummary, name: string) {
    const draft = await this.fetchOne(fn._id)
    return await this.save(draft, {
      ...toUpdateRequest(draft, name),
      _rev: fn._rev!,
    })
  }

  async duplicate(summary: FunctionSummary) {
    const fn = await this.fetchOne(summary._id)
    const existingNames = get(this.store).functions.map(item => item.name)
    return await this.create({
      name: duplicateName(fn.name, existingNames),
      source: fn.source,
      capabilities: toCapabilityInputs(fn),
    })
  }

  async delete(fn: FunctionSummary) {
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

  private upsert(fn: FunctionResponse, changed = true) {
    this.update(state => {
      const existingIndex = state.functions.findIndex(
        item => item._id === fn._id
      )
      const functions = [...state.functions]
      if (existingIndex === -1) {
        functions.push({ ...fn, linkedQueryCount: fn.capabilities.length })
      } else {
        functions[existingIndex] = {
          ...fn,
          linkedQueryCount: fn.capabilities.length,
        }
      }
      functions.sort((a, b) => a.name.localeCompare(b.name))
      return {
        ...state,
        functions,
        deployment:
          changed && state.deployment[fn._id]
            ? {
                ...state.deployment,
                [fn._id]: {
                  ...state.deployment[fn._id],
                  unpublishedChanges: true,
                },
              }
            : state.deployment,
      }
    })
  }
}

export const functionStore = new FunctionStore()
