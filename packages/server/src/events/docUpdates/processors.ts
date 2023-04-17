import userGroupProcessor from "./syncUsers"
import { docUpdates } from "@budibase/backend-core"

export type UpdateCallback = (docId: string) => void

export function init(updateCb?: UpdateCallback) {
  const processors = [userGroupProcessor(updateCb)]
  docUpdates.init(processors)
}
