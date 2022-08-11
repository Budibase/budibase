const { createRoutingView } = require("../../db/views/staticViews")
const { ViewName, getQueryIndex, UNICODE_MAX } = require("../../db/utils")
const { getAppDB } = require("@budibase/backend-core/context")

exports.getRoutingInfo = async () => {
  const db = getAppDB()
  try {
    const allRouting = await db.query(getQueryIndex(ViewName.ROUTING), {
      startKey: "",
      endKey: UNICODE_MAX,
    })
    return allRouting.rows.map(row => row.value)
  } catch (err) {
    // check if the view doesn't exist, it should for all new instances
    /* istanbul ignore next */
    if (err != null && err.name === "not_found") {
      await createRoutingView()
      return exports.getRoutingInfo()
    } else {
      throw err
    }
  }
}

exports.createRoutingView = createRoutingView
