import { context, docIds, HTTPError } from "@budibase/backend-core"
import { UNICODE_MAX } from "@budibase/types"
import type {
  AgentEvalCase,
  AgentEvalReviewer,
  AgentEvalRun,
  AgentEvalSuite,
  UpdateAgentEvalSuiteRequest,
} from "@budibase/types"
import { v4 } from "uuid"
import {
  normalizeCaseContext,
  normalizeReviewers,
  validateEvalCase,
} from "./reviewers"

const buildDefaultSuite = (agentId: string): AgentEvalSuite => ({
  _id: docIds.getAgentEvalSuiteID(agentId),
  agentId,
  cases: [],
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
  const normalizeReviewer = (reviewer: AgentEvalReviewer): AgentEvalReviewer => {
    return {
      ...reviewer,
      id: reviewer.id || v4(),
    }
  }
  const cases: AgentEvalCase[] = request.cases.map((testCase, idx) => ({
    id: testCase.id ?? v4(),
    name: testCase.name?.trim() || `Case ${idx + 1}`,
    input: testCase.input ?? "",
    context: normalizeCaseContext(testCase.context),
    reviewers: normalizeReviewers(testCase.reviewers || []).map(
      normalizeReviewer
    ),
  }))

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
): Promise<AgentEvalRun | undefined> {
  const [latestRun] = await fetchRuns(agentId, 1)
  return latestRun
}

export async function fetchRuns(
  agentId: string,
  limit = 10
): Promise<AgentEvalRun[]> {
  const db = context.getWorkspaceDB()
  const startkey = docIds.getAgentEvalRunPrefix(agentId)
  const response = await db.allDocs<AgentEvalRun>({
    startkey: `${startkey}${UNICODE_MAX}`,
    endkey: startkey,
    include_docs: true,
    descending: true,
    limit,
  })

  return response.rows
    .map(row => row.doc)
    .filter((run): run is AgentEvalRun => Boolean(run))
}

export async function saveRun(
  run: Omit<AgentEvalRun, "_id" | "_rev" | "createdAt" | "updatedAt">
): Promise<AgentEvalRun> {
  const db = context.getWorkspaceDB()
  const nextRun: AgentEvalRun = {
    ...run,
    _id: docIds.getAgentEvalRunID(run.agentId, run.runId),
    createdAt: run.startedAt,
    updatedAt: run.completedAt,
  }

  const response = await db.put(nextRun)
  return {
    ...nextRun,
    _rev: response.rev,
  }
}
