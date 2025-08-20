import { context, db as dbCore } from "@budibase/backend-core"
import {
  SEPARATOR,
  WithoutDocMetadata,
  WorkspaceFavourite,
  DocumentType,
} from "@budibase/types"

export async function fetch(userId?: string): Promise<WorkspaceFavourite[]> {
  const db = context.getAppDB()

  const userFavourites = await db.find<WorkspaceFavourite>({
    selector: {
      _id: {
        $regex: `^${DocumentType.WORKSPACE_FAVOURITE}${SEPARATOR}`,
      },
      ...(userId ? { createdBy: userId } : {}),
    },
  })

  return userFavourites.docs
}

export async function create(
  workspaceFavourite: WithoutDocMetadata<WorkspaceFavourite>
): Promise<WorkspaceFavourite> {
  const db = context.getAppDB()

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
  const db = context.getAppDB()
  // check the user.
  return await db.remove(favouriteId, favouriteRev)
}

export async function findByResourceId(resourceId: string) {
  const db = context.getAppDB()
  const existingFavourites = await db.find<WorkspaceFavourite>({
    selector: {
      _id: {
        $regex: `^${DocumentType.WORKSPACE_FAVOURITE}${SEPARATOR}`,
      },
      resourceId: resourceId,
    },
    limit: 1,
  })

  return existingFavourites.docs
}
