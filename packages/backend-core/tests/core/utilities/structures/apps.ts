import { generator } from "."
import { App } from "@budibase/types"
import { DEFAULT_TENANT_ID, DocumentType } from "../../../../src/constants"

export function app(id: string): App {
  return {
    _id: DocumentType.APP_METADATA,
    appId: id,
    type: "",
    version: "0.0.1",
    componentLibraries: [],
    name: generator.name(),
    url: `/custom-url`,
    instance: {
      _id: id,
    },
    tenantId: DEFAULT_TENANT_ID,
    status: "",
    template: undefined,
  }
}
