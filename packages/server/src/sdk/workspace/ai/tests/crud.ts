import { constants, context, docIds, HTTPError } from "@budibase/backend-core"
import { buildAgentTestCaseSnapshot } from "@budibase/shared-core"
import type {
  AgentTestCase,
  AgentTestCaseResult,
  AgentTestCaseSnapshot,
  AgentTestGroup,
  AgentTestRunDocument,
  AgentTestSuite,
  UpdateAgentTestSuiteRequest,
} from "@budibase/types"
import { buildDefaultAgentTestGroup } from "@budibase/types"
import { buildErroredReviewerResults, validateTestCase } from "./reviewers"

const MAX_RESPONSE_CHARS = 32 * 1024
const TRUNCATION_MARKER = "\n\n…[response truncated]"

const truncateResponse = (response: string): string =>
  response.length <= MAX_RESPONSE_CHARS
    ? response
    : response.slice(0, MAX_RESPONSE_CHARS) + TRUNCATION_MARKER

const buildDefaultSuite = (agentId: string): AgentTestSuite => ({
  _id: docIds.getAgentTestSuiteID(agentId),
  agentId,
  groups: [buildDefaultAgentTestGroup()],
  cases: [],
})

const hasSameCaseDefinition = (
  testCase: AgentTestCase,
  snapshot: AgentTestCaseSnapshot | undefined
) => {
  if (!snapshot) return false
  return (
    JSON.stringify(buildAgentTestCaseSnapshot(testCase)) ===
    JSON.stringify(snapshot)
  )
}

const normalizeGroups = (
  groups: AgentTestGroup[] | undefined
): AgentTestGroup[] => {
  if (!groups?.length) {
    return [buildDefaultAgentTestGroup()]
  }

  return groups.map(group => ({
    ...group,
    name: group.name?.trim() || buildDefaultAgentTestGroup().name,
  }))
}

export const normalizeSuite = (suite: AgentTestSuite): AgentTestSuite => {
  const groups = normalizeGroups(suite.groups)
  const fallbackGroupId = groups[0]!.id
  const groupIds = new Set(groups.map(group => group.id))

  return {
    ...suite,
    groups,
    cases: suite.cases.map(testCase => ({
      ...testCase,
      groupId: groupIds.has(testCase.groupId)
        ? testCase.groupId
        : fallbackGroupId,
    })),
  }
}

export async function fetchSuite(agentId: string): Promise<AgentTestSuite> {
  const db = context.getWorkspaceDB()
  const suite = await db.tryGet<AgentTestSuite>(
    docIds.getAgentTestSuiteID(agentId)
  )
  return normalizeSuite(suite || buildDefaultSuite(agentId))
}

export async function fetchActiveRun(
  agentId: string
): Promise<AgentTestRunDocument | undefined> {
  const db = context.getWorkspaceDB()
  const runPrefix = docIds.getAgentTestRunID(agentId, "")
  const response = await db.allDocs<AgentTestRunDocument>({
    startkey: runPrefix,
    endkey: `${runPrefix}${constants.UNICODE_MAX}`,
    include_docs: true,
  })

  return response.rows
    .map(row => row.doc)
    .filter(
      (run): run is AgentTestRunDocument => !!run && run.status === "running"
    )
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0]
}

export async function saveSuite({
  agentId,
  request,
  updatedBy,
}: {
  agentId: string
  request: UpdateAgentTestSuiteRequest
  updatedBy?: string
}): Promise<AgentTestSuite> {
  const db = context.getWorkspaceDB()
  const existingDoc = await db.tryGet<AgentTestSuite>(
    docIds.getAgentTestSuiteID(agentId)
  )
  const existing = existingDoc ? normalizeSuite(existingDoc) : undefined

  const groups = request.groups.map(group => ({
    id: group.id,
    name: group.name?.trim() || "",
  }))

  if (!groups.length) {
    throw new HTTPError("At least one test group is required.", 400)
  }

  for (const group of groups) {
    if (!group.name) {
      throw new HTTPError("Test group name is required.", 400)
    }
  }

  const groupIds = new Set(groups.map(group => group.id))
  const fallbackGroupId = groups[0]!.id

  const cases: AgentTestCase[] = request.cases.map((testCase, idx) => {
    const existingCase = existing?.cases.find(c => c.id === testCase.id)

    const nextCase: AgentTestCase = {
      id: testCase.id,
      groupId: testCase.groupId || existingCase?.groupId || fallbackGroupId,
      name: testCase.name?.trim() || `Test ${idx + 1}`,
      input: testCase.input,
      context: testCase.context,
      aiConfigIds: testCase.aiConfigIds,
      reviewers: testCase.reviewers,
    }

    const lastResults = existingCase
      ? (existingCase.lastResults || []).filter(result =>
          hasSameCaseDefinition(nextCase, result.caseSnapshot)
        )
      : []

    if (lastResults.length) {
      nextCase.lastResults = lastResults
    }

    return nextCase
  })

  for (const testCase of cases) {
    if (!groupIds.has(testCase.groupId)) {
      throw new HTTPError("Each test must belong to a valid test group.", 400)
    }
  }

  for (const testCase of cases) {
    const failures = validateTestCase(testCase)
    if (failures.length > 0) {
      throw new HTTPError(failures[0].message, 400)
    }
  }

  const now = new Date().toISOString()
  const suite: AgentTestSuite = {
    _id: docIds.getAgentTestSuiteID(agentId),
    _rev: request._rev || existing?._rev,
    agentId,
    groups,
    cases,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    updatedBy,
  }

  const response = await db.put(suite)
  return normalizeSuite({ ...suite, _rev: response.rev })
}

