import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  GenerateCronRequest,
  GenerateCronResponse,
  GenerateJsRequest,
  GenerateJsResponse,
  GenerateTablesRequest,
  GenerateTablesResponse,
  UploadFileRequest,
  UploadFileResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"
import { constants } from "@budibase/backend-core"

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
}
