import { apiWrapperSync, events } from "../common"
import { permission } from "./permissions"

export const getNewUser = app => () =>
  apiWrapperSync(
    app,
    events.authApi.getNewUser,
    permission.createUser.isAuthorized,
    {},
    _getNewUser,
    app
  )

export const _getNewUser = () => ({
  name: "",
  accessLevels: [],
  enabled: true,
  temporaryAccessId: "",
})

export const getNewUserAuth = app => () =>
  apiWrapperSync(
    app,
    events.authApi.getNewUserAuth,
    permission.createUser.isAuthorized,
    {},
    _getNewUserAuth,
    app
  )

export const _getNewUserAuth = () => ({
  passwordHash: "",
  temporaryAccessHash: "",
  temporaryAccessExpiryEpoch: 0,
})
