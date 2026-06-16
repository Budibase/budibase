import { HTTPError } from "@budibase/backend-core"
import {
  AgentOperationMutationResponse,
  CreateAgentOperationRequest,
  UpdateAgentOperationRequest,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { toAgentResponse } from "./agentResponse"

export async function createAgentOperation(
  ctx: UserCtx<
    CreateAgentOperationRequest,
    AgentOperationMutationResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const body = ctx.request.body

  const agent = await sdk.ai.agents.createOperation(agentId, {
    id: body.id,
    name: body.name,
    live: body.live ?? false,
    promptInstructions: body.promptInstructions,
    enabledTools: body.enabledTools,
    allowKnowledgeSourceDownload: body.allowKnowledgeSourceDownload ?? true,
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
