import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  Ctx,
  FeatureFlag,
  UploadFileRequest,
  UploadFileResponse,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import { features, env } from "@budibase/backend-core"
import * as tools from "../../../ai/tools"

export async function uploadFile(
  ctx: Ctx<UploadFileRequest, UploadFileResponse>
) {
  if (env.SELF_HOSTED) {
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

export async function chatCompletion(
  ctx: Ctx<ChatCompletionRequest, ChatCompletionResponse>
) {
  if (
    !(await features.isEnabled(FeatureFlag.AI_JS_GENERATION)) &&
    !(await features.isEnabled(FeatureFlag.AI_TABLE_GENERATION))
  ) {
    ctx.throw(500, "AI generation is disabled")
  }

  if (env.SELF_HOSTED) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }

  const llm = await ai.getLLMOrThrow()
  const prompt = ai.LLMRequest.fromRequest(ctx.request.body)
  if (ctx.request.body.useTools) {
    prompt.tools.push(...tools.budibase)
  }
  ctx.body = await llm.chat(ai.LLMRequest.fromRequest(ctx.request.body))
}
