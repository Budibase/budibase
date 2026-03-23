import {
  FetchKnowledgeBaseFilesResponse,
  KnowledgeBaseFileUploadResponse,
} from "@budibase/types"
import { AttachedFile, Expectations, TestAPI } from "../base"

export class KnowledgeBaseFilesAPI extends TestAPI {
  fetch = async (
    knowledgeBaseId: string,
    expectations?: Expectations
  ): Promise<FetchKnowledgeBaseFilesResponse> => {
    return await this._get<FetchKnowledgeBaseFilesResponse>(
      `/api/knowledge-base/${knowledgeBaseId}/files`,
      { expectations }
    )
  }

  upload = async (
    knowledgeBaseId: string,
    file: AttachedFile,
    expectations?: Expectations
  ): Promise<KnowledgeBaseFileUploadResponse> => {
    return await this._post<KnowledgeBaseFileUploadResponse>(
      `/api/knowledge-base/${knowledgeBaseId}/files`,
      {
        files: { file },
        expectations: {
          ...expectations,
          status: expectations?.status || 201,
        },
      }
    )
  }

  remove = async (
    knowledgeBaseId: string,
    fileId: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(
      `/api/knowledge-base/${knowledgeBaseId}/files/${fileId}`,
      { expectations }
    )
  }
}
