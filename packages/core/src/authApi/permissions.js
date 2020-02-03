import { permissionTypes } from "./authCommon"
import { isAuthorized } from "./isAuthorized"

export const temporaryAccessPermissions = () => [
  { type: permissionTypes.SET_PASSWORD },
]

const nodePermission = type => ({
  add: (nodeKey, accessLevel) =>
    accessLevel.permissions.push({ type, nodeKey }),
  isAuthorized: resourceKey => app => isAuthorized(app)(type, resourceKey),
  isNode: true,
  get: nodeKey => ({ type, nodeKey }),
})

const staticPermission = type => ({
  add: accessLevel => accessLevel.permissions.push({ type }),
  isAuthorized: app => isAuthorized(app)(type),
  isNode: false,
  get: () => ({ type }),
})

const createRecord = nodePermission(permissionTypes.CREATE_RECORD)

const updateRecord = nodePermission(permissionTypes.UPDATE_RECORD)

const deleteRecord = nodePermission(permissionTypes.DELETE_RECORD)

const readRecord = nodePermission(permissionTypes.READ_RECORD)

const writeTemplates = staticPermission(permissionTypes.WRITE_TEMPLATES)

const createUser = staticPermission(permissionTypes.CREATE_USER)

const setPassword = staticPermission(permissionTypes.SET_PASSWORD)

const readIndex = nodePermission(permissionTypes.READ_INDEX)

const manageIndex = staticPermission(permissionTypes.MANAGE_INDEX)

const manageCollection = staticPermission(permissionTypes.MANAGE_COLLECTION)

const createTemporaryAccess = staticPermission(
  permissionTypes.CREATE_TEMPORARY_ACCESS
)

const enableDisableUser = staticPermission(permissionTypes.ENABLE_DISABLE_USER)

const writeAccessLevels = staticPermission(permissionTypes.WRITE_ACCESS_LEVELS)

const listUsers = staticPermission(permissionTypes.LIST_USERS)

const listAccessLevels = staticPermission(permissionTypes.LIST_ACCESS_LEVELS)

const setUserAccessLevels = staticPermission(
  permissionTypes.SET_USER_ACCESS_LEVELS
)

const executeAction = nodePermission(permissionTypes.EXECUTE_ACTION)

export const alwaysAuthorized = () => true

export const permission = {
  createRecord,
  updateRecord,
  deleteRecord,
  readRecord,
  writeTemplates,
  createUser,
  setPassword,
  readIndex,
  createTemporaryAccess,
  enableDisableUser,
  writeAccessLevels,
  listUsers,
  listAccessLevels,
  manageIndex,
  manageCollection,
  executeAction,
  setUserAccessLevels,
}
