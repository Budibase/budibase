import { createHash } from "crypto"
import {
  context,
  db as dbCore,
  docIds,
  HTTPError,
} from "@budibase/backend-core"
import {
  DEFAULT_FUNCTION_LIMITS,
  DocumentType,
  type Automation,
  type FunctionArtifact,
  type FunctionBuildDiagnostic,
  type FunctionDocument,
  type FunctionQueryCapability,
  type FunctionQueryCapabilityInput,
  type FunctionResponse,
  type FunctionQueryCatalogEntry,
  type FunctionSummary,
} from "@budibase/types"
import { compileFunction } from "./compiler"
import {
  generateFunctionDeclarations,
  hashFunctionDeclarations,
} from "./declarations"
import { buildCapabilities, getQueryCatalog } from "./queryCatalog"

export {
  generateFunctionDeclarations,
  hashFunctionDeclarations,
} from "./declarations"
export { getQueryCatalog, resolveSavedQuery } from "./queryCatalog"
export {
  clearOldHistory,
  createRunSummary,
  finalizeRunSummary,
  getRunHistory,
  listRunHistory,
  reconcileRunning,
} from "./history"

interface FunctionDraftInput {
  name: string
  source: string
  capabilities: FunctionQueryCapabilityInput[]
}

interface FunctionUpdateInput extends FunctionDraftInput {
  _id: string
  _rev: string
}

interface FunctionCompileInput extends FunctionDraftInput {
  functionId?: string
}

const EXECUTE_FUNCTION_STEP_ID = "EXECUTE_FUNCTION"
const MAX_FUNCTION_NAME_LENGTH = 255
const MAX_ALIAS_LENGTH = 128
const ALIAS_PATTERN = /^(?![\s\S]*[\r\n\u2028\u2029])[A-Za-z_$][A-Za-z0-9_$]*$/

const getDb = () => context.getWorkspaceDB()

const hash = (value: string) => createHash("sha256").update(value).digest("hex")

export const getFunctionSourceHash = (source: string) => hash(source)

const validateAlias = (alias: string, field: string) => {
  if (!alias || alias.length > MAX_ALIAS_LENGTH || !ALIAS_PATTERN.test(alias)) {
    throw new HTTPError(`${field} must be a valid identifier.`, 400)
  }
}

const validateDraft = (draft: FunctionDraftInput) => {
  if (!draft.name.trim()) {
    throw new HTTPError("Function name is required.", 400)
  }
  if (draft.name.length > MAX_FUNCTION_NAME_LENGTH) {
    throw new HTTPError(
      `Function name cannot exceed ${MAX_FUNCTION_NAME_LENGTH} characters.`,
      400
    )
  }
  if (
    Buffer.byteLength(draft.source, "utf8") >
    DEFAULT_FUNCTION_LIMITS.compile.maxSourceBytes
  ) {
    throw new HTTPError("Function source exceeds the maximum size.", 400)
  }

  const queryIds = new Set<string>()
  const aliases = new Set<string>()
  for (const capability of draft.capabilities) {
    validateAlias(capability.datasourceAlias, "Datasource alias")
    validateAlias(capability.queryAlias, "Query alias")

    if (queryIds.has(capability.queryId)) {
      throw new HTTPError("A query can only be linked once.", 400)
    }
    queryIds.add(capability.queryId)

    const alias = `${capability.datasourceAlias}.${capability.queryAlias}`
    if (aliases.has(alias)) {
      throw new HTTPError(`Duplicate Function query alias '${alias}'.`, 400)
    }
    aliases.add(alias)
  }
}

export const getFunctionDeclarations = async (fn: FunctionDocument) => {
  const capabilities = await buildCapabilities(
    fn.capabilities.map(capability => ({
      queryId: capability.queryId,
      datasourceAlias: capability.datasourceAlias,
      queryAlias: capability.queryAlias,
    })),
    fn.capabilities
  )
  const declarations = generateFunctionDeclarations(capabilities)
  return {
    capabilities,
    declarations,
    declarationsHash: hashFunctionDeclarations(declarations),
  }
}

type FunctionQueryCatalog = ReadonlyMap<string, FunctionQueryCatalogEntry>

const getFunctionDeclarationsFromCatalog = (
  fn: FunctionDocument,
  catalog: FunctionQueryCatalog
) => {
  const capabilities = fn.capabilities.map(capability => {
    const query = catalog.get(capability.queryId)
    if (!query) {
      throw new HTTPError(`Query '${capability.queryId}' not found.`, 404)
    }
    return {
      ...capability,
      parameterNames: query.parameters.map(parameter => parameter.name),
    }
  })
  const declarations = generateFunctionDeclarations(capabilities)
  return {
    capabilities,
    declarations,
    declarationsHash: hashFunctionDeclarations(declarations),
  }
}

