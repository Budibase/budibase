const inquirer = require("inquirer")
const { exists, readFile, writeFile, ensureDir } = require("fs-extra")
const chalk = require("chalk")
const { serverFileName, xPlatHomeDir } = require("../../common")
const { join } = require("path")
const Sqrl = require("squirrelly")
const uuid = require("uuid")

module.exports = opts => {
  return run(opts)
}

const run = async opts => {
  try {
    await ensureAppDir(opts)
    await setEnvironmentVariables(opts)
    await createClientDatabase(opts)
    await createDevEnvFile(opts)
    console.log(chalk.green("Budibase successfully initialised."))
  } catch (error) {
    console.error(`Error initialising Budibase: ${error.message}`)
  }
}

const setEnvironmentVariables = async opts => {
  if (opts.couchDbUrl) {
    process.env.COUCH_DB_URL = opts.couchDbUrl
  } else {
    const dataDir = join(opts.dir, ".data")
    await ensureDir(dataDir)
    process.env.COUCH_DB_URL =
      dataDir + (dataDir.endsWith("/") || dataDir.endsWith("\\") ? "" : "/")
  }
}

const ensureAppDir = async opts => {
  opts.dir = xPlatHomeDir(opts.dir)
  await ensureDir(opts.dir)
}

const createClientDatabase = async opts => {
  // cannot be a top level require as it
  // will cause environment module to be loaded prematurely
  const clientDb = require("@budibase/server/src/db/clientDb")

  if (opts.clientId === "new") {
    // cannot be a top level require as it
    // will cause environment module to be loaded prematurely
    const CouchDB = require("@budibase/server/src/db/client")
    const existing = await CouchDB.allDbs()

    let i = 0
    let isExisting = true
    while (isExisting) {
      i += 1
      opts.clientId = i.toString()
      isExisting = existing.includes(clientDb.name(opts.clientId))
    }
  }

  await clientDb.create(opts.clientId)
}

const createDevEnvFile = async opts => {
  const destConfigFile = join(opts.dir, "./.env")
  let createConfig = !(await exists(destConfigFile)) || opts.quiet
  if (!createConfig) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "overwrite",
        message: ".env already exists - overwrite? (N/y)",
      },
    ])
    createConfig = ["Y", "y", "yes"].includes(answers.overwrite)
  }

  if (createConfig) {
    const template = await readFile(serverFileName(".env.template"), {
      encoding: "utf8",
    })
    opts.adminSecret = uuid.v4()
    opts.cookieKey1 = uuid.v4()
    opts.cookieKey2 = uuid.v4()
    const config = Sqrl.Render(template, opts)
    await writeFile(destConfigFile, config, { flag: "w+" })
  }
}
