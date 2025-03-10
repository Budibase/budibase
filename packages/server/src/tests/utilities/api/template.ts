import type { Template } from "@budibase/types"
import type { Expectations } from "./base"
import { TestAPI } from "./base"

export class TemplateAPI extends TestAPI {
  fetch = async (expectations?: Expectations): Promise<Template[]> => {
    return await this._get<Template[]>("/api/templates", { expectations })
  }
}