const getFunctionDeclarationsForReadiness = async (
  fn: FunctionDocument,
  catalog?: FunctionQueryCatalog
) => {
  if (catalog) {
    return getFunctionDeclarationsFromCatalog(fn, catalog)
  }
  return getFunctionDeclarations(fn)
}

const getPersistedFunctionDeclarations = (fn: FunctionDocument) => {
  const declarations = generateFunctionDeclarations(fn.capabilities)
  return {
    capabilities: fn.capabilities,
    declarations,
    declarationsHash: hashFunctionDeclarations(declarations),
  }
}

const hasMatchingCapabilityIds = (
  artifactCapabilityIds: string[],
  capabilities: FunctionQueryCapability[]
) => {
  const expectedCapabilityIds = capabilities
    .map(capability => capability.capabilityId)
    .sort()
  const actualCapabilityIds = [...artifactCapabilityIds].sort()
  return (
    actualCapabilityIds.length === expectedCapabilityIds.length &&
    actualCapabilityIds.every(
      (capabilityId, index) => capabilityId === expectedCapabilityIds[index]
    )
  )
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0

const hasValidCapabilityIds = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every(capabilityId => isNonEmptyString(capabilityId))

const isArtifactCurrent = ({
  artifact,
  capabilities,
  declarationsHash,
  sourceHash,
}: {
  artifact?: FunctionArtifact
  capabilities: FunctionQueryCapability[]
  declarationsHash: string
  sourceHash: string
}) => {
  if (!artifact) {
    return false
  }

  if (!isNonEmptyString(artifact.compiledJavaScript)) {
    return false
  }
  if (!isNonEmptyString(artifact.compiledAt)) {
    return false
  }
  if (!hasValidCapabilityIds(artifact.capabilityIds)) {
    return false
  }
  if (!hasMatchingCapabilityIds(artifact.capabilityIds, capabilities)) {
    return false
  }
  return (
    artifact.sourceHash === sourceHash &&
    artifact.declarationsHash === declarationsHash
  )
}

export const getFunctionDeclarationsHash = async (fn: FunctionDocument) =>
  (await getFunctionDeclarations(fn)).declarationsHash

export type FunctionPublishReadiness =
  | "ready"
  | "build_required"
  | "build_failed"
  | "declarations_changed"
  | "missing_query"

export const getFunctionPublishReadiness = async (
  fn: FunctionDocument,
  catalog?: FunctionQueryCatalog
): Promise<FunctionPublishReadiness> => {
  const sourceHash = getFunctionSourceHash(fn.source)
  let declarationResult: Awaited<
    ReturnType<typeof getFunctionDeclarationsForReadiness>
  >
  try {
    declarationResult = await getFunctionDeclarationsForReadiness(fn, catalog)
  } catch (error) {
    if (error instanceof HTTPError) {
      if (
        fn.lastBuild?.status === "failed" &&
        fn.lastBuild.sourceHash === sourceHash
      ) {
        return "build_failed"
      }
      return "missing_query"
    }
    throw error
  }
  const { capabilities, declarationsHash } = declarationResult

  if (fn.lastBuild?.sourceHash !== sourceHash) {
    return "build_required"
  }
  if (fn.lastBuild.declarationsHash !== declarationsHash) {
    return "declarations_changed"
  }
  if (fn.lastBuild.status === "failed") {
    return "build_failed"
  }
  if (
    isArtifactCurrent({
      artifact: fn.artifact,
      capabilities,
      declarationsHash,
      sourceHash,
    })
  ) {
    return "ready"
  }
  return "build_required"
}

export const getFunctionReadiness = async (
  fn: FunctionDocument,
  catalog?: FunctionQueryCatalog
) => {
  const readiness = await getFunctionPublishReadiness(fn, catalog)
  return readiness === "declarations_changed" || readiness === "missing_query"
    ? "build_required"
    : readiness
}

const getCompileDiagnostics = (
  diagnostics: FunctionBuildDiagnostic[],
  hasOutput: boolean
) => {
  if (hasOutput || diagnostics.length) {
    return diagnostics
  }
  return [
    {
      code: "FUNCTION_COMPILE_ERROR",
      message: "The Function compiler did not produce an artifact.",
    },
  ]
}

export const compile = async (draft: FunctionCompileInput) => {
  validateDraft(draft)
  const existing = draft.functionId ? await get(draft.functionId) : undefined
  if (draft.functionId && !existing) {
    throw new HTTPError(
      `Function with id '${draft.functionId}' not found.`,
      404
    )
  }
  const capabilities = await buildCapabilities(
    draft.capabilities,
    existing?.capabilities
  )
  const declarations = generateFunctionDeclarations(capabilities)
  const result = await compileFunction({
    source: draft.source,
    declarations,
    capabilities,
  })
  return getCompileDiagnostics(result.diagnostics, !!result.output)
}

const assertRevision = (fn: FunctionDocument, revision: string) => {
  if (fn._rev !== revision) {
    throw new HTTPError("Function revision does not match.", 409)
  }
}

export const build = async (id: string, revision: string) => {
  const fn = await get(id)
  if (!fn) {
    throw new HTTPError(`Function with id '${id}' not found.`, 404)
  }
  assertRevision(fn, revision)

  const sourceHash = getFunctionSourceHash(fn.source)
  let declarationResult
  let declarationError: HTTPError | undefined
  try {
    declarationResult = await getFunctionDeclarations(fn)
  } catch (error) {
    if (!(error instanceof HTTPError)) {
      throw error
    }
    declarationError = error
    declarationResult = getPersistedFunctionDeclarations(fn)
  }

  const result = declarationError
    ? undefined
    : await compileFunction({
        source: fn.source,
        declarations: declarationResult.declarations,
        capabilities: declarationResult.capabilities,
      })
  const diagnostics = declarationError
    ? [
        {
          code: "FUNCTION_DECLARATION_ERROR",
          message: declarationError.message,
        },
      ]
    : getCompileDiagnostics(result?.diagnostics || [], !!result?.output)

  const current = await get(id)
  if (!current) {
    throw new HTTPError(`Function with id '${id}' not found.`, 404)
  }
  assertRevision(current, revision)
  let capabilities = current.capabilities
  if (!declarationError) {
    const currentDeclarations = await getFunctionDeclarations(current)
    if (
      currentDeclarations.declarationsHash !==
      declarationResult.declarationsHash
    ) {
      throw new HTTPError(
        "Function query declarations changed during compilation.",
        409
      )
    }
    capabilities = currentDeclarations.capabilities
  }

  const attemptedAt = new Date().toISOString()
  const successfulOutput = diagnostics.length ? undefined : result?.output
  const lastBuild = {
    status: successfulOutput ? "success" : "failed",
    sourceHash,
    declarationsHash: declarationResult.declarationsHash,
    attemptedAt,
    ...(diagnostics.length ? { diagnostics } : {}),
  } as const
  const artifact = successfulOutput
    ? {
        compiledJavaScript: successfulOutput.compiledJavaScript,
        capabilityIds: capabilities.map(capability => capability.capabilityId),
        sourceMap: successfulOutput.sourceMap,
        sourceHash,
        declarationsHash: declarationResult.declarationsHash,
        compiledAt: attemptedAt,
      }
    : current.artifact
  try {
    const response = await getDb().put(
      {
        ...current,
        _rev: revision,
        capabilities,
        artifact,
        lastBuild,
      },
      { returnDoc: true }
    )
    return response.doc
  } catch (error) {
    if (dbCore.isDocumentConflictError(error)) {
      throw new HTTPError("Function revision does not match.", 409)
    }
    throw error
  }
}

export const toFunctionResponse = async (
  fn: FunctionDocument
): Promise<FunctionResponse> => ({
  ...fn,
  readiness: await getFunctionReadiness(fn),
})

export const toFunctionSummary = async (
  fn: FunctionDocument,
  catalog?: FunctionQueryCatalog
): Promise<FunctionSummary> => ({
  _id: fn._id,
  _rev: fn._rev,
  name: fn.name,
  appId: fn.appId,
  createdAt: fn.createdAt,
  updatedAt: fn.updatedAt,
  readiness: await getFunctionReadiness(fn, catalog),
})

export const toFunctionSummaries = async (fns: FunctionDocument[]) => {
  if (!fns.length) {
    return []
  }
  const catalog = await getQueryCatalog()
  const entries = new Map(catalog.map(entry => [entry.queryId, entry]))
  return await Promise.all(fns.map(fn => toFunctionSummary(fn, entries)))
}

export const fetch = async (): Promise<FunctionDocument[]> => {
  const result = await getDb().allDocs<FunctionDocument>(
    docIds.getFunctionParams(null, { include_docs: true })
  )
  return result.rows
    .map(row => row.doc)
    .filter((fn): fn is FunctionDocument => !!fn)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const get = async (
  id: string
): Promise<FunctionDocument | undefined> => {
  if (!docIds.isType(id, DocumentType.FUNCTION)) {
    return undefined
  }
  return await getDb().tryGet<FunctionDocument>(id)
}

export const create = async (
  appId: string,
  draft: FunctionDraftInput
): Promise<FunctionDocument> => {
  validateDraft(draft)
  const now = new Date().toISOString()
  const capabilities = await buildCapabilities(draft.capabilities)
  const result = await getDb().put(
    {
      _id: docIds.generateFunctionID(),
      name: draft.name,
      appId,
      source: draft.source,
      capabilities,
      createdAt: now,
      updatedAt: now,
    },
    { returnDoc: true }
  )
  return result.doc
}

export const update = async (
  draft: FunctionUpdateInput
): Promise<FunctionDocument> => {
  validateDraft(draft)
  const persisted = await get(draft._id)
  if (!persisted) {
    throw new HTTPError(`Function with id '${draft._id}' not found.`, 404)
  }

  const capabilities = await buildCapabilities(
    draft.capabilities,
    persisted.capabilities
  )
  const result = await getDb().put(
    {
      ...persisted,
      _rev: draft._rev,
      name: draft.name,
      source: draft.source,
      capabilities,
      createdAt: persisted.createdAt,
      updatedAt: new Date().toISOString(),
    },
    { returnDoc: true }
  )
  return result.doc
}

const getFunctionIdFromStep = (step: unknown) => {
  if (
    !step ||
    typeof step !== "object" ||
    !("stepId" in step) ||
    step.stepId !== EXECUTE_FUNCTION_STEP_ID ||
    !("inputs" in step) ||
    !step.inputs ||
    typeof step.inputs !== "object" ||
    !("functionId" in step.inputs) ||
    typeof step.inputs.functionId !== "string"
  ) {
    return undefined
  }
  return step.inputs.functionId
}

export const getFunctionIdsFromAutomation = (automation: Automation) => {
  const functionIds = new Set<string>()
  const visit = (value: unknown) => {
    const functionId = getFunctionIdFromStep(value)
    if (functionId) {
      functionIds.add(functionId)
    }
    if (Array.isArray(value)) {
      value.forEach(visit)
    } else if (value && typeof value === "object") {
      Object.values(value).forEach(visit)
    }
  }
  visit(automation.definition?.steps)
  return Array.from(functionIds)
}

const getReferencingAutomationNames = async (functionId: string) => {
  const result = await getDb().allDocs<Automation>(
    docIds.getDocParams(DocumentType.AUTOMATION, null, {
      include_docs: true,
    })
  )
  return result.rows
    .map(row => row.doc)
    .filter((automation): automation is Automation => !!automation)
    .filter(automation =>
      getFunctionIdsFromAutomation(automation).includes(functionId)
    )
    .map(automation => automation.name)
}

const publishReadinessLabels: Record<
  Exclude<FunctionPublishReadiness, "ready">,
  string
> = {
  build_required: "Build required",
  build_failed: "Build failed",
  declarations_changed: "Function query bindings changed",
  missing_query: "Missing query",
}

export const validateFunctionAutomationReferences = async (
  automations: Automation[]
) => {
  const enabledAutomations = automations.filter(
    automation => automation.disabled !== true
  )
  const functionIds = new Set(
    enabledAutomations.flatMap(getFunctionIdsFromAutomation)
  )
  if (!functionIds.size) {
    return
  }

  const functions = new Map((await fetch()).map(fn => [fn._id, fn]))
  const errors: string[] = []
  for (const automation of enabledAutomations) {
    for (const functionId of getFunctionIdsFromAutomation(automation)) {
      const fn = functions.get(functionId)
      if (!fn) {
        errors.push(
          `Automation '${automation.name}' references missing Function '${functionId}'.`
        )
        continue
      }
      const readiness = await getFunctionPublishReadiness(fn)
      if (readiness !== "ready") {
        errors.push(
          `Automation '${automation.name}' references Function '${fn.name}' (${fn._id}): ${publishReadinessLabels[readiness]}.`
        )
      }
    }
  }

  if (errors.length) {
    throw new HTTPError(
      `Function publish preflight failed: ${errors.join(" ")}`,
      400
    )
  }
}

export const remove = async (id: string, rev: string) => {
  const fn = await get(id)
  if (!fn) {
    throw new HTTPError(`Function with id '${id}' not found.`, 404)
  }

  const automationNames = await getReferencingAutomationNames(id)
  if (automationNames.length) {
    throw new HTTPError(
      `Function is used by: ${automationNames.join(", ")}.`,
      409
    )
  }
  return await getDb().remove(id, rev)
}
