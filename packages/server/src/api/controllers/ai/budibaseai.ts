import { env } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  AIQuotaUsageResponse,
  type ChatCompletionRequest,
  type ChatCompletionResponse,
  type Ctx,
  type UploadFileRequest,
  type UploadFileResponse,
} from "@budibase/types"
import { Readable } from "stream"
import sdk from "../../../sdk"

export async function uploadFile(
  ctx: Ctx<UploadFileRequest, UploadFileResponse>
) {
  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }
  const llm = await sdk.ai.llm.getDefaultLLMOrThrow()
  if (!llm.uploadFile) {
    ctx.throw("The used LLM does not support uploading files", 422)
  }

  const data = Buffer.from(ctx.request.body.data, "base64")

  const response = await llm.uploadFile(
    Readable.from(data),
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

  const llm = await sdk.ai.llm.getDefaultLLMOrThrow()
  ctx.body = await llm.chat(ctx.request.body)
}
