import type {
  FunctionBuildDiagnostic,
  FunctionDocument,
  FunctionRunSummary,
} from "../../../documents"
import type { SourceName } from "../../../sdk"

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

export interface CompileFunctionRequest extends FunctionDraftRequest {
  functionId?: string
}

export interface CompileFunctionResponse {
  diagnostics: FunctionBuildDiagnostic[]
}

export interface BuildFunctionRequest {
  _rev: string
}

export interface BuildFunctionResponse {
  function: FunctionResponse
}

export type FunctionQueryKind = "data" | "api"

export interface FunctionQueryCatalogParameter {
  name: string
}

export interface FunctionQueryCatalogEntry {
  queryId: string
  queryName: string
  datasourceId: string
  datasourceName: string
  source: SourceName
  kind: FunctionQueryKind
  parameters: FunctionQueryCatalogParameter[]
}

export interface FetchFunctionQueryCatalogResponse {
  queries: FunctionQueryCatalogEntry[]
}

export interface FetchFunctionRunsResponse {
  runs: FunctionRunSummary[]
  hasMore: boolean
  nextBookmark?: string
}

export interface FetchFunctionRunResponse {
  run: FunctionRunSummary
}
