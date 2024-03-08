import { Expectations, TestAPI } from "./base"
import { Row } from "@budibase/types"

export class LegacyViewAPI extends TestAPI {
  get = async (id: string, expectations?: Expectations) => {
    return await this._get<Row[]>(`/api/views/${id}`, { expectations })
  }
}
