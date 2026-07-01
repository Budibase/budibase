import { features, HTTPError } from "@budibase/backend-core"
import {
  AgentOperationMutationResponse,
  CreateAgentOperationRequest,
  FeatureFlag,
  UpdateAgentOperationRequest,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { toAgentResponse } from "./agentResponse"

const assertMultipleOperationsAllowed = async (agentId: string) => {
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  if ((agent.operations?.length ?? 0) === 0) {
    return
  }
  if (!(await features.isEnabled(FeatureFlag.MULTIPLE_OPERATIONS))) {
    throw new HTTPError("Multiple operations are not enabled", 403)
  }
}

export async function createAgentOperation(
  ctx: UserCtx<
    CreateAgentOperationRequest,
    AgentOperationMutationResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const body = ctx.request.body

  await assertMultipleOperationsAllowed(agentId)

  const agent = await sdk.ai.agents.createOperation(agentId, {
    id: body.id,
    name: body.name,
    live: body.live ?? false,
    promptInstructions: body.promptInstructions,
    enabledTools: body.enabledTools,
    allowKnowledgeSourceDownload: body.allowKnowledgeSourceDownload ?? true,
    escalation: body.escalation,
  })

  ctx.body = toAgentResponse(agent)
  ctx.status = 201
}

export async function updateAgentOperation(
  ctx: UserCtx<
    UpdateAgentOperationRequest,
    AgentOperationMutationResponse,
    { agentId: string; operationId: string }
  >
) {
  const { agentId, operationId } = ctx.params
  const body = ctx.request.body

  if (!Object.keys(body).length) {
    throw new HTTPError("At least one operation field is required", 400)
  }

  const agent = await sdk.ai.agents.updateOperation(agentId, operationId, body)

  ctx.body = toAgentResponse(agent)
  ctx.status = 200
}

export async function deleteAgentOperation(
  ctx: UserCtx<
    void,
    AgentOperationMutationResponse,
    { agentId: string; operationId: string }
  >
) {
  const { agentId, operationId } = ctx.params

  const agent = await sdk.ai.agents.removeOperation(agentId, operationId)

  ctx.body = toAgentResponse(agent)
  ctx.status = 200
}
