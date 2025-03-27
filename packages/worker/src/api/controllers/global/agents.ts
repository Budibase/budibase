import { ai } from "@budibase/pro"
import { UserCtx, ChatAgentRequest, ChatAgentResponse } from "@budibase/types"

function agentSystemPrompt() {
  return `You are a helpful support agent, using workflows to solve problems for users.
  The user is asking you for help with a support query.
  
  Your reply MUST be short and concise, answering the user's query as quickly and
  easily as possible.`
}

export async function agentChat(
  ctx: UserCtx<ChatAgentRequest, ChatAgentResponse>
) {
  const model = await ai.getLLM()
  if (!model) {
    return ctx.throw(401, "No model available, cannot chat")
  }
  const prompt = new ai.Prompt()
  prompt.user(ctx.request.body.userPrompt)
  prompt.system(agentSystemPrompt())
  const response = await model.prompt(prompt)
  ctx.body = {
    response: !response.message ? "No response." : response.message,
  }
}
