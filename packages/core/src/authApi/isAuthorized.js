import { values, includes, some } from "lodash/fp"
import { permissionTypes } from "./authCommon"
import { $, isNothing, apiWrapperSync, events } from "../common"
import { getNodeByKeyOrNodeKey, isNode } from "../templateApi/hierarchy"
import { alwaysAuthorized } from "./permissions"

export const isAuthorized = app => (permissionType, resourceKey) =>
  apiWrapperSync(
    app,
    events.authApi.isAuthorized,
    alwaysAuthorized,
    { resourceKey, permissionType },
    _isAuthorized,
    app,
    permissionType,
    resourceKey
  )

export const _isAuthorized = (app, permissionType, resourceKey) => {
  if (!app.user) {
    return false
  }

  const validType = $(permissionTypes, [values, includes(permissionType)])

  if (!validType) {
    return false
  }

  const permMatchesResource = userperm => {
    const nodeKey = isNothing(resourceKey)
      ? null
      : isNode(app.hierarchy, resourceKey)
      ? getNodeByKeyOrNodeKey(app.hierarchy, resourceKey).nodeKey()
      : resourceKey

    return (
      userperm.type === permissionType &&
      (isNothing(resourceKey) || nodeKey === userperm.nodeKey)
    )
  }

  return $(app.user.permissions, [some(permMatchesResource)])
}
