const { xPlatHomeDir } = require("../../common")
const dotenv = require("dotenv")
const createInstance = require("@budibase/server/api/controllers/instance").create
const createApplication = require("@budibase/server/api/controllers/application").create
const { copy, readJSON, writeJSON, remove, exists } = require("fs-extra")
const { resolve, join } = require("path")
const chalk = require("chalk")
const { exec } = require("child_process")

module.exports = opts => {
  run(opts)
  console.log(chalk.green(`Budibase app ${opts.name} created!`))
}

const run = async opts => {
  console.log(opts);
  try {
    opts.dir = xPlatHomeDir(opts.dir)
    process.chdir(opts.dir)
    dotenv.config()
    await createAppInstance(opts)
    await createEmptyAppPackage(opts)
    exec(`cd ${join(opts.dir, opts.applicationId)} && npm install`)
  } catch (error) {
    console.error(chalk.red("Error creating new app", error));
  }
}

const createAppInstance = async opts => {
  const createAppCtx = {
    params: { clientId: process.env.CLIENT_ID },
    request: {
      body: { name: opts.name },
    },
    body: {},
  }

  await createApplication(createAppCtx)
  opts.applicationId = createAppCtx.body.id
  await createInstance({
    params: {
      clientId: process.env.CLIENT_ID,
      applicationId: opts.applicationId,
    },
    request: {
      body: { name: `dev-${process.env.CLIENT_ID}` },
    },
  })
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

  const removePlaceholder = async (...args) => {
    await remove(join(newAppFolder, ...args, "placeholder"))
  }

  await removePlaceholder("pages", "main", "screens")
  await removePlaceholder("pages", "unauthenticated", "screens")
  await removePlaceholder("public", "shared")
  await removePlaceholder("public", "main")
  await removePlaceholder("public", "unauthenticated")
}
