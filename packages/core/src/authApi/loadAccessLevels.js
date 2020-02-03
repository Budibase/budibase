import { ACCESS_LEVELS_FILE } from "./authCommon"
import { apiWrapper, events } from "../common"
import { permission } from "./permissions"

export const loadAccessLevels = app => async () =>
  apiWrapper(
    app,
    events.authApi.loadAccessLevels,
    permission.listAccessLevels.isAuthorized,
    {},
    _loadAccessLevels,
    app
  )

export const _loadAccessLevels = async app =>
  await app.datastore.loadJson(ACCESS_LEVELS_FILE)
