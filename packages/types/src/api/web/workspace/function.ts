import type {
  FunctionBuildDiagnostic,
  FunctionDocument,
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

export type FunctionSummary = Pick<
  FunctionResponse,
  "_id" | "_rev" | "name" | "appId" | "createdAt" | "updatedAt" | "readiness"
>

export interface FetchFunctionsResponse {
  functions: FunctionSummary[]
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
  function: FunctionSummary
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
