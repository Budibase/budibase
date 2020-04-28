const inquirer = require("inquirer")
const { exists, readFile, writeFile, ensureDir } = require("fs-extra")
const chalk = require("chalk")
const { serverFileName, xPlatHomeDir } = require("../../common")
const { join } = require("path")
const initialiseClientDb = require("@budibase/server/db/initialiseClientDb")
const Sqrl = require("squirrelly")
const uuid = require("uuid")
const CouchDB = require("@budibase/server/db/client")

module.exports = opts => {
  run(opts)
}

const run = async opts => {
  try {
    await ensureAppDir(opts)
    await prompts(opts)
    await createClientDatabase(opts)
    await createDevEnvFile(opts)
    console.log(chalk.green("Budibase successfully initialised."))
  } catch (error) {
    console.error(`Error initialising Budibase: ${error.message}`)
  }
}

const ensureAppDir = async opts => {
  opts.dir = xPlatHomeDir(opts.dir)
  await ensureDir(opts.dir)

  if (opts.database === "local") {
    const dataDir = join(opts.dir, ".data")
    await ensureDir(dataDir)
    process.env.COUCH_DB_URL =
      dataDir + (dataDir.endsWith("/") || dataDir.endsWith("\\") ? "" : "/")
  }
}

const prompts = async opts => {
  const questions = [
    {
      type: "input",
      name: "couchDbUrl",
      message:
        "CouchDB Connection String (e.g. https://user:password@localhost:5984): ",
      validate: function(value) {
        return !!value || "Please enter connection string"
      },
    },
  ]

  if (opts.database === "remote" && !opts.couchDbUrl) {
    const answers = await inquirer.prompt(questions)
    opts.couchDbUrl = answers.couchDbUrl
  }
}

const createClientDatabase = async opts => {
  if (opts.clientId === "new") {
    const existing = await CouchDB.allDbs()

    let i = 0
    let isExisting = true
    while (isExisting) {
      i += 1
      opts.clientId = i.toString()
      isExisting = existing.includes(`client-${opts.clientId}`)
    }
  }

  const db = new CouchDB(`client-${opts.clientId}`)
  await initialiseClientDb(db)
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
