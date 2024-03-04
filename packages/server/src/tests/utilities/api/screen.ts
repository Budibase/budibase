import { Screen } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class ScreenAPI extends TestAPI {
  list = async (expectations?: Expectations): Promise<Screen[]> => {
    return await this._get<Screen[]>(`/api/screens`, { expectations })
  }
}
