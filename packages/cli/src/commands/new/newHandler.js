const { xPlatHomeDir } = require("../../common")
const dotenv = require("dotenv")
const { copy, readJSON, writeJSON, exists } = require("fs-extra")
const { resolve, join } = require("path")
const chalk = require("chalk")
const { exec } = require("child_process")

module.exports = opts => {
  run(opts)
}

const run = async opts => {
  try {
    setup(opts)
    await createAppInstance(opts)
    await createEmptyAppPackage(opts)
    exec(`cd ${join(opts.dir, opts.applicationId)} && npm install`)
    console.log(chalk.green(`Budibase app ${opts.name} created!`))
  } catch (error) {
    console.error(
      chalk.red("Error creating new app", error)
    )
  }
}

const setup = opts => {
  opts.dir = xPlatHomeDir(opts.dir)
  process.env.BUDIBASE_DIR = opts.dir
  const bbconfig = dotenv.config({ path: resolve(opts.dir, ".env") })
  console.log(JSON.stringify(bbconfig))
}

const createAppInstance = async opts => {
  const createAppCtx = {
    params: { clientId: process.env.CLIENT_ID },
    request: {
      body: { name: opts.name },
    },
    body: {},
  }

  // this cannot be a top level require as it will cause
  // the environment module to be loaded prematurely
  const appController = require("@budibase/server/src/api/controllers/application")
  await appController.create(createAppCtx)

  opts.applicationId = createAppCtx.body._id
  console.log(chalk.green(`Application Created: ${createAppCtx.body._id}`))

  // this cannot be a top level require as it will cause
  // the environment module to be loaded prematurely
  const instanceController = require("@budibase/server/src/api/controllers/instance")
  const createInstCtx = {
    params: {
      clientId: process.env.CLIENT_ID
    },
    user: {
      appId: opts.applicationId
    },
    request: {
      body: { name: `dev-${process.env.CLIENT_ID}` },
    },
  }
  await instanceController.create(createInstCtx)

  console.log(chalk.green(`Default Instance Created`))
  console.log(JSON.stringify(createInstCtx.body))
}

const createEmptyAppPackage = async opts => {
  const templateFolder = resolve(__dirname, "appDirectoryTemplate")

  const appsFolder = opts.dir
  const newAppFolder = resolve(appsFolder, opts.applicationId)

  if (await exists(newAppFolder)) {
    console.log(chalk.red(`App ${opts.name} already exists.`))
    return
  }

  await copy(templateFolder, newAppFolder)

  const packageJsonPath = join(appsFolder, opts.applicationId, "package.json")
  const packageJson = await readJSON(packageJsonPath)

  packageJson.name = opts.name

  await writeJSON(packageJsonPath, packageJson)
}
