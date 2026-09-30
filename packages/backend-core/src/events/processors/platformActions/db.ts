import { SEPARATOR } from "@budibase/types"
import type { Database } from "@budibase/types"
import * as context from "../../../context"
import { getDB } from "../../../db/db"
import { getProdWorkspaceID } from "../../../docIds/conversions"

const ACTIONS_DB_PREFIX = "actions"

/**
 * Actions are persisted once per workspace, shared by its dev and prod
 * environments.
 */
export function getActionsDbName(workspaceId: string): string {
  return `${ACTIONS_DB_PREFIX}${SEPARATOR}${getProdWorkspaceID(workspaceId)}`
}

export function getActionsDB(): Database {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Unable to retrieve actions DB - no workspace ID.")
  }
  if (context.isSelfHostUsingCloud()) {
    throw new Error(
      "Actions DB not found - self-host users using cloud don't have Actions DBs"
    )
  }
  return getDB(getActionsDbName(workspaceId))
}
