import { generator } from "@budibase/backend-core/tests"
import { Installation } from "@budibase/types"

export function install(): Installation {
  return {
    _id: "install",
    installId: generator.guid(),
    version: generator.string()
  }
}