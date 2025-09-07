import { Workspace } from "@budibase/types"
import { WORKSPACE_DEV_PREFIX, WORKSPACE_PREFIX } from "../constants"

const NO_WORKSPACE_ERROR = "No app provided"

export function isDevWorkspaceID(workspaceId?: string) {
  if (!workspaceId) {
    throw NO_WORKSPACE_ERROR
  }
  return workspaceId.startsWith(WORKSPACE_DEV_PREFIX)
}

export function isProdWorkspaceID(workspaceId?: string) {
  if (!workspaceId) {
    throw NO_WORKSPACE_ERROR
  }
  return (
    workspaceId.startsWith(WORKSPACE_PREFIX) && !isDevWorkspaceID(workspaceId)
  )
}

export function isDevWorkspace(workspace: Workspace) {
  if (!workspace) {
    throw NO_WORKSPACE_ERROR
  }
  return isDevWorkspaceID(workspace.appId)
}

/**
 * Generates a development workspace ID from a real workspace ID.
 * @returns the dev workspace ID which can be used for dev database.
 */
export function getDevWorkspaceID(workspaceId: string) {
  if (!workspaceId || workspaceId.startsWith(WORKSPACE_DEV_PREFIX)) {
    return workspaceId
  }
  // split to take off the app_ element, then join it together incase any other app_ exist
  const split = workspaceId.split(WORKSPACE_PREFIX)
  split.shift()
  const rest = split.join(WORKSPACE_PREFIX)
  return `${WORKSPACE_DEV_PREFIX}${rest}`
}

/**
 * Convert a development workspace ID to a deployed workspace ID.
 */
export function getProdWorkspaceID(workspaceId: string) {
  if (!workspaceId || !workspaceId.startsWith(WORKSPACE_DEV_PREFIX)) {
    return workspaceId
  }
  // split to take off the app_dev element, then join it together incase any other app_ exist
  const split = workspaceId.split(WORKSPACE_DEV_PREFIX)
  split.shift()
  const rest = split.join(WORKSPACE_DEV_PREFIX)
  return `${WORKSPACE_PREFIX}${rest}`
}
