const { readdir, stat, copyFile } = require("fs-extra")
const { constants } = require("fs")
const { join, basename } = require("path")
const serverConfig = require("../../../server/config")()

const packagesFolder = ".."

const jsFile = dir => join(dir, "index.js")
const jsMapFile = dir => join(dir, "index.js.map")
const sourceJs = jsFile("dist")
const sourceJsMap = jsMapFile("dist")
const componentsFile = "components.json"

const appPackages = join(
  packagesFolder,
  "server",
  serverConfig.latestPackagesFolder
)

const publicMain = appName =>
  join(
    appPackages,
    appName,
    "public",
    "main",
    "lib",
    "node_modules",
    "@budibase",
    "standard-components"
  )
const publicUnauth = appName =>
  join(
    appPackages,
    appName,
    "public",
    "unauthenticated",
    "lib",
    "node_modules",
    "@budibase",
    "standard-components"
  )
const nodeModulesDist = appName =>
  join(
    appPackages,
    appName,
    "node_modules",
    "@budibase",
    "standard-components",
    "dist"
  )
const nodeModules = appName =>
  join(appPackages, appName, "node_modules", "@budibase", "standard-components")

;(async () => {
  const apps = await readdir(appPackages)

  const copySource = file => async toDir => {
    const dest = join(toDir, basename(file))
    try {
      await copyFile(file, dest, constants.COPYFILE_FICLONE)
      console.log(`COPIED ${file} to ${dest}`)
    } catch (e) {
      console.log(`COPY FAILED ${file} to ${dest}: ${e}`)
    }
  }

  const copySourceJs = copySource(sourceJs)
  const copySourceJsMap = copySource(sourceJsMap)
  const copyComponentsJson = copySource(componentsFile)

  for (let app of apps) {
    if (app === ".data") continue
    if (!(await stat(join(appPackages, app))).isDirectory()) continue

    await copySourceJs(nodeModulesDist(app))
    await copySourceJsMap(nodeModulesDist(app))

    await copyComponentsJson(nodeModules(app))

    await copySourceJs(join(publicMain(app), "dist"))
    await copySourceJsMap(join(publicMain(app), "dist"))

    await copySourceJs(join(publicUnauth(app), "dist"))
    await copySourceJsMap(join(publicUnauth(app), "dist"))
  }
})()
