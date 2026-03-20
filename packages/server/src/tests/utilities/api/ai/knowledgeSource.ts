import {
  CreateKnowledgeSourceRequest,
  KnowledgeSource,
  KnowledgeSourceListResponse,
  UpdateKnowledgeSourceRequest,
} from "@budibase/types"
import { Expectations, TestAPI } from "../base"

export class KnowledgeSourceAPI extends TestAPI {
  fetch = async (
    knowledgeBaseId?: string,
    expectations?: Expectations
  ): Promise<KnowledgeSourceListResponse> => {
    const query = knowledgeBaseId
      ? `?knowledgeBaseId=${encodeURIComponent(knowledgeBaseId)}`
      : ""
    return await this._get<KnowledgeSourceListResponse>(
      `/api/knowledge-source${query}`,
      {
        expectations,
      }
    )
  }

  create = async (
    body: CreateKnowledgeSourceRequest,
    expectations?: Expectations
  ): Promise<KnowledgeSource> => {
    return await this._post<KnowledgeSource>("/api/knowledge-source", {
      body,
      expectations: {
        ...expectations,
        status: expectations?.status || 201,
      },
    })
  }

  update = async (
    body: UpdateKnowledgeSourceRequest,
    expectations?: Expectations
  ): Promise<KnowledgeSource> => {
    return await this._put<KnowledgeSource>("/api/knowledge-source", {
      body,
      expectations,
    })
  }

  remove = async (
    id: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(`/api/knowledge-source/${id}`, {
      expectations,
    })
  }
}
