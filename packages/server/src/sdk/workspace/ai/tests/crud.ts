import { context, docIds, HTTPError } from "@budibase/backend-core"
import type {
  AgentTestCase,
  AgentTestSuite,
  UpdateAgentTestSuiteRequest,
} from "@budibase/types"
import { v4 } from "uuid"
import { validateTestCase } from "./reviewers"

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
      name: testCase.name?.trim() || `Test ${idx + 1}`,
      input: testCase.input,
      context: testCase.context,
      reviewers,
    }
  })

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
  return { ...suite, _rev: response.rev }
}
