import { db, HTTPError } from "@budibase/backend-core"
import type {
  FetchAgentTestRunResponse,
  FetchAgentTestSuiteResponse,
  RunAgentTestSuiteRequest,
  RunAgentTestSuiteResponse,
  UpdateAgentTestSuiteRequest,
  UpdateAgentTestSuiteResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

const getAgentId = async (ctx: UserCtx) => {
  const { agentId } = ctx.params
  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  await sdk.ai.agents.getOrThrow(agentId)
  return agentId
}

export async function fetchAgentTestSuite(
  ctx: UserCtx<void, FetchAgentTestSuiteResponse>
) {
  const agentId = await getAgentId(ctx)
  const suite = await sdk.ai.tests.fetchSuite(agentId)
  const activeRun = await sdk.ai.tests.fetchActiveRun(agentId)

  ctx.body = {
    suite,
    activeRun,
  }
}

export async function updateAgentTestSuite(
  ctx: UserCtx<UpdateAgentTestSuiteRequest, UpdateAgentTestSuiteResponse>
) {
  const agentId = await getAgentId(ctx)
  const updatedBy = ctx.user?._id
    ? db.getGlobalIDFromUserMetadataID(ctx.user._id)
    : undefined

  ctx.body = await sdk.ai.tests.saveSuite({
    agentId,
    request: ctx.request.body,
    updatedBy,
  })
}

export async function runAgentTestSuite(
  ctx: UserCtx<RunAgentTestSuiteRequest, RunAgentTestSuiteResponse>
) {
  const agentId = await getAgentId(ctx)
  const run = await sdk.ai.tests.startRunSuite({
    agentId,
    user: ctx.user,
    caseId: ctx.request.body?.caseId,
    groupId: ctx.request.body?.groupId,
    aiConfigIds: ctx.request.body?.aiConfigIds,
  })

  ctx.body = {
    runId: run.runId,
    status: run.status,
  }
}

export async function fetchAgentTestRun(
  ctx: UserCtx<void, FetchAgentTestRunResponse>
) {
  const agentId = await getAgentId(ctx)
  const { runId } = ctx.params
  if (!runId) {
    throw new HTTPError("runId is required", 400)
  }

  ctx.body = {
    run: await sdk.ai.tests.fetchRun({ agentId, runId }),
  }
}
