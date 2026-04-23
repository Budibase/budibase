import { context, docIds, HTTPError } from "@budibase/backend-core"
import type {
  AgentTestCase,
  AgentTestCaseResult,
  AgentTestGroup,
  AgentTestSuite,
  UpdateAgentTestSuiteRequest,
} from "@budibase/types"
import { buildDefaultAgentTestGroup } from "@budibase/types"
import { v4 } from "uuid"
import { validateTestCase } from "./reviewers"

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
      groupId: groupIds.has(testCase.groupId) ? testCase.groupId : fallbackGroupId,
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

  const groups = request.groups.map((group, idx) => ({
    id: group.id || existing?.groups[idx]?.id || v4(),
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
    const id = testCase.id ?? v4()
    const existingCase =
      testCase.id != null
        ? existing?.cases.find(c => c.id === testCase.id)
        : undefined
    const reviewers = testCase.reviewers.map((reviewer, rIdx) => ({
      ...reviewer,
      id: reviewer.id || existingCase?.reviewers[rIdx]?.id || v4(),
    })) as AgentTestCase["reviewers"]

    return {
      id,
      groupId: testCase.groupId || existingCase?.groupId || fallbackGroupId,
      name: testCase.name?.trim() || `Test ${idx + 1}`,
      input: testCase.input,
      context: testCase.context,
      reviewers,
      ...(existingCase?.lastResult
        ? { lastResult: existingCase.lastResult }
        : {}),
    }
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

  const byCaseId = new Map(results.map(r => [r.caseId, r]))
  const cases = suite.cases.map(testCase => {
    const result = byCaseId.get(testCase.id)
    if (!result) return testCase
    return {
      ...testCase,
      lastResult: {
        ...result,
        response: truncateResponse(result.response),
      },
    }
  })

  await db.put({ ...suite, cases })
}
