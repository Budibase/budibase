import { Database, Workspace } from "@budibase/types"
import { DocumentType, doWithDB } from "../db"
import { getWorkspaceClient } from "../redis/init"

export enum WorkspaceState {
  INVALID = "invalid",
}

export interface DeletedWorkspace {
  state: WorkspaceState
}

const EXPIRY_SECONDS = 3600
const INVALID_EXPIRY_SECONDS = 60

/**
 * The default populate workspace metadata function
 */
async function populateFromDB(workspaceId: string) {
  return doWithDB(
    workspaceId,
    (db: Database) => {
      return db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
    },
    { skip_setup: true }
  )
}

function isInvalid(metadata?: { state: string }) {
  return !metadata || metadata.state === WorkspaceState.INVALID
}

/**
 * Get the requested workspace metadata by id.
 * Use redis cache to first read the workspace metadata.
 * If not present fallback to loading the workspace metadata directly and re-caching.
 * @param workspaceId the id of the workspace to get metadata from.
 * @returns the workspace metadata.
 */
export async function getWorkspaceMetadata(
  workspaceId: string
): Promise<Workspace | DeletedWorkspace> {
  const client = await getWorkspaceClient()
  // try cache
  let metadata = await client.get(workspaceId)
  if (!metadata) {
    let expiry: number | undefined = EXPIRY_SECONDS
    try {
      metadata = await populateFromDB(workspaceId)
    } catch (err: any) {
      // workspace DB left around, but no metadata, it is invalid
      if (err && err.status === 404) {
        metadata = { state: WorkspaceState.INVALID }
        // expire invalid workspaces regularly, in-case it was only briefly invalid
        expiry = INVALID_EXPIRY_SECONDS
      } else {
        throw err
      }
    }
    // needed for some scenarios where the caching happens
    // so quickly the requests can get slightly out of sync
    // might store its invalid just before it stores its valid
    if (isInvalid(metadata)) {
      const temp = await client.get(workspaceId)
      if (temp) {
        metadata = temp
      }
    }
    await client.store(workspaceId, metadata, expiry)
  }

  return metadata
}

/**
 * Invalidate/reset the cached metadata when a change occurs in the db.
 * @param workspaceId the cache key to bust/update.
 * @param newMetadata optional - can simply provide the new metadata to update with.
 * @return will respond with success when cache is updated.
 */
export async function invalidateWorkspaceMetadata(
  workspaceId: string,
  newMetadata?: any
) {
  if (!workspaceId) {
    throw "Cannot invalidate if no app ID provided."
  }
  const client = await getWorkspaceClient()
  await client.delete(workspaceId)
  if (newMetadata) {
    await client.store(workspaceId, newMetadata, EXPIRY_SECONDS)
  }
}
