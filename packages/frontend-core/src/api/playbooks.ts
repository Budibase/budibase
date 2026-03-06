import {
  CreatePlaybookRequest,
  CreatePlaybookResponse,
  FetchPlaybooksResponse,
  UpdatePlaybookRequest,
  UpdatePlaybookResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface PlaybookEndpoints {
  fetch: () => Promise<FetchPlaybooksResponse>
  create: (playbook: CreatePlaybookRequest) => Promise<CreatePlaybookResponse>
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
