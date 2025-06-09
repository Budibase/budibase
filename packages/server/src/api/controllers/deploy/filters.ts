import PouchDB from "pouchdb"
import {
  Document,
  DocumentType,
  ResourceType,
  SEPARATOR,
  UsedResource,
} from "@budibase/types"
import sdk from "../../../sdk"

type Filter = PouchDB.Replication.ReplicateOptions["filter"]

const AUTOMATION_ID_FORMAT = DocumentType.AUTOMATION + SEPARATOR,
  SCREEN_ID_FORMAT = DocumentType.SCREEN + SEPARATOR,
  WORKSPACE_APP_ID_FORMAT = DocumentType.WORKSPACE + SEPARATOR,
  TABLE_ID_FORMAT = DocumentType.TABLE + SEPARATOR,
  DATASOURCE_ID_FORMAT = DocumentType.DATASOURCE + SEPARATOR,
  ROW_ACTION_ID_FORMAT = DocumentType.ROW_ACTIONS + SEPARATOR,
  QUERY_ID_FORMAT = DocumentType.QUERY + SEPARATOR

function getSpecificResourceIDs(
  type: ResourceType,
  resources: UsedResource[]
): string[] {
  return resources
    .filter(resource => resource.type === type)
    .map(resource => resource.id)
}

export async function buildPublishFilter(opts: {
  automationIds?: string[]
  workspaceAppIds?: string[]
}): Promise<Filter> {
  const resources = await sdk.resources.analyseAll(opts)
  const tableIds = getSpecificResourceIDs(ResourceType.TABLE, resources),
    datasourceIds = getSpecificResourceIDs(ResourceType.DATASOURCE, resources),
    rowActionIds = getSpecificResourceIDs(ResourceType.ROW_ACTION, resources),
    queryIds = getSpecificResourceIDs(ResourceType.QUERY, resources)
  return (doc: Document) => {
    if (opts?.automationIds && doc._id?.startsWith(AUTOMATION_ID_FORMAT)) {
      return opts.automationIds.includes(doc._id)
    } else if (
      opts?.workspaceAppIds &&
      (doc._id?.startsWith(SCREEN_ID_FORMAT) ||
        doc._id?.startsWith(WORKSPACE_APP_ID_FORMAT))
    ) {
      return opts.workspaceAppIds.includes(doc._id)
    } else if (doc._id?.startsWith(TABLE_ID_FORMAT)) {
      return tableIds.includes(doc._id)
    } else if (doc._id?.startsWith(DATASOURCE_ID_FORMAT)) {
      return datasourceIds.includes(doc._id)
    } else if (doc._id?.startsWith(ROW_ACTION_ID_FORMAT)) {
      return rowActionIds.includes(doc._id)
    } else if (doc._id?.startsWith(QUERY_ID_FORMAT)) {
      return queryIds.includes(doc._id)
    } else {
      return true
    }
  }
}
