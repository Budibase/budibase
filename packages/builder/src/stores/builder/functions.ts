import { API } from "@/api"
import { duplicateName } from "@/helpers/duplicate"
import { getErrorMessage } from "@/helpers/errors"
import { BudiStore } from "@/stores/BudiStore"
import type {
  CreateFunctionRequest,
  FunctionQueryCapabilityInput,
  FunctionResponse,
  FunctionSummary,
  UpdateFunctionRequest,
} from "@budibase/types"
import { get } from "svelte/store"

interface FunctionStoreState {
  functions: FunctionSummary[]
  loading: boolean
  error?: string
}

const initialState: FunctionStoreState = {
  functions: [],
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

export class FunctionStore extends BudiStore<FunctionStoreState> {
  constructor() {
    super(initialState)
  }

  get list(): FunctionSummary[] {
    return get(this.store).functions
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
      const message = getErrorMessage(error) || "Unable to load Functions"
      this.update(state => ({ ...state, loading: false, error: message }))
    }
  }

  async fetchOne(functionId: string) {
    const response = await API.getFunction(functionId)
    this.upsert(response.function)
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
    return await this.save(draft, toUpdateRequest(draft, name))
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

  private upsert(fn: FunctionResponse) {
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
      }
    })
  }
}

export const functionStore = new FunctionStore()
