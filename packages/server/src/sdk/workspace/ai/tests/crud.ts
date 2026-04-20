import { context, docIds, HTTPError } from "@budibase/backend-core"
import { UNICODE_MAX } from "@budibase/types"
import type {
  AgentTestCase,
  AgentTestReviewer,
  AgentTestRun,
  AgentTestSuite,
  UpdateAgentTestSuiteRequest,
} from "@budibase/types"
import { v4 } from "uuid"
import {
  normalizeCaseContext,
  normalizeReviewers,
  validateTestCase,
} from "./reviewers"

const buildDefaultSuite = (agentId: string): AgentTestSuite => ({
  _id: docIds.getAgentTestSuiteID(agentId),
  agentId,
  cases: [],
})

export async function fetchSuite(agentId: string): Promise<AgentTestSuite> {
  const db = context.getWorkspaceDB()
  const suite = await db.tryGet<AgentTestSuite>(
    docIds.getAgentTestSuiteID(agentId)
  )
  return suite || buildDefaultSuite(agentId)
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
  const existing = await db.tryGet<AgentTestSuite>(
    docIds.getAgentTestSuiteID(agentId)
  )
  const normalizeReviewer = (
    reviewer: AgentTestReviewer
  ): AgentTestReviewer => {
    return {
      ...reviewer,
      id: reviewer.id || v4(),
    }
  }
  const cases: AgentTestCase[] = request.cases.map((testCase, idx) => ({
    id: testCase.id ?? v4(),
    name: testCase.name?.trim() || `Test ${idx + 1}`,
    input: testCase.input ?? "",
    context: normalizeCaseContext(testCase.context),
    reviewers: normalizeReviewers(testCase.reviewers || []).map(
      normalizeReviewer
    ),
  }))

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

export async function fetchRuns(
  agentId: string,
  limit = 10
): Promise<AgentTestRun[]> {
  const db = context.getWorkspaceDB()
  const startkey = docIds.getAgentTestRunPrefix(agentId)
  const response = await db.allDocs<AgentTestRun>({
    startkey: `${startkey}${UNICODE_MAX}`,
    endkey: startkey,
    include_docs: true,
    descending: true,
  })

  return response.rows
    .map(row => row.doc)
    .filter((run): run is AgentTestRun => Boolean(run))
    .sort((a, b) => {
      const aTime = new Date(a.completedAt || a.startedAt).getTime()
      const bTime = new Date(b.completedAt || b.startedAt).getTime()
      return bTime - aTime
    })
    .slice(0, limit)
}

export async function saveRun(
  run: Omit<AgentTestRun, "_id" | "_rev" | "createdAt" | "updatedAt">
): Promise<AgentTestRun> {
  const db = context.getWorkspaceDB()
  const nextRun: AgentTestRun = {
    ...run,
    _id: docIds.getAgentTestRunID(run.agentId, run.startedAt, run.runId),
    createdAt: run.startedAt,
    updatedAt: run.completedAt,
  }

  const response = await db.put(nextRun)
  return {
    ...nextRun,
    _rev: response.rev,
  }
}
