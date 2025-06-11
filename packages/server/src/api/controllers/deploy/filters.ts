import PouchDB from "pouchdb"
import {
  Document,
  DocumentType,
  ResourceType,
  Screen,
  SEPARATOR,
} from "@budibase/types"
import sdk from "../../../sdk"

/********************************************************************
 *                                                                  *
 *      This file contains filters that will be used in PouchDB     *
 *      and CouchDB directly. Do not use functions outside this     *
 *      file as part of the returned filter function as this        *
 *      ties those functions to being used/accessible in the        *
 *      PouchDB/CouchDB environments (keep these simple)            *
 *                                                                  *
 ********************************************************************/

type Filter = PouchDB.Replication.ReplicateOptions["filter"]

const AUTOMATION_ID_FORMAT = DocumentType.AUTOMATION + SEPARATOR,
  SCREEN_ID_FORMAT = DocumentType.SCREEN + SEPARATOR,
  WORKSPACE_APP_ID_FORMAT = DocumentType.WORKSPACE + SEPARATOR,
  TABLE_ID_FORMAT = DocumentType.TABLE + SEPARATOR,
  DATASOURCE_ID_FORMAT = DocumentType.DATASOURCE + SEPARATOR,
  ROW_ACTION_ID_FORMAT = DocumentType.ROW_ACTIONS + SEPARATOR,
  QUERY_ID_FORMAT = DocumentType.QUERY + SEPARATOR

export async function buildPublishFilter(opts: {
  automationIds?: string[]
  workspaceAppIds?: string[]
}): Promise<Filter> {
  const resources = await sdk.resources.searchForUsages(
    [
      ResourceType.TABLE,
      ResourceType.DATASOURCE,
      ResourceType.QUERY,
      ResourceType.ROW_ACTION,
    ],
    opts
  )
  const getSpecificResourceIDs = (type: ResourceType) => {
    return resources
      .filter(resource => resource.type === type)
      .map(resource => resource.id)
  }
  const tableIds = getSpecificResourceIDs(ResourceType.TABLE),
    datasourceIds = getSpecificResourceIDs(ResourceType.DATASOURCE),
    rowActionIds = getSpecificResourceIDs(ResourceType.ROW_ACTION),
    queryIds = getSpecificResourceIDs(ResourceType.QUERY)
  const automationIds = (opts.automationIds || []).concat(
    getSpecificResourceIDs(ResourceType.AUTOMATION)
  )
  const workspaceAppIds = opts.workspaceAppIds || []
  return (doc: Document) => {
    if (doc._id?.startsWith(AUTOMATION_ID_FORMAT)) {
      return automationIds.includes(doc._id)
    } else if (doc._id?.startsWith(SCREEN_ID_FORMAT)) {
      const screen = doc as Screen
      return (
        screen.workspaceAppId && workspaceAppIds.includes(screen.workspaceAppId)
      )
    } else if (doc._id?.startsWith(WORKSPACE_APP_ID_FORMAT)) {
      return workspaceAppIds.includes(doc._id)
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
