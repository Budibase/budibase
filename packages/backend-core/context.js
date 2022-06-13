const {
  getAppDB,
  getDevAppDB,
  getProdAppDB,
  getAppId,
  updateAppId,
  doInAppContext,
  doInTenant,
} = require("./src/context")

const identity = require("./src/context/identity")

module.exports = {
  getAppDB,
  getDevAppDB,
  getProdAppDB,
  getAppId,
  updateAppId,
  doInAppContext,
  doInTenant,
  identity,
}
