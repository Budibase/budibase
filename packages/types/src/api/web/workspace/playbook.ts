export interface PlaybookResponse {
  _id: string
  _rev: string
  name: string
  description?: string
  color?: string
  createdAt: string
  updatedAt?: string
}

export interface FetchPlaybooksResponse {
  playbooks: PlaybookResponse[]
}

export interface CreatePlaybookRequest {
  name: string
  description?: string
  color?: string
}

export interface CreatePlaybookResponse {
  playbook: PlaybookResponse
}

export interface UpdatePlaybookRequest extends PlaybookResponse {}

export interface UpdatePlaybookResponse {
  playbook: PlaybookResponse
}
