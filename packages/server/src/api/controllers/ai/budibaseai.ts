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
import { generateText } from "ai"

const calculateBudibaseAICredits = (
  inputTokens: number,
  outputTokens: number
): number => outputTokens * 3 + inputTokens

export async function uploadFile(
  ctx: Ctx<UploadFileRequest, UploadFileResponse>
) {
  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }
  const llm = await sdk.ai.llm.getDefaultLLMOrThrow()
  if (!llm.uploadFile) {
    ctx.throw(422, "The used LLM does not support uploading files")
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

  const messages = sdk.ai.llm.toModelMessages(ctx.request.body.messages)

  const { chat, providerOptions } = await sdk.ai.llm.getDefaultLLMOrThrow()
  const result = await generateText({
    model: chat,
    messages: messages,
    providerOptions: providerOptions?.(false),
  })

  if (!result.text) {
    throw new Error("No response found")
  }

  const inputTokens =
    result.usage?.inputTokens ?? result.totalUsage.inputTokens ?? 0
  const outputTokens =
    result.usage?.outputTokens ?? result.totalUsage.outputTokens ?? 0
  const tokensUsed = calculateBudibaseAICredits(inputTokens, outputTokens)

  ctx.body = {
    messages: [
      ...ctx.request.body.messages,
      { role: "assistant", content: result.text },
    ],
    tokensUsed: tokensUsed || result.totalUsage.totalTokens || 0,
  }
}
