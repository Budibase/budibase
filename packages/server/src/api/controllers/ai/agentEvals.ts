import { db, HTTPError } from "@budibase/backend-core"
import type {
  FetchAgentEvalSuiteResponse,
  RunAgentEvalSuiteResponse,
  UpdateAgentEvalSuiteRequest,
  UpdateAgentEvalSuiteResponse,
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

export async function fetchAgentEvalSuite(
  ctx: UserCtx<void, FetchAgentEvalSuiteResponse>
) {
  const agentId = await getAgentId(ctx)
  const [suite, runs] = await Promise.all([
    sdk.ai.evals.fetchSuite(agentId),
    sdk.ai.evals.fetchRuns(agentId),
  ])

  ctx.body = {
    suite,
    runs,
  }
}

export async function updateAgentEvalSuite(
  ctx: UserCtx<UpdateAgentEvalSuiteRequest, UpdateAgentEvalSuiteResponse>
) {
  const agentId = await getAgentId(ctx)
  const updatedBy = ctx.user?._id
    ? db.getGlobalIDFromUserMetadataID(ctx.user._id)
    : undefined

  ctx.body = await sdk.ai.evals.saveSuite({
    agentId,
    request: ctx.request.body,
    updatedBy,
  })
}

export async function runAgentEvalSuite(
  ctx: UserCtx<void, RunAgentEvalSuiteResponse>
) {
  const agentId = await getAgentId(ctx)
  const run = await sdk.ai.evals.runSuite({
    agentId,
    user: ctx.user,
  })

  ctx.body = { run }
}
