import { docUpdates } from "@budibase/backend-core"
import userGroupProcessor from "./syncUsers"

export type UpdateCallback = (docId: string) => void
let started = false

export function init(updateCb?: UpdateCallback) {
  if (started) {
    return
  }
  const processors = [userGroupProcessor(updateCb)]
  docUpdates.init(processors)
  started = true
}
