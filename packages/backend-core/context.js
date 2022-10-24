const {
  getAppDB,
  getDevAppDB,
  getProdAppDB,
  getAppId,
  getProdAppId,
  updateAppId,
  doInAppContext,
  doInTenant,
  doInContext,
} = require("./src/context")

const identity = require("./src/context/identity")

module.exports = {
  getAppDB,
  getDevAppDB,
  getProdAppDB,
  getAppId,
  getProdAppId,
  updateAppId,
  doInAppContext,
  doInTenant,
  identity,
  doInContext,
}