export async function persistRunResults({
  agentId,
  results,
}: {
  agentId: string
  results: AgentTestCaseResult[]
}): Promise<void> {
  if (!results.length) return

  const db = context.getWorkspaceDB()
  const suite = await db.tryGet<AgentTestSuite>(
    docIds.getAgentTestSuiteID(agentId)
  )
  if (!suite) return

  const byCaseId = new Map<string, AgentTestCaseResult[]>()
  for (const result of results) {
    const caseResults = byCaseId.get(result.caseId) || []
    caseResults.push(result)
    byCaseId.set(result.caseId, caseResults)
  }

  const cases = suite.cases.map(testCase => {
    const caseResults = byCaseId.get(testCase.id)
    if (!caseResults?.length) return testCase

    const lastResults = caseResults.map(result => ({
      ...result,
      response: truncateResponse(result.response),
    }))

    return {
      ...testCase,
      lastResults,
    }
  })

  await db.put({ ...suite, cases })
}

const buildRunErrorResults = ({
  suite,
  run,
  error,
  completedAt,
}: {
  suite: AgentTestSuite
  run: AgentTestRunDocument
  error: string
  completedAt: string
}): AgentTestCaseResult[] => {
  const caseIds = new Set(run.caseIds || [])
  const startedAtMs = Date.parse(run.startedAt)
  const completedAtMs = Date.parse(completedAt)
  const durationMs =
    Number.isFinite(startedAtMs) && Number.isFinite(completedAtMs)
      ? Math.max(0, completedAtMs - startedAtMs)
      : 0

  return suite.cases
    .filter(testCase => caseIds.has(testCase.id))
    .map(testCase => {
      const caseSnapshot = buildAgentTestCaseSnapshot(testCase)
      return {
        caseId: testCase.id,
        name: testCase.name,
        caseSnapshot,
        response: "",
        status: "error",
        reviewerResults: buildErroredReviewerResults({
          reviewers: caseSnapshot.reviewers,
          message: error,
        }),
        toolCalls: [],
        sessionId: `test:${run.runId}:${testCase.id}:run`,
        requestIds: [],
        startedAt: run.startedAt,
        completedAt,
        durationMs,
        error,
      }
    })
}

const persistRunErrorResults = async ({
  agentId,
  run,
  error,
  completedAt,
}: {
  agentId: string
  run: AgentTestRunDocument
  error: string
  completedAt: string
}) => {
  if (!run.caseIds?.length) return

  const suite = await fetchSuite(agentId)
  const results = buildRunErrorResults({ suite, run, error, completedAt })
  await persistRunResults({ agentId, results })
}

export async function createRun({
  agentId,
  runId,
  caseIds,
  startedAt,
}: {
  agentId: string
  runId: string
  caseIds: string[]
  startedAt: string
}): Promise<AgentTestRunDocument> {
  const db = context.getWorkspaceDB()
  const run: AgentTestRunDocument = {
    _id: docIds.getAgentTestRunID(agentId, runId),
    agentId,
    runId,
    caseIds,
    status: "running",
    startedAt,
  }

  const response = await db.put(run)
  return { ...run, _rev: response.rev }
}

export async function fetchRun({
  agentId,
  runId,
}: {
  agentId: string
  runId: string
}): Promise<AgentTestRunDocument> {
  const db = context.getWorkspaceDB()
  const run = await db.tryGet<AgentTestRunDocument>(
    docIds.getAgentTestRunID(agentId, runId)
  )
  if (!run) {
    throw new HTTPError("That test run was not found.", 404)
  }
  return run
}

export async function completeRun({
  agentId,
  runId,
  completedAt,
}: {
  agentId: string
  runId: string
  completedAt: string
}): Promise<void> {
  const existing = await fetchRun({ agentId, runId })
  const db = context.getWorkspaceDB()
  await db.put({
    ...existing,
    status: "completed",
    completedAt,
  })
}

export async function failRun({
  agentId,
  runId,
  error,
}: {
  agentId: string
  runId: string
  error: string
}): Promise<void> {
  const existing = await fetchRun({ agentId, runId })
  const db = context.getWorkspaceDB()
  const completedAt = new Date().toISOString()
  await db.put({
    ...existing,
    status: "error",
    completedAt,
    error,
  })

  try {
    await persistRunErrorResults({ agentId, run: existing, error, completedAt })
  } catch (updateError) {
    console.error("Failed to persist agent test run error results", {
      agentId,
      runId,
      error: updateError,
    })
  }
}
