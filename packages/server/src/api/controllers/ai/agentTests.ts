import { db, HTTPError } from "@budibase/backend-core"
import type {
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

  ctx.body = {
    suite,
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
  const run = await sdk.ai.tests.runSuite({
    agentId,
    user: ctx.user,
    caseId: ctx.request.body?.caseId,
  })

  ctx.body = { run }
}
