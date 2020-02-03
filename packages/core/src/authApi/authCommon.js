import { clone, find, split } from "lodash/fp"
import { joinKey, $ } from "../common"
// 5 minutes
export const tempCodeExpiryLength = 5 * 60 * 1000

export const AUTH_FOLDER = "/.auth"
export const USERS_LIST_FILE = joinKey(AUTH_FOLDER, "users.json")
export const userAuthFile = username =>
  joinKey(AUTH_FOLDER, `auth_${username}.json`)
export const USERS_LOCK_FILE = joinKey(AUTH_FOLDER, "users_lock")
export const ACCESS_LEVELS_FILE = joinKey(AUTH_FOLDER, "access_levels.json")
export const ACCESS_LEVELS_LOCK_FILE = joinKey(
  AUTH_FOLDER,
  "access_levels_lock"
)

export const permissionTypes = {
  CREATE_RECORD: "create record",
  UPDATE_RECORD: "update record",
  READ_RECORD: "read record",
  DELETE_RECORD: "delete record",
  READ_INDEX: "read index",
  MANAGE_INDEX: "manage index",
  MANAGE_COLLECTION: "manage collection",
  WRITE_TEMPLATES: "write templates",
  CREATE_USER: "create user",
  SET_PASSWORD: "set password",
  CREATE_TEMPORARY_ACCESS: "create temporary access",
  ENABLE_DISABLE_USER: "enable or disable user",
  WRITE_ACCESS_LEVELS: "write access levels",
  LIST_USERS: "list users",
  LIST_ACCESS_LEVELS: "list access levels",
  EXECUTE_ACTION: "execute action",
  SET_USER_ACCESS_LEVELS: "set user access levels",
}

export const getUserByName = (users, name) =>
  $(users, [find(u => u.name.toLowerCase() === name.toLowerCase())])

export const stripUserOfSensitiveStuff = user => {
  const stripped = clone(user)
  delete stripped.tempCode
  return stripped
}

export const parseTemporaryCode = fullCode =>
  $(fullCode, [
    split(":"),
    parts => ({
      id: parts[1],
      code: parts[2],
    }),
  ])
