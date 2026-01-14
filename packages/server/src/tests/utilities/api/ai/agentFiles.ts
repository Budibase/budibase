import {
  AgentFileUploadResponse,
  FetchAgentFilesResponse,
} from "@budibase/types"
import { AttachedFile, Expectations, TestAPI } from "../base"

export class AgentFilesAPI extends TestAPI {
  fetch = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<FetchAgentFilesResponse> => {
    return await this._get<FetchAgentFilesResponse>(
      `/api/agent/${agentId}/files`,
      { expectations }
    )
  }

  upload = async (
    agentId: string,
    file: AttachedFile,
    expectations?: Expectations
  ): Promise<AgentFileUploadResponse> => {
    return await this._post<AgentFileUploadResponse>(
      `/api/agent/${agentId}/files`,
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
    agentId: string,
    fileId: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(
      `/api/agent/${agentId}/files/${fileId}`,
      { expectations }
    )
  }
}
