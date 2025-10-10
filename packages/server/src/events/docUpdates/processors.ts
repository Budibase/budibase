import { docUpdates } from "@budibase/backend-core"
import userGroupProcessor from "./syncUsers"
import workspaceResourceProcessor from "./workspaceFavourites"

let started = false

export function init() {
  if (started) {
    return
  }
  const processors = [userGroupProcessor(), workspaceResourceProcessor()]
  docUpdates.init(processors)
  started = true
}
