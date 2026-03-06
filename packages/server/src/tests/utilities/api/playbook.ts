import {
  CreatePlaybookRequest,
  CreatePlaybookResponse,
  FetchPlaybooksResponse,
  UpdatePlaybookRequest,
  UpdatePlaybookResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class PlaybookAPI extends TestAPI {
  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchPlaybooksResponse>("/api/playbooks", {
      expectations,
    })
  }

  create = async (
    playbook: CreatePlaybookRequest,
    expectations?: Expectations
  ) => {
    return await this._post<CreatePlaybookResponse>("/api/playbooks", {
      body: playbook,
      expectations: {
        status: 201,
        ...expectations,
      },
    })
  }

  update = async (
    playbook: UpdatePlaybookRequest,
    expectations?: Expectations
  ) => {
    return await this._put<UpdatePlaybookResponse>(
      `/api/playbooks/${playbook._id}`,
      {
        body: playbook,
        expectations,
      }
    )
  }

  delete = async (id: string, rev: string, expectations?: Expectations) => {
    return await this._delete<void>(`/api/playbooks/${id}/${rev}`, {
      expectations: {
        status: 204,
        ...expectations,
      },
    })
  }
}
