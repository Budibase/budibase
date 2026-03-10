import {
  CreatePlaybookRequest,
  CreatePlaybookResponse,
  ExportPlaybookRequest,
  FetchPlaybooksResponse,
  ImportPlaybookRequest,
  ImportPlaybookResponse,
  UpdatePlaybookRequest,
  UpdatePlaybookResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface PlaybookEndpoints {
  fetch: () => Promise<FetchPlaybooksResponse>
  create: (playbook: CreatePlaybookRequest) => Promise<CreatePlaybookResponse>
  exportBundle: (id: string, body?: ExportPlaybookRequest) => Promise<Response>
  importBundle: (
    file: File,
    body?: ImportPlaybookRequest
  ) => Promise<ImportPlaybookResponse>
  update: (playbook: UpdatePlaybookRequest) => Promise<UpdatePlaybookResponse>
  delete: (id: string, rev: string) => Promise<void>
}

export const buildPlaybookEndpoints = (
  API: BaseAPIClient
): PlaybookEndpoints => ({
  fetch: async () => {
    return await API.get({
      url: "/api/playbooks",
    })
  },
  create: async playbook => {
    return await API.post({
      url: "/api/playbooks",
      body: playbook,
    })
  },
  exportBundle: async (id, body) => {
    return await API.post<ExportPlaybookRequest | undefined, Response>({
      url: `/api/playbooks/${id}/export`,
      body,
      parseResponse: response => response,
    })
  },
  importBundle: async (file, body) => {
    const formData = new FormData()
    formData.append("file", file)
    for (const [key, value] of Object.entries(body || {})) {
      if (value !== undefined) {
        formData.append(key, value)
      }
    }
    return await API.post<FormData, ImportPlaybookResponse>({
      url: "/api/playbooks/import",
      body: formData,
      json: false,
    })
  },
  update: async playbook => {
    return await API.put({
      url: `/api/playbooks/${playbook._id}`,
      body: playbook,
    })
  },
  delete: async (id, rev) => {
    return await API.delete({
      url: `/api/playbooks/${id}/${rev}`,
    })
  },
})
