import { find, filter, some, map, flatten } from "lodash/fp"
import { generate } from "shortid"
import { _getUsers } from "./getUsers"
import { getUserByName, userAuthFile, parseTemporaryCode } from "./authCommon"
import { _loadAccessLevels } from "./loadAccessLevels"
import { isNothingOrEmpty, $, apiWrapper, events } from "../common"
import { alwaysAuthorized } from "./permissions"

const dummyHash =
  "$argon2i$v=19$m=4096,t=3,p=1$UZRo409UYBGjHJS3CV6Uxw$rU84qUqPeORFzKYmYY0ceBLDaPO+JWSH4PfNiKXfIKk"

export const authenticate = app => async (username, password) =>
  apiWrapper(
    app,
    events.authApi.authenticate,
    alwaysAuthorized,
    { username, password },
    _authenticate,
    app,
    username,
    password
  )

export const _authenticate = async (app, username, password) => {
  if (isNothingOrEmpty(username) || isNothingOrEmpty(password)) {
    return null
  }

  const allUsers = await _getUsers(app)
  let user = getUserByName(allUsers, username)

  const notAUser = "not-a-user"
  // continue with non-user - so time to verify remains consistent
  // with verification of a valid user
  if (!user || !user.enabled) {
    user = notAUser
  }

  let userAuth
  try {
    userAuth = await app.datastore.loadJson(userAuthFile(username))
  } catch (_) {
    userAuth = { accessLevels: [], passwordHash: dummyHash }
  }

  const permissions = await buildUserPermissions(app, user.accessLevels)

  const verified = app.crypto.verify(userAuth.passwordHash, password)

  if (user === notAUser) {
    return null
  }

  return verified
    ? {
        ...user,
        permissions,
        temp: false,
        isUser: true,
      }
    : null
}

export const authenticateTemporaryAccess = app => async tempAccessCode => {
  if (isNothingOrEmpty(tempAccessCode)) {
    return null
  }

  const temp = parseTemporaryCode(tempAccessCode)
  let user = $(await _getUsers(app), [
    find(u => u.temporaryAccessId === temp.id),
  ])

  const notAUser = "not-a-user"
  if (!user || !user.enabled) {
    user = notAUser
  }

  let userAuth
  try {
    userAuth = await app.datastore.loadJson(userAuthFile(user.name))
  } catch (e) {
    userAuth = {
      temporaryAccessHash: dummyHash,
      temporaryAccessExpiryEpoch: (await app.getEpochTime()) + 10000,
    }
  }

  if (userAuth.temporaryAccessExpiryEpoch < (await app.getEpochTime())) {
    user = notAUser
  }

  const tempCode = !temp.code ? generate() : temp.code
  const verified = app.crypto.verify(userAuth.temporaryAccessHash, tempCode)

  if (user === notAUser) {
    return null
  }

  return verified
    ? {
        ...user,
        permissions: [],
        temp: true,
        isUser: true,
      }
    : null
}

export const buildUserPermissions = async (app, userAccessLevels) => {
  const allAccessLevels = await _loadAccessLevels(app)

  return $(allAccessLevels.levels, [
    filter(l => some(ua => l.name === ua)(userAccessLevels)),
    map(l => l.permissions),
    flatten,
  ])
}
