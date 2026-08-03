import { API } from "@/api"
import { duplicateName } from "@/helpers/duplicate"
import { getErrorMessage } from "@/helpers/errors"
import type { FunctionAvailability } from "@/pages/builder/workspace/[application]/automation/functions/availability"
import { BudiStore } from "@/stores/BudiStore"
import { workspaceDeploymentStore } from "@/stores/builder/workspaceDeployment"
import type {
  CompileFunctionRequest,
  CreateFunctionRequest,
  FunctionQueryCapabilityInput,
  FunctionQueryCatalogEntry,
  FunctionResponse,
  FunctionRunnerStatus,
  PublishStatusResource,
  UpdateFunctionRequest,
} from "@budibase/types"
import { get } from "svelte/store"

export type FunctionDeploymentState =
  | "not_published"
  | "published"
  | "unpublished_changes"

export interface UIFunction extends FunctionResponse {
  deploymentState: FunctionDeploymentState
}

interface FunctionStoreState {
  functions: FunctionResponse[]
  queryCatalog: FunctionQueryCatalogEntry[]
  loading: boolean
  catalogLoading: boolean
  availability: FunctionAvailability
  runnerStatus?: FunctionRunnerStatus
  runnerStatusLoading: boolean
  error?: string
  catalogError?: string
  runnerStatusError?: string
}

const initialState: FunctionStoreState = {
  functions: [],
  queryCatalog: [],
  loading: false,
  catalogLoading: false,
  availability: "unknown",
  runnerStatusLoading: false,
}

const isNotFoundError = (error: object) =>
  "status" in error && error.status === 404

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
  deployment?: PublishStatusResource
): FunctionDeploymentState => {
  if (!deployment?.published) {
    return "not_published"
  }
  return deployment.unpublishedChanges ? "unpublished_changes" : "published"
}

export class FunctionStore extends BudiStore<FunctionStoreState> {
  private statusRequest?: Promise<boolean>

  constructor() {
    super(initialState)
  }

  get list(): UIFunction[] {
    return this.getList(
      get(this.store),
      get(workspaceDeploymentStore).functions || {}
    )
  }

  getList(
    state: FunctionStoreState,
    deployments: Record<string, PublishStatusResource> = {}
  ): UIFunction[] {
    return state.functions.map(fn => ({
      ...fn,
      deploymentState: getDeploymentState(deployments[fn._id]),
    }))
  }

  async fetchStatus(options: { force?: boolean } = {}) {
    const current = get(this.store)
    if (!options.force && current.availability === "available") {
      return true
    }
    if (this.statusRequest) {
      return await this.statusRequest
    }

    const request = this.loadStatus()
    this.statusRequest = request
    try {
      return await request
    } finally {
      if (this.statusRequest === request) {
        this.statusRequest = undefined
      }
    }
  }

  private async loadStatus() {
    this.update(state => ({
      ...state,
      availability:
        state.availability === "available" ? "available" : "checking",
      runnerStatusLoading: true,
      runnerStatusError: undefined,
    }))
    try {
      const response = await API.getFunctionStatus()
      this.update(state => ({
        ...state,
        availability: "available",
        runnerStatus: response.runner,
        runnerStatusLoading: false,
      }))
      return true
    } catch (error) {
      const isUnavailable =
        !!error && typeof error === "object" && isNotFoundError(error)
      const wasAvailable = get(this.store).availability === "available"
      let availability: FunctionAvailability = "error"
      if (isUnavailable) {
        availability = "unavailable"
      } else if (wasAvailable) {
        availability = "available"
      }
      this.update(state => ({
        ...state,
        availability,
        runnerStatus: undefined,
        runnerStatusLoading: false,
        runnerStatusError: isUnavailable
          ? undefined
          : getErrorMessage(error) || "Unable to check Function runner status",
      }))
      return false
    }
  }

  async fetch() {
    this.update(state => ({ ...state, loading: true, error: undefined }))
    try {
      const development = await API.getFunctions()
      this.update(state => ({
        ...state,
        functions: development.functions,
        loading: false,
      }))
    } catch (error) {
      if (error && typeof error === "object" && isNotFoundError(error)) {
        this.update(state => ({
          ...state,
          availability: "unavailable",
          functions: [],
          loading: false,
          error: undefined,
        }))
        return
      }
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

  async compile(request: CompileFunctionRequest) {
    return await API.compileFunction(request)
  }

  async build(fn: FunctionResponse) {
    if (!fn._rev) {
      throw new Error("Function revision is missing")
    }
    const response = await API.buildFunction(fn._id, fn._rev)
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
