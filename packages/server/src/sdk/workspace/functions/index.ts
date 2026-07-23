import { createHash } from "crypto"
import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  DEFAULT_FUNCTION_LIMITS,
  DocumentType,
  type AnyDocument,
  type FunctionBuildDiagnostic,
  type FunctionDocument,
  type FunctionQueryCapabilityInput,
  type FunctionResponse,
} from "@budibase/types"
import { compileFunction } from "./compiler"
import {
  generateFunctionDeclarations,
  hashFunctionDeclarations,
} from "./declarations"
import { buildCapabilities } from "./queryCatalog"

export {
  generateFunctionDeclarations,
  hashFunctionDeclarations,
} from "./declarations"
export { getQueryCatalog, resolveSavedQuery } from "./queryCatalog"

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
const ALIAS_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/

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

export const getFunctionDeclarationsHash = async (fn: FunctionDocument) =>
  (await getFunctionDeclarations(fn)).declarationsHash

export const getFunctionReadiness = async (fn: FunctionDocument) => {
  const sourceHash = getFunctionSourceHash(fn.source)
  let declarationsHash: string
  try {
    declarationsHash = await getFunctionDeclarationsHash(fn)
  } catch (error) {
    if (error instanceof HTTPError) {
      return "build_required"
    }
    throw error
  }

  if (
    fn.lastBuild?.sourceHash !== sourceHash ||
    fn.lastBuild.declarationsHash !== declarationsHash
  ) {
    return "build_required"
  }
  if (fn.lastBuild.status === "failed") {
    return "build_failed"
  }
  if (
    typeof fn.artifact?.compiledJavaScript === "string" &&
    fn.artifact.compiledJavaScript.length > 0 &&
    typeof fn.artifact.compiledAt === "string" &&
    fn.artifact.compiledAt.length > 0 &&
    fn.artifact?.sourceHash === sourceHash &&
    fn.artifact.declarationsHash === declarationsHash
  ) {
    return "ready"
  }
  return "build_required"
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
  const declarationResult = await getFunctionDeclarations(fn)
  const result = await compileFunction({
    source: fn.source,
    declarations: declarationResult.declarations,
  })
  const diagnostics = getCompileDiagnostics(result.diagnostics, !!result.output)

  const current = await get(id)
  if (!current) {
    throw new HTTPError(`Function with id '${id}' not found.`, 404)
  }
  assertRevision(current, revision)
  const currentDeclarations = await getFunctionDeclarations(current)
  if (
    currentDeclarations.declarationsHash !== declarationResult.declarationsHash
  ) {
    throw new HTTPError(
      "Function query declarations changed during compilation.",
      409
    )
  }

  const attemptedAt = new Date().toISOString()
  const successfulOutput = diagnostics.length ? undefined : result.output
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
        sourceMap: successfulOutput.sourceMap,
        sourceHash,
        declarationsHash: declarationResult.declarationsHash,
        compiledAt: attemptedAt,
      }
    : current.artifact
  const response = await getDb().put(
    {
      ...current,
      _rev: revision,
      capabilities: currentDeclarations.capabilities,
      artifact,
      lastBuild,
    },
    { returnDoc: true }
  )
  return response.doc
}

export const toFunctionResponse = async (
  fn: FunctionDocument
): Promise<FunctionResponse> => ({
  ...fn,
  readiness: await getFunctionReadiness(fn),
})

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

const getReferencingAutomationNames = async (functionId: string) => {
  const result = await getDb().allDocs<AnyDocument>(
    docIds.getDocParams(DocumentType.AUTOMATION, null, {
      include_docs: true,
    })
  )
  return result.rows
    .map(row => row.doc)
    .filter(automation => {
      const steps = automation?.definition?.steps
      return (
        Array.isArray(steps) &&
        steps.some(step => getFunctionIdFromStep(step) === functionId)
      )
    })
    .map(automation => automation?.name)
    .filter((name): name is string => typeof name === "string")
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
