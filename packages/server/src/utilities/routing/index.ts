import { createRoutingView } from "../../db/views/staticViews"
import { ViewName, getQueryIndex, UNICODE_MAX } from "../../db/utils"
import { context } from "@budibase/backend-core"
import { ScreenRoutesViewOutput } from "@budibase/types"

export async function getRoutingInfo(): Promise<ScreenRoutesViewOutput[]> {
  const db = context.getAppDB()
  try {
    const allRouting = await db.query<ScreenRoutesViewOutput>(
      getQueryIndex(ViewName.ROUTING),
      {
        startkey: "",
        endkey: UNICODE_MAX,
      }
    )
    return allRouting.rows.map(row => row.value)
  } catch (err: any) {
    // check if the view doesn't exist, it should for all new instances
    /* istanbul ignore next */
    if (err != null && err.name === "not_found") {
      await createRoutingView()
      return getRoutingInfo()
    } else {
      throw err
    }
  }
}
