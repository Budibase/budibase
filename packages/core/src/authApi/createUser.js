import { join, some } from "lodash/fp"
import { validateUser } from "./validateUser"
import { getNewUserAuth } from "./getNewUser"
import {
  getLock,
  isNolock,
  releaseLock,
  apiWrapper,
  events,
  insensitiveEquals,
  isNonEmptyString,
} from "../common"
import {
  USERS_LOCK_FILE,
  stripUserOfSensitiveStuff,
  USERS_LIST_FILE,
  userAuthFile,
} from "./authCommon"
import { getTemporaryCode } from "./createTemporaryAccess"
import { isValidPassword } from "./setPassword"
import { permission } from "./permissions"
import { BadRequestError } from "../common/errors"

export const createUser = app => async (user, password = null) =>
  apiWrapper(
    app,
    events.authApi.createUser,
    permission.createUser.isAuthorized,
    { user, password },
    _createUser,
    app,
    user,
    password
  )

export const _createUser = async (app, user, password = null) => {
  const lock = await getLock(app, USERS_LOCK_FILE, 1000, 2)

  if (isNolock(lock)) {
    throw new Error("Unable to create user, could not get lock - try again")
  }

  const users = await app.datastore.loadJson(USERS_LIST_FILE)

  const userErrors = validateUser(app)([...users, user], user)
  if (userErrors.length > 0) {
    throw new BadRequestError(`User is invalid. ${join("; ")(userErrors.map(e => e.error))}`)
  }

  const { auth, tempCode, temporaryAccessId } = await getAccess(app, password)
  user.tempCode = tempCode
  user.temporaryAccessId = temporaryAccessId

  if (some(u => insensitiveEquals(u.name, user.name))(users)) {
    throw new BadRequestError("User already exists")
  }

  users.push(stripUserOfSensitiveStuff(user))

  await app.datastore.updateJson(USERS_LIST_FILE, users)

  try {
    await app.datastore.createJson(userAuthFile(user.name), auth)
  } catch (_) {
    await app.datastore.updateJson(userAuthFile(user.name), auth)
  }

  await releaseLock(app, lock)

  return user
}

const getAccess = async (app, password) => {
  const auth = getNewUserAuth(app)()

  if (isNonEmptyString(password)) {
    if (isValidPassword(password)) {
      auth.passwordHash = app.crypto.hash(password)
      auth.temporaryAccessHash = ""
      auth.temporaryAccessId = ""
      auth.temporaryAccessExpiryEpoch = 0
      return { auth }
    }
    throw new BadRequestError("Password does not meet requirements")
  } else {
    const tempAccess = await getTemporaryCode(app)
    auth.temporaryAccessHash = tempAccess.temporaryAccessHash
    auth.temporaryAccessExpiryEpoch = tempAccess.temporaryAccessExpiryEpoch
    auth.passwordHash = ""
    return {
      auth,
      tempCode: tempAccess.tempCode,
      temporaryAccessId: tempAccess.temporaryAccessId,
    }
  }
}
