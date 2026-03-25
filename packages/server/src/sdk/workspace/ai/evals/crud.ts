import { context, docIds, HTTPError } from "@budibase/backend-core"
import type {
  AgentEvalCase,
  AgentEvalRun,
  AgentEvalSuite,
  UpdateAgentEvalSuiteRequest,
} from "@budibase/types"
import { v4 } from "uuid"
import { normalizeAssertions, validateEvalCase } from "./assertions"

const buildDefaultSuite = (agentId: string): AgentEvalSuite => ({
  _id: docIds.getAgentEvalSuiteID(agentId),
  agentId,
  cases: [],
})

const normalizeCase = (
  testCase: Partial<AgentEvalCase>,
  index: number
): AgentEvalCase => ({
  id: testCase.id?.trim() || v4(),
  name: testCase.name?.trim() || `Case ${index + 1}`,
  prompt: testCase.prompt?.trim() || "",
  assertions: normalizeAssertions(testCase.assertions),
})

export async function fetchSuite(agentId: string): Promise<AgentEvalSuite> {
  const db = context.getWorkspaceDB()
  const suite = await db.tryGet<AgentEvalSuite>(
    docIds.getAgentEvalSuiteID(agentId)
  )
  return suite || buildDefaultSuite(agentId)
}

export async function saveSuite({
  agentId,
  request,
  updatedBy,
}: {
  agentId: string
  request: UpdateAgentEvalSuiteRequest
  updatedBy?: string
}): Promise<AgentEvalSuite> {
  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<AgentEvalSuite>(
    docIds.getAgentEvalSuiteID(agentId)
  )
  const cases = (request.cases || []).map(normalizeCase)

  for (const testCase of cases) {
    const failures = validateEvalCase(testCase)
    if (failures.length > 0) {
      throw new HTTPError(failures[0].message, 400)
    }
  }

  const now = new Date().toISOString()
  const suite: AgentEvalSuite = {
    _id: docIds.getAgentEvalSuiteID(agentId),
    _rev: request._rev || existing?._rev,
    agentId,
    cases,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    updatedBy,
  }

  const response = await db.put(suite)
  return {
    ...suite,
    _rev: response.rev,
  }
}

export async function fetchLatestRun(
  agentId: string
): Promise<AgentEvalRun | null> {
  const db = context.getWorkspaceDB()
  return await db.tryGet<AgentEvalRun>(docIds.getAgentEvalRunID(agentId))
}

export async function saveLatestRun(
  run: Omit<AgentEvalRun, "_id" | "_rev">
): Promise<AgentEvalRun> {
  const db = context.getWorkspaceDB()
  const existing = await fetchLatestRun(run.agentId)
  const nextRun: AgentEvalRun = {
    ...run,
    _id: docIds.getAgentEvalRunID(run.agentId),
    _rev: existing?._rev,
    createdAt: existing?.createdAt || run.startedAt,
    updatedAt: run.completedAt,
  }

  const response = await db.put(nextRun)
  return {
    ...nextRun,
    _rev: response.rev,
  }
}
