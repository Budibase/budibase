const { resolve, join } = require("path")
const { getRuntimePackageDirectory } = require("../utilities/runtimePackages")
const injectPlugins = require("./injectedPlugins")
const { cwd } = require("process")

const appDefinitionPath = appPath => join(appPath, "appDefinition.json")
const pluginsPath = appPath => join(appPath, "plugins.js")
const accessLevelsPath = appPath => join(appPath, "access_levels.json")

const createAppPackage = (context, appPath) => {
  const appDefModule = require(appDefinitionPath(appPath))

  const pluginsModule = require(pluginsPath(appPath))

  const accessLevels = require(accessLevelsPath(appPath))

  return {
    appDefinition: appDefModule,
    behaviourSources: pluginsModule(context),
    appPath,
    accessLevels,
    ...publicPaths(appPath),
  }
}

const appPackageFolder = (config, appname) =>
  resolve(cwd(), config.latestPackagesFolder, appname)

module.exports.appPackageFolder = appPackageFolder

module.exports.appsFolder = config => appPackageFolder(config, "")

const applictionVersionPath = (context, appname, versionId) =>
  join(cwd(), getRuntimePackageDirectory(context, appname, versionId))

const publicPaths = appPath => ({
  mainUiPath: resolve(join(appPath, "public", "main")),
  unauthenticatedUiPath: resolve(join(appPath, "public", "unauthenticated")),
  sharedPath: resolve(join(appPath, "public", "_shared")),
})

module.exports.applictionVersionPublicPaths = (context, appname, versionId) => {
  const appPath = applictionVersionPath(context, appname, versionId)
  return publicPaths(appPath)
}

module.exports.applictionVersionPackage = async (
  context,
  appname,
  versionId,
  instanceKey
) => {
  const pkg = createAppPackage(
    context,
    applictionVersionPath(context, appname, versionId)
  )

  pkg.appDefinition = constructHierarchy(pkg.appDefinition)
  await injectPlugins(pkg, context.master, appname, instanceKey)
  return pkg
}

module.exports.deleteCachedPackage = (context, appname, versionId) => {
  const appPath = applictionVersionPath(context, appname, versionId)

  delete require.cache[resolve(appDefinitionPath(appPath))]
  delete require.cache[resolve(pluginsPath(appPath))]
  delete require.cache[resolve(accessLevelsPath(appPath))]
}
