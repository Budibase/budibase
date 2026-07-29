import { Readable } from "stream"
import { agentConversationLogs } from "@budibase/pro"
import {
  AgentConversationLogSearchParams,
  DownloadAgentConversationLogsRequest,
  SearchAgentConversationLogsRequest,
  SearchAgentConversationLogsResponse,
  UserCtx,
} from "@budibase/types"

export async function search(
  ctx: UserCtx<
    SearchAgentConversationLogsRequest,
    SearchAgentConversationLogsResponse
  >
) {
  const search: AgentConversationLogSearchParams = ctx.request.body
  ctx.body = await agentConversationLogs.fetch(search)
}

export async function download(
  ctx: UserCtx<DownloadAgentConversationLogsRequest, Readable>
) {
  const search: AgentConversationLogSearchParams = ctx.request.body
  const { stream } = await agentConversationLogs.download(search)
  ctx.attachment(`agent-conversation-logs-${Date.now()}.log`)
  ctx.body = stream
}
