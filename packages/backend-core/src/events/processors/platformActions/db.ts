import { LockName, LockType, SEPARATOR } from "@budibase/types"
import type { Database } from "@budibase/types"
import * as context from "../../../context"
import { getDB } from "../../../db/db"
import { dbExists } from "../../../db/utils"
import {
  getDevWorkspaceID,
  getProdWorkspaceID,
} from "../../../docIds/conversions"
import * as locks from "../../../redis/redlockImpl"

const ACTIONS_DB_PREFIX = "actions"
const WRITE_LOCK_TTL_MS = 10000

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

interface ActionsWorkspaceLockInput<T> {
  workspaceId: string
  task: () => Promise<T>
}

// Dev and prod writers and workspace/tenant deletion must contend for the
// same lock, so it is keyed by the prod workspace ID and not scoped to the
// tenant in context.
const getActionsWorkspaceLockResource = (workspaceId: string) =>
  getProdWorkspaceID(workspaceId)

export const doWithActionsWorkspaceWriteLock = async <T>({
  workspaceId,
  task,
}: ActionsWorkspaceLockInput<T>): Promise<T> => {
  const { result } = await locks.doWithLock(
    {
      type: LockType.DEFAULT,
      name: LockName.PLATFORM_ACTIONS_WORKSPACE,
      resource: getActionsWorkspaceLockResource(workspaceId),
      systemLock: true,
      ttl: WRITE_LOCK_TTL_MS,
    },
    task
  )
  return result
}

/**
 * Runs an Actions write only while the workspace still exists, returning
 * whether it ran. CouchDB creates missing databases on write, so a late
 * writer would otherwise recreate the Actions DB of a deleted workspace. The
 * dev workspace DB is the reference because prod is absent until publish.
 */
export const doWithExistingActionsWorkspace = async (
  task: () => Promise<void>
): Promise<boolean> => {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Unable to write to actions DB - no workspace ID.")
  }
  return await doWithActionsWorkspaceWriteLock({
    workspaceId,
    task: async () => {
      if (!(await dbExists(getDevWorkspaceID(workspaceId)))) {
        return false
      }
      await task()
      return true
    },
  })
}

export const doWithActionsWorkspaceDeletionLock = async <T>({
  workspaceId,
  task,
}: ActionsWorkspaceLockInput<T>): Promise<T> => {
  const { result } = await locks.doWithLock(
    {
      type: LockType.AUTO_EXTEND,
      name: LockName.PLATFORM_ACTIONS_WORKSPACE,
      resource: getActionsWorkspaceLockResource(workspaceId),
      systemLock: true,
    },
    task
  )
  return result
}
