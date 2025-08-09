import {
  AddWorkspaceFavouriteRequest,
  AddWorkspaceFavouriteResponse,
  Automation,
  Datasource,
  DeleteWorkspaceFavouriteResponse,
  Query,
  Table,
  UserCtx,
  ViewV2,
  WithoutDocMetadata,
  WorkspaceApp,
  WorkspaceFavourite,
  WorkspaceFavouriteResponse,
  WorkspaceResource,
} from "@budibase/types"
import sdk from "../../sdk"
import { db } from "@budibase/backend-core"

type WorkspaceResourceDoc =
  | Table
  | Automation
  | WorkspaceApp
  | Datasource
  | Query
  | ViewV2

export type ResourceGetter = (
  id: string
) => Promise<WorkspaceResourceDoc | undefined>

export async function fetch(ctx: UserCtx<void, WorkspaceFavouriteResponse>) {
  const createdBy = ctx.user?._id!

  const favourites = await sdk.workspace.fetch(
    db.getGlobalIDFromUserMetadataID(createdBy)
  )
  ctx.body = {
    favourites,
  }
}

export async function create(
  ctx: UserCtx<AddWorkspaceFavouriteRequest, AddWorkspaceFavouriteResponse>
) {
  const { body } = ctx.request
  const createdBy = ctx.user?._id!
  const globalId = db.getGlobalIDFromUserMetadataID(createdBy)

  const newFavourite: WithoutDocMetadata<WorkspaceFavourite> = {
    resourceType: body.resourceType,
    resourceId: body.resourceId,
    createdBy: globalId,
  }

  // Check if a favourite has been created for the resource
  const existing: WithoutDocMetadata<WorkspaceFavourite>[] =
    await sdk.workspace.findByResourceId(body.resourceId)
  if (existing.length) {
    const [favourite] = existing
    if (favourite.createdBy === globalId) {
      const dupeError = new Error(
        `Workspace favourite failure. Already exists: ${body.resourceId}`
      )
      ;(dupeError as any).status = 409
      throw dupeError
    }
  }

  const check: Record<WorkspaceResource, ResourceGetter> = {
    [WorkspaceResource.AUTOMATION]: sdk.automations.get,
    [WorkspaceResource.TABLE]: sdk.tables.getTable,
    [WorkspaceResource.WORKSPACE_APP]: sdk.workspaceApps.get,
    [WorkspaceResource.DATASOURCE]: sdk.datasources.get,
    [WorkspaceResource.QUERY]: sdk.queries.find,
    [WorkspaceResource.VIEW]: sdk.views.get,
  }

  const verifyResource: ResourceGetter = check[body.resourceType]

  // Bork if it can be verified
  if (!verifyResource)
    ctx.throw(
      `Workspace favourite failure. Could not verify resource ${body.resourceId}, ${body.resourceType}`
    )

  // Attempt to find the resource to ensure that it exists
  try {
    const doc = await verifyResource(body.resourceId)
    // tryGet doesnt throw so in the event that a resource doesn't throw, ensure it.
    if (!doc) {
      const notFoundError = new Error(`Resource not found: ${body.resourceId}`)
      ;(notFoundError as any).status = 404
      throw notFoundError
    }
  } catch (e: any) {
    if (e.status === 404) {
      ctx.throw(
        e.status,
        `Workspace favourite failure. Could not find target resource: ${body.resourceId}`
      )
    }
    throw new Error(e.message)
  }

  const workspaceFavourite = await sdk.workspace.create(newFavourite)
  ctx.status = 201
  ctx.body = {
    ...workspaceFavourite,
  } as AddWorkspaceFavouriteResponse
}

export async function destroy(
  ctx: UserCtx<void, DeleteWorkspaceFavouriteResponse>
) {
  const favouriteId = ctx.params.id
  const favouriteRev = ctx.params.rev

  ctx.body = await sdk.workspace.remove(favouriteId, favouriteRev)
}
