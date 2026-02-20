import { env } from "@budibase/backend-core"
import { ai, quotas } from "@budibase/pro"
import {
  AIQuotaUsageResponse,
  type ChatCompletionRequest,
  type ChatCompletionResponse,
  type Ctx,
  type UploadFileRequest,
  type UploadFileResponse,
} from "@budibase/types"

export async function uploadFile(
  ctx: Ctx<UploadFileRequest, UploadFileResponse>
) {
  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }
  const llm = await ai.getLLMOrThrow()

  const data = Buffer.from(ctx.request.body.data, "base64")

  const response = await llm.uploadFile(
    data,
    ctx.request.body.filename,
    ctx.request.body.contentType
  )
  ctx.body = {
    file: response,
  }
}

export async function getAIQuotaUsage(ctx: Ctx<void, AIQuotaUsageResponse>) {
  const usage = await quotas.getQuotaUsage()
  const monthlyCredits = usage?.monthly?.current?.budibaseAICredits ?? 0
  ctx.body = { monthlyCredits }
}

export async function chatCompletion(
  ctx: Ctx<ChatCompletionRequest, ChatCompletionResponse>
) {
  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }

  const llm = await ai.getLLMOrThrow()
  ctx.body = await llm.chat(ai.LLMRequest.fromRequest(ctx.request.body))
}
