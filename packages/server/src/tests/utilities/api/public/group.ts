import type { components } from "../../../../definitions/openapi"
import { type Expectations, PublicAPI } from "../base"

type UserGroupList = components["schemas"]["userGroupList"]

export class GroupPublicAPI extends PublicAPI {
  list = async ({
    workspaceId = this.config.getDevWorkspaceId(),
    expectations,
  }: {
    workspaceId?: string
    expectations?: Expectations
  } = {}) => {
    const response = await this._get<UserGroupList>(
      `/workspaces/${workspaceId}/groups`,
      {
        headers: { "x-budibase-app-id": workspaceId },
        expectations,
      }
    )
    return response.data
  }
}
