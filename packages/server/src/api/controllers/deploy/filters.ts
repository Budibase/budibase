import PouchDB from "pouchdb"
import { Document, DocumentType, SEPARATOR } from "@budibase/types"

type Filter = PouchDB.Replication.ReplicateOptions["filter"]

export function buildPublishFilter(opts?: {
  automationIds?: string[]
  workspaceAppIds?: string[]
  resourceIds?: string[]
}): Filter {
  const autoIdFormat = DocumentType.AUTOMATION + SEPARATOR,
    screenIdFormat = DocumentType.SCREEN + SEPARATOR,
    workspaceAppIdFormat = DocumentType.WORKSPACE + SEPARATOR
  return (doc: Document) => {
    if (opts?.automationIds && doc._id?.startsWith(autoIdFormat)) {
      return opts.automationIds.includes(doc._id)
    } else if (
      opts?.workspaceAppIds &&
      (doc._id?.startsWith(screenIdFormat) ||
        doc._id?.startsWith(workspaceAppIdFormat))
    ) {
      return opts.workspaceAppIds.includes(doc._id)
    } else {
      return true
    }
  }
}
