import { constants, env, HTTPError } from "@budibase/backend-core"
import { ChatCompletionRequest, ChatCompletionResponse } from "@budibase/types"
import { tracer } from "dd-trace"
import { getLicenseKey } from "../../sdk/licensing/licenses/keys"
import {
  throwIfBudibaseAICreditsExceeded,
  incrementBudibaseAICredits,
} from "../../sdk/quotas"
import { LLMFullResponse, LLMPromptResponse } from "../../types"
import { proxyFetch } from "../../utilities"
import { LLMRequest } from "../llm"
import { LLM } from "./base"
import { OpenAI } from "./openai"

export class BudibaseAI extends LLM {
  override supportsFiles = true

  async prompt(prompt: string | LLMRequest): Promise<LLMPromptResponse> {
    await throwIfBudibaseAICreditsExceeded()
    const response = await super.prompt(prompt)
    if (response.tokensUsed) {
      await incrementBudibaseAICredits(response.tokensUsed)
    }
    return response
  }

  async chat(prompt: LLMRequest): Promise<LLMFullResponse> {
    await throwIfBudibaseAICreditsExceeded()
    const response = await super.chat(prompt)
    if (response.tokensUsed) {
      await incrementBudibaseAICredits(response.tokensUsed)
    }
    return response
  }

  protected async chatCompletion(prompt: LLMRequest): Promise<LLMFullResponse> {
    if (env.SELF_HOSTED) {
      return this.chatCompletionSelfHost(prompt)
    } else {
      return this.chatCompletionCloud(prompt)
    }
  }

  protected async chatCompletionCloud(
    prompt: LLMRequest
  ): Promise<LLMFullResponse> {
    return await tracer.trace("chatCompletionCloud", async () => {
      const llm = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        model: this.model,
        max_completion_tokens: this.maxTokens,
      })
      // @ts-expect-error - we're being cheeky and calling a protected method
      return await llm.chatCompletion(prompt)
    })
  }

  protected async chatCompletionSelfHost(
    prompt: LLMRequest
  ): Promise<LLMFullResponse> {
    return await tracer.trace("chatCompletionSelfHost", async span => {
      if (!env.BUDICLOUD_URL) {
        throw new Error("No Budibase URL found")
      }
      span.addTags({
        budicloudUrl: env.BUDICLOUD_URL,
      })

      if (!this._apiKey) {
        const licenseKey = await getLicenseKey()
        if (!licenseKey) {
          throw new Error("No license key found")
        }
        this._apiKey = licenseKey
      }

      const body: ChatCompletionRequest = {
        messages: prompt.messages,
        format: prompt.format,
      }

      const requestUrl = `${env.BUDICLOUD_URL}/api/ai/chat`
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [constants.Header.LICENSE_KEY]: this._apiKey,
        },
        body: JSON.stringify(body),
      }

      console.debug(
        "[BudibaseAI] chatCompletionSelfHost - Making network call",
        {
          url: requestUrl,
          method: requestOptions.method,
          headers: requestOptions.headers,
          bodyKeys: Object.keys(body),
          messagesCount: prompt.messages.length,
          format: body.format,
        }
      )

      const resp = await proxyFetch(requestUrl, requestOptions)

      console.debug("[BudibaseAI] chatCompletionSelfHost - Network response", {
        url: requestUrl,
        status: resp.status,
        statusText: resp.statusText,
        ok: resp.ok,
      })

      if (!resp.ok) {
        throw await HTTPError.fromResponse(resp)
      }

      const result = (await resp.json()) as ChatCompletionResponse

      console.debug("[BudibaseAI] chatCompletionSelfHost - Response data", {
        url: requestUrl,
        tokensUsed: result.tokensUsed,
        messagesCount: result.messages?.length,
      })

      return result
    })
  }
}
