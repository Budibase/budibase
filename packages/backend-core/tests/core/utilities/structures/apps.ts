import { Workspace } from "@budibase/types"
import { generator } from "."
import { DEFAULT_TENANT_ID, DocumentType } from "../../../../src/constants"

export function app(id: string): Workspace {
  return {
    _id: DocumentType.WORKSPACE_METADATA,
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
