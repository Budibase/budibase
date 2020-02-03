import { authenticate, authenticateTemporaryAccess } from "./authenticate"
import { createTemporaryAccess } from "./createTemporaryAccess"
import { createUser } from "./createUser"
import { enableUser, disableUser } from "./enableUser"
import { loadAccessLevels } from "./loadAccessLevels"
import { getNewAccessLevel } from "./getNewAccessLevel"
import { getNewUser, getNewUserAuth } from "./getNewUser"
import { getUsers } from "./getUsers"
import { isAuthorized } from "./isAuthorized"
import { saveAccessLevels } from "./saveAccessLevels"
import {
  changeMyPassword,
  scorePassword,
  setPasswordFromTemporaryCode,
  isValidPassword,
} from "./setPassword"
import { validateUser } from "./validateUser"
import { validateAccessLevels } from "./validateAccessLevels"
import { generateFullPermissions } from "./generateFullPermissions"
import { setUserAccessLevels } from "./setUserAccessLevels"

export const getAuthApi = app => ({
  authenticate: authenticate(app),
  authenticateTemporaryAccess: authenticateTemporaryAccess(app),
  createTemporaryAccess: createTemporaryAccess(app),
  createUser: createUser(app),
  loadAccessLevels: loadAccessLevels(app),
  enableUser: enableUser(app),
  disableUser: disableUser(app),
  getNewAccessLevel: getNewAccessLevel(app),
  getNewUser: getNewUser(app),
  getNewUserAuth: getNewUserAuth(app),
  getUsers: getUsers(app),
  saveAccessLevels: saveAccessLevels(app),
  isAuthorized: isAuthorized(app),
  changeMyPassword: changeMyPassword(app),
  setPasswordFromTemporaryCode: setPasswordFromTemporaryCode(app),
  scorePassword,
  isValidPassword: isValidPassword(app),
  validateUser: validateUser(app),
  validateAccessLevels: validateAccessLevels(app),
  generateFullPermissions: () => generateFullPermissions(app),
  setUserAccessLevels: setUserAccessLevels(app),
})

export default getAuthApi
