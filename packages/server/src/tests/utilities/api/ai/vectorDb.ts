import {
  CreateVectorDbRequest,
  UpdateVectorDbRequest,
  VectorDb,
  VectorDbListResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "../base"

export class VectorDbAPI extends TestAPI {
  fetch = async (
    expectations?: Expectations
  ): Promise<VectorDbListResponse> => {
    return await this._get<VectorDbListResponse>(`/api/vectordb`, {
      expectations,
    })
  }

  create = async (
    body: CreateVectorDbRequest,
    expectations?: Expectations
  ): Promise<VectorDb> => {
    return await this._post<VectorDb>(`/api/vectordb`, {
      body,
      expectations: {
        ...expectations,
        status: expectations?.status || 201,
      },
    })
  }

  update = async (
    body: UpdateVectorDbRequest,
    expectations?: Expectations
  ): Promise<VectorDb> => {
    return await this._put<VectorDb>(`/api/vectordb`, {
      body,
      expectations,
    })
  }

  remove = async (
    id: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(`/api/vectordb/${id}`, {
      expectations,
    })
  }
}
