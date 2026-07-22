import type { FunctionDocument } from "../../../documents"

export type FunctionReadiness = "ready" | "build_required" | "build_failed"

export interface FunctionQueryCapabilityInput {
  queryId: string
  datasourceAlias: string
  queryAlias: string
}

export interface FunctionDraftRequest {
  name: string
  source: string
  capabilities: FunctionQueryCapabilityInput[]
}

export interface CreateFunctionRequest extends FunctionDraftRequest {}

export interface UpdateFunctionRequest extends FunctionDraftRequest {
  _rev: string
}

export interface FunctionResponse extends FunctionDocument {
  readiness: FunctionReadiness
}

export interface FetchFunctionsResponse {
  functions: FunctionResponse[]
}

export interface CreateFunctionResponse {
  function: FunctionResponse
}

export interface FetchFunctionResponse {
  function: FunctionResponse
}

export interface UpdateFunctionResponse {
  function: FunctionResponse
}
