import { Template } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class TemplateAPI extends TestAPI {
  fetch = async (expectations?: Expectations): Promise<Template[]> => {
    return await this._get<Template[]>("/api/templates", { expectations })
  }
}
