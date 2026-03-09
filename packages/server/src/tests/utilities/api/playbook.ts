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

  export = async (
    id: string,
    body?: ExportPlaybookRequest,
    expectations?: Expectations
  ) => {
    const expectsError = (expectations?.status || 200) >= 400
    const exp = {
      ...expectations,
      headers: {
        ...expectations?.headers,
        ...(expectsError ? {} : { "Content-Type": "application/gzip" }),
      },
    }

    return await this._post<Buffer>(`/api/playbooks/${id}/export`, {
      body,
      expectations: exp,
    })
  }

  import = async (
    file: Buffer | string,
    body?: ImportPlaybookRequest,
    expectations?: Expectations
  ) => {
    return await this._post<ImportPlaybookResponse>(`/api/playbooks/import`, {
      fields: body,
      files: {
        file: {
          file,
          name: "playbook-export.tar.gz",
        },
      },
      expectations,
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
