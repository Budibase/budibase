const { readdir, stat, copyFile, ensureDir } = require("fs-extra")
const { constants } = require("fs")
const { join, basename } = require("path")

const packagesFolder = ".."

const jsFile = dir => join(dir, "budibase-client.js")
const jsMapFile = dir => join(dir, "budibase-client.js.map")
const sourceJs = jsFile("dist")
const sourceJsMap = jsMapFile("dist")

const appPackages = join(
  packagesFolder,
  "server",
  serverConfig.latestPackagesFolder
)

const publicMain = appName => join(appPackages, appName, "public", "main")
const publicUnauth = appName =>
  join(appPackages, appName, "public", "unauthenticated")

;(async () => {
  const apps = await readdir(appPackages)

  const copySource = file => async toDir => {
    await ensureDir(toDir)
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

  for (let app of apps) {
    if (app === ".data") continue
    if (!(await stat(join(appPackages, app))).isDirectory()) continue

    //await copySourceJs(nodeModules(app))
    //await copySourceJsMap(nodeModules(app))

    await copySourceJs(publicMain(app))
    await copySourceJsMap(publicMain(app))

    await copySourceJs(publicUnauth(app))
    await copySourceJsMap(publicUnauth(app))

    await copySource(join("dist", "budibase-client.esm.mjs"))(
      join(packagesFolder, "server", "builder")
    )
  }
})()
