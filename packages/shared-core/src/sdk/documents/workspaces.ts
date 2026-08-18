import { DocumentType, prefixed } from "@budibase/types"

const WORKSPACE_PREFIX = prefixed(DocumentType.WORKSPACE)
const WORKSPACE_DEV_PREFIX = prefixed(DocumentType.WORKSPACE_DEV)

export function getDevWorkspaceID(workspaceId: string) {
  if (!workspaceId) {
    throw new Error("No workspace ID provided")
  }
  if (workspaceId.startsWith(WORKSPACE_DEV_PREFIX)) {
    return workspaceId
  }
  // Split to remove the workspace prefix, then join it back in case it appears elsewhere.
  const split = workspaceId.split(WORKSPACE_PREFIX)
  split.shift()
  const rest = split.join(WORKSPACE_PREFIX)
  return `${WORKSPACE_DEV_PREFIX}${rest}`
}

/**
 * Convert a development workspace ID to a deployed workspace ID.
 */
export function getProdWorkspaceID(workspaceId: string) {
  if (!workspaceId) {
    throw new Error("No workspace ID provided")
  }
  if (!workspaceId.startsWith(WORKSPACE_DEV_PREFIX)) {
    return workspaceId
  }
  // Split to remove the development prefix, then join it back in case it appears elsewhere.
  const split = workspaceId.split(WORKSPACE_DEV_PREFIX)
  split.shift()
  const rest = split.join(WORKSPACE_DEV_PREFIX)
  return `${WORKSPACE_PREFIX}${rest}`
}
