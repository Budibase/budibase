import { Screen } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class ScreenAPI extends TestAPI {
  list = async (expectations?: Expectations): Promise<Screen[]> => {
    return await this._get<Screen[]>(`/api/screens`, { expectations })
  }

  save = async (
    screen: Screen,
    expectations?: Expectations
  ): Promise<Screen> => {
    return await this._post<Screen>(`/api/screens`, {
      expectations,
      body: screen,
    })
  }

  destroy = async (
    screenId: string,
    screenRev: string,
    expectations?: Expectations
  ): Promise<{ message: string }> => {
    return this._delete<{ message: string }>(
      `/api/screens/${screenId}/${screenRev}`,
      {
        expectations,
      }
    )
  }
}
