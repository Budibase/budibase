const CouchDB = require("../db")
const { createRoutingView } = require("./routingUtils")
const { ViewNames, getQueryIndex } = require("../db/utils")

exports.getRoutingInfo = async appId => {
  const db = new CouchDB(appId)
  try {
    const allRouting = await db.query(getQueryIndex(ViewNames.ROUTING))
    return allRouting.rows.map(row => row.value)
  } catch (err) {
    // check if the view doesn't exist, it should for all new instances
    if (err != null && err.name === "not_found") {
      await createRoutingView(appId)
      return exports.getRoutingInfo(appId)
    } else {
      throw err
    }
  }
}
