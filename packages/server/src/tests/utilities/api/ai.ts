import { constants } from "@budibase/backend-core"
import {
  AIConfigListResponse,
  ChatCompletionRequest,
  ChatCompletionRequestV2,
  ChatCompletionResponse,
  CreateAIConfigRequest,
  CustomAIProviderConfig,
  GenerateCronRequest,
  GenerateCronResponse,
  GenerateJsRequest,
  GenerateJsResponse,
  GenerateTablesRequest,
  GenerateTablesResponse,
  UpdateAIConfigRequest,
  UploadFileRequest,
  UploadFileResponse,
} from "@budibase/types"
import type OpenAI from "openai"
import { Expectations, TestAPI } from "./base"

export class AIAPI extends TestAPI {
  private parseGenerateTablesResponse(text: string): GenerateTablesResponse {
    if (!text?.trim()) {
      return {} as GenerateTablesResponse
    }

    // Non-stream response
    try {
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed === "object") {
        return parsed as GenerateTablesResponse
      }
    } catch {
      // ignore - may be SSE payload
    }

    // Streamed response:
    // data: {"type":"progress",...}
    // data: {"type":"result","createdTables":[...]}
    // data: {"type":"error","message":"..."}
    const lines = text.split(/\r?\n/)
    for (const line of lines) {
      if (!line.startsWith("data: ")) {
        continue
      }
      const payload = line.slice(6).trim()
      if (!payload) {
        continue
      }

      let event: any
      try {
        event = JSON.parse(payload)
      } catch {
        continue
      }

      if (event?.type === "error") {
        throw new Error(event?.message || "Error generating tables")
      }

      if (event?.type === "result" && Array.isArray(event?.createdTables)) {
        return { createdTables: event.createdTables }
      }
    }

    return {} as GenerateTablesResponse
  }

  generateJs = async (
    req: GenerateJsRequest,
    expectations?: Expectations
  ): Promise<GenerateJsResponse> => {
    return await this._post<GenerateJsResponse>(`/api/ai/js`, {
      body: req,
      expectations,
    })
  }

  generateCron = async (
    req: GenerateCronRequest,
    expectations?: Expectations
  ): Promise<GenerateCronResponse> => {
    return await this._post<GenerateCronResponse>(`/api/ai/cron`, {
      body: req,
      expectations,
    })
  }

  chat = async (
    req: ChatCompletionRequest & { licenseKey: string },
    expectations?: Expectations
  ): Promise<ChatCompletionResponse> => {
    const headers: Record<string, string> = {}
    if (req.licenseKey) {
      headers[constants.Header.LICENSE_KEY] = req.licenseKey
    }
    return await this._post<ChatCompletionResponse>(`/api/ai/chat`, {
      body: req,
      headers,
      expectations,
    })
  }

  uploadFile = async (
    req: UploadFileRequest & { licenseKey?: string },
    expectations?: Expectations
  ): Promise<UploadFileResponse> => {
    const headers: Record<string, string> = {}
    if (req.licenseKey) {
      headers[constants.Header.LICENSE_KEY] = req.licenseKey
    }
    return await this._post<UploadFileResponse>(`/api/ai/upload-file`, {
      body: req,
      headers,
      expectations,
    })
  }

  openaiChatCompletions = async (
    req: ChatCompletionRequestV2 & { licenseKey?: string },
    expectations?: Expectations
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
    const headers: Record<string, string> = {}
    if (req.licenseKey) {
      headers[constants.Header.LICENSE_KEY] = req.licenseKey
    }
    const { licenseKey, ...body } = req
    return await this._post<OpenAI.Chat.Completions.ChatCompletion>(
      `/api/ai/chat/completions`,
      {
        body,
        headers,
        expectations,
      }
    )
  }

  generateTables = async (
    req: GenerateTablesRequest,
    expectations?: Expectations
  ): Promise<GenerateTablesResponse> => {
    const headers: Record<string, string> = {}
    const response = this._checkResponse(
      await this._requestRaw("post", `/api/ai/tables`, {
        body: req,
        headers,
        expectations,
      }),
      expectations
    )

    return this.parseGenerateTablesResponse(response.text)
  }
  fetchConfigs = async (
    expectations?: Expectations
  ): Promise<AIConfigListResponse> => {
    return await this._get<AIConfigListResponse>(`/api/configs`, {
      expectations,
    })
  }

  createConfig = async (
    body: CreateAIConfigRequest,
    expectations?: Expectations
  ): Promise<CustomAIProviderConfig> => {
    return await this._post<CustomAIProviderConfig>(`/api/configs`, {
      body,
      expectations,
    })
  }

  updateConfig = async (
    body: UpdateAIConfigRequest,
    expectations?: Expectations
  ): Promise<CustomAIProviderConfig> => {
    return await this._put<CustomAIProviderConfig>(`/api/configs`, {
      body,
      expectations,
    })
  }

  deleteConfig = async (
    id: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(`/api/configs/${id}`, {
      expectations,
    })
  }
}
