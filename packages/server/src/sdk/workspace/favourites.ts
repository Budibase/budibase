import { context, db as dbCore, docIds } from "@budibase/backend-core"
import { WithoutDocMetadata, WorkspaceFavourite } from "@budibase/types"

async function fetchAll(): Promise<WorkspaceFavourite[]> {
  const db = context.getWorkspaceDB()

  const response = await db.allDocs<WorkspaceFavourite>(
    docIds.getWorkspaceFavouriteParams(null, { include_docs: true })
  )

  return response.rows
    .map(row => row.doc)
    .filter((doc): doc is WorkspaceFavourite => !!doc)
}

export async function fetch(userId?: string): Promise<WorkspaceFavourite[]> {
  const favourites = await fetchAll()
  return userId
    ? favourites.filter(favourite => favourite.createdBy === userId)
    : favourites
}

export async function create(
  workspaceFavourite: WithoutDocMetadata<WorkspaceFavourite>
): Promise<WorkspaceFavourite> {
  const db = context.getWorkspaceDB()

  const response = await db.put({
    _id: dbCore.generateWorkspaceFavouriteID(),
    ...workspaceFavourite,
  })
  return {
    ...workspaceFavourite,
    _id: response.id!,
    _rev: response.rev!,
  }
}

export async function remove(favouriteId: string, favouriteRev: string) {
  const db = context.getWorkspaceDB()
  // check the user.
  return await db.remove(favouriteId, favouriteRev)
}

export async function findByResourceId(resourceId: string) {
  const favourites = await fetchAll()
  return favourites
    .filter(favourite => favourite.resourceId === resourceId)
    .slice(0, 1)
}
