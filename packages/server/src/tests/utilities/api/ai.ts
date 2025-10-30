import { constants } from "@budibase/backend-core"
import {
  AIConfigListResponse,
  ChatCompletionRequest,
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
import { Expectations, TestAPI } from "./base"

export class AIAPI extends TestAPI {
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

  generateTables = async (
    req: GenerateTablesRequest,
    expectations?: Expectations
  ): Promise<GenerateTablesResponse> => {
    const headers: Record<string, string> = {}
    return await this._post<GenerateTablesResponse>(`/api/ai/tables`, {
      body: req,
      headers,
      expectations,
    })
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
