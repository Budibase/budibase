import { createRoutingView } from "../../db/views/staticViews"
import { ViewName, getQueryIndex, UNICODE_MAX } from "../../db/utils"
import { context } from "@budibase/backend-core"
import { ScreenRoutesViewOutput } from "@budibase/types"
import sdk from "../../sdk"

export async function getRoutingInfo(
  urlPath: string
): Promise<ScreenRoutesViewOutput[]> {
  const workspaceApps = await sdk.workspaceApps.getMatchedWorkspaceApp(urlPath)
  if (!workspaceApps.length) {
    return []
  }
  const db = context.getAppDB()
  try {
    const result: ScreenRoutesViewOutput[] = []
    for (const workspaceApp of workspaceApps) {
      if (workspaceApp.disabled) {
        continue
      }
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
