import { constants, env, HTTPError } from "@budibase/backend-core"
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ImageContentTypes,
  LLMStreamChunk,
} from "@budibase/types"
import { tracer } from "dd-trace"
import { Readable } from "node:stream"
import { getLicenseKey } from "../../sdk/licensing/licenses/keys"
import { incrementBudibaseAICredits } from "../../sdk/quotas"
import { LLMFullResponse, LLMPromptResponse } from "../../types/ai"
import { proxyFetch } from "../../utilities/fetch"
import { LLMRequest } from "../llm"
import { LLM } from "./base"
import { OpenAI } from "./openai"

export class BudibaseAI extends LLM {
  async prompt(prompt: string | LLMRequest): Promise<LLMPromptResponse> {
    const response = await super.prompt(prompt)
    if (response.tokensUsed) {
      await incrementBudibaseAICredits(response.tokensUsed)
    }
    return response
  }

  async chat(prompt: LLMRequest): Promise<LLMFullResponse> {
    const response = await super.chat(prompt)
    if (response.tokensUsed) {
      await incrementBudibaseAICredits(response.tokensUsed)
    }
    return response
  }

  async uploadFile(
    data: Readable | Buffer,
    filename: string,
    contentType: string
  ): Promise<string> {
    if (env.SELF_HOSTED) {
      return this.uploadFileSelfHost(data, filename, contentType)
    } else {
      return this.uploadFileCloud(data, filename, contentType)
    }
  }

  protected async uploadFileCloud(
    data: Readable | Buffer,
    filename: string,
    contentType: string
  ): Promise<string> {
    const llm = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      model: this.model,
      max_completion_tokens: this.maxTokens,
    })
    return llm.uploadFile(data, filename, contentType)
  }

  protected async uploadFileSelfHost(
    data: Readable | Buffer,
    filename: string,
    contentType: string
  ): Promise<string> {
    // We use this buffer in two ways here, once we use the responses api
    // we will be able to unify and get a file id for image and document types. Currently
    // the completions api does not support getting a file id for images.
    let buffer: Buffer
    if (Buffer.isBuffer(data)) {
      buffer = data
    } else {
      const chunks: Uint8Array[] = []
      for await (const chunk of data as Readable) {
        chunks.push(new Uint8Array(chunk))
      }
      buffer = Buffer.concat(chunks)
    }
    const base64 = buffer.toString("base64")

    if (contentType && ImageContentTypes.includes(contentType.toLowerCase())) {
      return `data:image/jpeg;base64,${base64}`
    }

    // For non-image files, send to server
    if (!env.BUDICLOUD_URL) {
      throw new Error("No Budibase URL found")
    }
    if (!this._apiKey) {
      const licenseKey = await getLicenseKey()
      if (!licenseKey) {
        throw new Error("No license key found")
      }
      this._apiKey = licenseKey
    }

    const requestUrl = `${env.BUDICLOUD_URL}/api/ai/upload-file`
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [constants.Header.LICENSE_KEY]: this._apiKey,
      },
      body: JSON.stringify({
        data: base64,
        filename,
        contentType,
      }),
    }

    console.debug("[BudibaseAI] uploadFileSelfHost - Making network call", {
      url: requestUrl,
      method: requestOptions.method,
      headers: requestOptions.headers,
      bodyKeys: ["data", "filename", "contentType"],
      filename,
      contentType,
    })

    const resp = await proxyFetch(requestUrl, requestOptions)

    console.debug("[BudibaseAI] uploadFileSelfHost - Network response", {
      url: requestUrl,
      status: resp.status,
      statusText: resp.statusText,
      ok: resp.ok,
    })

    if (!resp.ok) {
      throw await HTTPError.fromResponse(resp)
    }

    const result = await resp.json()
    return result.fileId
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

  protected async *chatCompletionStream(
    request: LLMRequest
  ): AsyncGenerator<LLMStreamChunk, void, unknown> {
    if (env.SELF_HOSTED) {
      yield* this.chatCompletionStreamSelfHost(request)
    } else {
      yield* this.chatCompletionStreamCloud(request)
    }
  }

  protected async *chatCompletionStreamCloud(
    request: LLMRequest
  ): AsyncGenerator<LLMStreamChunk, void, unknown> {
    const llm = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      model: this.model,
      max_completion_tokens: this.maxTokens,
    })
    // @ts-expect-error - we're being cheeky and calling a protected method
    yield* llm.chatCompletionStream(request)
  }

  protected async *chatCompletionStreamSelfHost(
    request: LLMRequest
  ): AsyncGenerator<LLMStreamChunk, void, unknown> {
    // TODO: Implement streaming for self-hosted BudibaseAI
    // For now, fall back to non-streaming and yield all at once
    console.debug(
      "[BudibaseAI] chatCompletionStreamSelfHost - Starting streaming (fallback to non-streaming)",
      {
        messagesCount: request.messages.length,
      }
    )

    try {
      const response = await this.chatCompletionSelfHost(request)

      console.debug(
        "[BudibaseAI] chatCompletionStreamSelfHost - Yielding response chunks",
        {
          responseMessagesCount: response.messages.length,
          tokensUsed: response.tokensUsed,
        }
      )

      // Yield the final message content if available
      if (response.messages.length > 0) {
        const lastMessage = response.messages[response.messages.length - 1]
        if (lastMessage.content) {
          yield {
            type: "content",
            content: lastMessage.content as string,
          }
        }
      }

      yield {
        type: "done",
        messages: response.messages,
        tokensUsed: response.tokensUsed,
      }
    } catch (error: any) {
      console.debug(
        "[BudibaseAI] chatCompletionStreamSelfHost - Error occurred",
        {
          error: error.message,
        }
      )

      yield {
        type: "error",
        content: error.message,
      }
    }
  }
}
