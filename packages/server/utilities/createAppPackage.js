const { resolve, join } = require("path")
const constructHierarchy = require("./constructHierarchy")
const { common } = require("@budibase/core")
const { getRuntimePackageDirectory } = require("../utilities/runtimePackages")
const injectPlugins = require("./injectedPlugins")
const { cwd } = require("process")

const createAppPackage = (context, appPath) => {
  const appDefModule = require(join(appPath, "appDefinition.json"))

  const pluginsModule = require(join(appPath, "plugins.js"))

  const accessLevels = require(join(appPath, "access_levels.json"))

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

module.exports.masterAppPackage = context => {
  const { config } = context
  const standardPackage = createAppPackage(
    context,
    `${__dirname}/../appPackages/_master`
  )

  const customizeMaster =
    config && config.customizeMaster ? config.customizeMaster : a => a

  const appDefinition = common.$(standardPackage.appDefinition, [
    customizeMaster,
    constructHierarchy,
  ])

  const plugins = standardPackage.behaviourSources

  return {
    appDefinition,
    behaviourSources:
      config && config.extraMasterPlugins
        ? { ...plugins, ...config.extraMasterPlugins }
        : plugins,
    appPath: standardPackage.appPath,
    unauthenticatedUiPath: standardPackage.unauthenticatedUiPath,
    mainUiPath: standardPackage.mainUiPath,
    sharedPath: standardPackage.sharedPath,
  }
}

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
