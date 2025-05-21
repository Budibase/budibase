import {
  InsertWorkspaceAppRequest,
  InsertWorkspaceAppResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class WorkspaceAppAPI extends TestAPI {
  create = async (
    app: InsertWorkspaceAppRequest,
    expectations?: Expectations
  ) => {
    return await this._post<InsertWorkspaceAppResponse>("/api/workspaceApp", {
      body: app,
      expectations: {
        status: 201,
        ...expectations,
      },
    })
  }
}
