import { context, db as coreDb } from "@budibase/backend-core"
import { ScreenRoutesViewOutput } from "@budibase/types"
import { getQueryIndex, UNICODE_MAX, ViewName } from "../../db/utils"
import { createRoutingView } from "../../db/views/staticViews"
import sdk from "../../sdk"

export async function getRoutingInfo(
  urlPath: string
): Promise<ScreenRoutesViewOutput[]> {
  const isDev = coreDb.isDevWorkspaceID(context.getWorkspaceId())
  const workspaceApp = await sdk.workspaceApps.getMatchedWorkspaceApp(urlPath)
  if (!workspaceApp) {
    return []
  }
  if (!isDev && workspaceApp?.disabled) {
    return []
  }

  const db = context.getWorkspaceDB()
  try {
    const result: ScreenRoutesViewOutput[] = []
    const allRouting = await db.query<ScreenRoutesViewOutput>(
      getQueryIndex(ViewName.ROUTING),
      {
        startkey: [workspaceApp._id, ""],
        endkey: [workspaceApp._id, UNICODE_MAX],
      }
    )
    result.push(...allRouting.rows.map(row => row.value))

    // Handling a bug where some screens have missing workspaceAppId (in this case, they are part of the default workspace app)
    if (workspaceApp.isDefault) {
      const screensWithMissingWorkspaceAppRouting =
        await db.query<ScreenRoutesViewOutput>(
          getQueryIndex(ViewName.ROUTING),
          {
            startkey: [null, ""],
            endkey: [null, UNICODE_MAX],
          }
        )

      const mappedRoutes = new Set(result.map(r => r._id!))
      result.push(
        ...screensWithMissingWorkspaceAppRouting.rows
          .filter(s => !mappedRoutes.has(s.id))
          .map(row => row.value)
      )
    }

    return result
  } catch (err: any) {
    // check if the view doesn't exist, it should for all new instances
    /* istanbul ignore next */
    if (
      err != null &&
      err.error === "not_found" &&
      err.reason === "missing_named_view"
    ) {
      await createRoutingView()
      return getRoutingInfo(urlPath)
    } else {
      throw err
    }
  }
}
