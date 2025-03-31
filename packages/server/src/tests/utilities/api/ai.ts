import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  GenerateCronRequest,
  GenerateCronResponse,
  GenerateJsRequest,
  GenerateJsResponse,
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
    req: ChatCompletionRequest,
    expectations?: Expectations
  ): Promise<ChatCompletionResponse> => {
    return await this._post<ChatCompletionResponse>(`/api/ai/chat`, {
      body: req,
      expectations,
    })
  }
}
