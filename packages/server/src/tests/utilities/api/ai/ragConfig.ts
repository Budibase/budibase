import {
  CreateRagConfigRequest,
  RagConfig,
  RagConfigListResponse,
  UpdateRagConfigRequest,
} from "@budibase/types"
import { Expectations, TestAPI } from "../base"

export class RagConfigAPI extends TestAPI {
  fetch = async (
    expectations?: Expectations
  ): Promise<RagConfigListResponse> => {
    return await this._get<RagConfigListResponse>(`/api/ragconfig`, {
      expectations,
    })
  }

  create = async (
    body: CreateRagConfigRequest,
    expectations?: Expectations
  ): Promise<RagConfig> => {
    return await this._post<RagConfig>(`/api/ragconfig`, {
      body,
      expectations: {
        ...expectations,
        status: expectations?.status || 201,
      },
    })
  }

  update = async (
    body: UpdateRagConfigRequest,
    expectations?: Expectations
  ): Promise<RagConfig> => {
    return await this._put<RagConfig>(`/api/ragconfig`, {
      body,
      expectations,
    })
  }

  remove = async (
    id: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(`/api/ragconfig/${id}`, {
      expectations,
    })
  }
}
