import { ai } from "@budibase/pro"
import { UserCtx, ChatAgentRequest, ChatAgentResponse } from "@budibase/types"

export async function agentChat(
  ctx: UserCtx<ChatAgentRequest, ChatAgentResponse>
) {
  const model = await ai.getLLM()
  if (!model) {
    return ctx.throw(401, "No model available, cannot chat")
  }
  const response = await model.prompt(ctx.request.body.userPrompt)
  ctx.body = {
    response: !response.message ? "No response." : response.message,
  }
}
