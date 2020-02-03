const { getAppContext } = require("../../common")
const {
  getMasterApisWithFullAccess,
} = require("@budibase/server/utilities/budibaseApi")
const { copy, readJSON, writeJSON, remove, exists } = require("fs-extra")
const { resolve, join } = require("path")
const thisPackageJson = require("../../../package.json")
const chalk = require("chalk")
const { exec } = require("child_process")

module.exports = opts => {
  run(opts)
  console.log(chalk.green(`Budibase app ${opts.name} created!`))
}

const run = async opts => {
  const context = await getAppContext({
    configName: opts.config,
    masterIsCreated: true,
  })
  opts.config = context.config
  const bb = await getMasterApisWithFullAccess(context)

  const app = bb.recordApi.getNew("/applications", "application")
  app.name = opts.name

  await bb.recordApi.save(app)
  await createEmptyAppPackage(opts)

  exec(`cd ${join(opts.config.latestPackagesFolder, opts.name)} && npm install`)
}

const createEmptyAppPackage = async opts => {
  const templateFolder = resolve(__dirname, "appPackageTemplate")

  const appsFolder = opts.config.latestPackagesFolder || "."
  const destinationFolder = resolve(appsFolder, opts.name)

  if (await exists(destinationFolder)) return

  await copy(templateFolder, destinationFolder)

  const packageJsonPath = join(appsFolder, opts.name, "package.json")
  const packageJson = await readJSON(packageJsonPath)

  packageJson.name = opts.name
  packageJson.dependencies[
    "@budibase/standard-components"
  ] = `^${thisPackageJson.version}`

  await writeJSON(packageJsonPath, packageJson)

  const removePlaceholder = async (...args) => {
    await remove(join(destinationFolder, ...args, "placeholder"))
  }

  await removePlaceholder("components")
  await removePlaceholder("public", "shared")
  await removePlaceholder("public", "main")
  await removePlaceholder("public", "unauthenticated")
}
