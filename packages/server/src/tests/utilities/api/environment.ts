import { Expectations, TestAPI } from "./base"
import {
  CreateEnvironmentVariableRequest,
  CreateEnvironmentVariableResponse,
  GetEnvironmentVariablesResponse,
  StatusEnvironmentVariableResponse,
  UpdateEnvironmentVariableRequest,
} from "@budibase/types"

export class EnvironmentAPI extends TestAPI {
  create = async (
    body: CreateEnvironmentVariableRequest,
    expectations?: Expectations
  ) => {
    return await this._post<CreateEnvironmentVariableResponse>(
      `/api/env/variables`,
      { body, expectations }
    )
  }

  status = async (expectations?: Expectations) => {
    return await this._get<StatusEnvironmentVariableResponse>(
      `/api/env/variables/status`,
      { expectations }
    )
  }

  fetch = async (expectations?: Expectations) => {
    return await this._get<GetEnvironmentVariablesResponse>(
      `/api/env/variables`,
      { expectations }
    )
  }

  update = async (
    varName: string,
    body: UpdateEnvironmentVariableRequest,
    expectations?: Expectations
  ) => {
    return await this._patch<void>(`/api/env/variables/${varName}`, {
      body,
      expectations,
    })
  }

  destroy = async (varName: string, expectations?: Expectations) => {
    return await this._delete<void>(`/api/env/variables/${varName}`, {
      expectations,
    })
  }
}
