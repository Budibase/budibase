const CouchDB = require("../../db")
const { createRoutingView } = require("../../db/views/staticViews")
const { ViewNames, getQueryIndex, UNICODE_MAX } = require("../../db/utils")

exports.getRoutingInfo = async appId => {
  const db = new CouchDB(appId)
  try {
    const allRouting = await db.query(getQueryIndex(ViewNames.ROUTING), {
      startKey: "",
      endKey: UNICODE_MAX,
    })
    return allRouting.rows.map(row => row.value)
  } catch (err) {
    // check if the view doesn't exist, it should for all new instances
    /* istanbul ignore next */
    if (err != null && err.name === "not_found") {
      await createRoutingView(appId)
      return exports.getRoutingInfo(appId)
    } else {
      throw err
    }
  }
}

exports.createRoutingView = createRoutingView
