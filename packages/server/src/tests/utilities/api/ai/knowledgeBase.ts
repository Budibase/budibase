import {
  CreateKnowledgeBaseRequest,
  KnowledgeBase,
  KnowledgeBaseListResponse,
  UpdateKnowledgeBaseRequest,
} from "@budibase/types"
import { Expectations, TestAPI } from "../base"

export class KnowledgeBaseAPI extends TestAPI {
  fetch = async (
    expectations?: Expectations
  ): Promise<KnowledgeBaseListResponse> => {
    return await this._get<KnowledgeBaseListResponse>(`/api/knowledge-base`, {
      expectations,
    })
  }

  create = async (
    body: CreateKnowledgeBaseRequest,
    expectations?: Expectations
  ): Promise<KnowledgeBase> => {
    return await this._post<KnowledgeBase>(`/api/knowledge-base`, {
      body,
      expectations: {
        ...expectations,
        status: expectations?.status || 201,
      },
    })
  }

  update = async (
    body: UpdateKnowledgeBaseRequest,
    expectations?: Expectations
  ): Promise<KnowledgeBase> => {
    return await this._put<KnowledgeBase>(`/api/knowledge-base`, {
      body,
      expectations,
    })
  }

  remove = async (
    id: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(`/api/knowledge-base/${id}`, {
      expectations,
    })
  }
}
