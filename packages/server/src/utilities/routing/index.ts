import { createRoutingView } from "../../db/views/staticViews"
import { ViewName, getQueryIndex, UNICODE_MAX } from "../../db/utils"
import { context, features } from "@budibase/backend-core"
import { FeatureFlag, ScreenRoutesViewOutput } from "@budibase/types"
import sdk from "../../sdk"

export async function getRoutingInfo(
  urlPath: string
): Promise<ScreenRoutesViewOutput[]> {
  const workspaceApp = await sdk.workspaceApps.getMatchedWorkspaceApp(urlPath)
  const db = context.getAppDB()
  try {
    const workspaceAppsEnabled = await features.isEnabled(
      FeatureFlag.WORKSPACE_APPS
    )
    const allRouting = await db.query<ScreenRoutesViewOutput>(
      getQueryIndex(ViewName.ROUTING),
      {
        startkey: workspaceAppsEnabled ? [workspaceApp?._id, ""] : "",
        endkey: workspaceAppsEnabled
          ? [workspaceApp?._id, UNICODE_MAX]
          : UNICODE_MAX,
      }
    )
    return allRouting.rows.map(row => row.value)
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
