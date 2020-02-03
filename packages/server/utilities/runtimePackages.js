const { join } = require("path")
const { isString, last } = require("lodash/fp")
const { common } = require("@budibase/core")
const runtimePackagesDirectory = "./runtime_apps"
const LATEST_VERSIONID = "##LATEST##"
const { $, splitKey } = common

const getRuntimeAppsDirectory = appName =>
  join(runtimePackagesDirectory, appName)

const getLatestDirectory = (appContext, appname) =>
  join(appContext.config.latestPackagesFolder, appname)

module.exports.LATEST_VERSIONID = LATEST_VERSIONID

module.exports.runtimePackagesDirectory = runtimePackagesDirectory

module.exports.getRuntimePackageDirectory = (appContext, appName, versionId) =>
  versionId === LATEST_VERSIONID
    ? getLatestDirectory(appContext, appName)
    : join(getRuntimeAppsDirectory(appName), versionId)

module.exports.getRuntimeAppsDirectory = getRuntimeAppsDirectory

// the point of this in mainly to support running in dev
// i.e. if no "versions" are in use, then it will route
// to the latest package
module.exports.determineVersionId = version => {
  let versionKey = isString(version) ? version : null

  if (!versionKey && version && version.key) versionKey = version.key

  return versionKey ? $(versionKey, [splitKey, last]) : LATEST_VERSIONID
}
