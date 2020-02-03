import { getNodeForCollectionPath } from "../templateApi/hierarchy"
import { isNothing, safeKey, apiWrapperSync, events } from "../common"
import { alwaysAuthorized } from "../authApi/permissions"

export const getAllowedRecordTypes = app => key =>
  apiWrapperSync(
    app,
    events.collectionApi.getAllowedRecordTypes,
    alwaysAuthorized,
    { key },
    _getAllowedRecordTypes,
    app,
    key
  )

const _getAllowedRecordTypes = (app, key) => {
  key = safeKey(key)
  const node = getNodeForCollectionPath(app.hierarchy)(key)
  return isNothing(node) ? [] : [node.name]
}
