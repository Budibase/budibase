import { UpdateNavigationRequest } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class NavigationAPI extends TestAPI {
  update = async (
    id: string,
    request: UpdateNavigationRequest,
    expectations?: Expectations
  ) => {
    return await this._put<void>(`/api/navigation/${id}`, {
      body: request,
      expectations: {
        status: 204,
        ...expectations,
      },
    })
  }
}
