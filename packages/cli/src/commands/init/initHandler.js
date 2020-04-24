const inquirer = require("inquirer")
const { mkdir, exists, readFile, writeFile } = require("fs-extra")
const chalk = require("chalk")
const { serverFileName, getAppContext } = require("../../common")
const createClientDb = require("@budibase/server/db/createClientDb")
const { resolve } = require("path")
var Sqrl = require("squirrelly")

module.exports = opts => {
  run(opts)
}

const run = async opts => {
  try {
    await prompts(opts)
    await createClientDatabse(opts)
    await createDevConfig(opts)
    await createAppsDir(opts)
    await createDataFolder(opts)
    console.log(chalk.green("Budibase successfully initialised."))
  } catch (error) {
    console.error(`Error initialising Budibase: ${error.message}`)
  }
}

const prompts = async opts => {
  const questions = [
    {
      type: "input",
      name: "couchDbConnectionString",
      message: "CouchDB Connection String (e.g. https://user:password@localhost:5984): ",
      validate: function(value) {
        return !!value || "Please enter connection string"
      },
    },
  ]

  if (!opts.couchDbConnectionString) {
    const answers = await inquirer.prompt(questions)
    opts.couchDbConnectionString = answers.couchDbConnectionString
  }
}

const createClientDatabse = async opts => {

  if (opts.clientId === "new") {
    const existing = await CouchDb._add_dbs()

    let i = 0
    let isExisting = true
    while (isExisting) {
      i += 1
      clientId = i.toString()
      isExisting = existing.includes(`client-${clientId}`)
    }
  }

  opts.clientId = await createClientDb(opts.clientId)
}

const createAppsDir = async opts => {
  if (!(await exists(opts.configJson.latestPackagesFolder))) {
    await mkdir(opts.configJson.latestPackagesFolder)
  }
}

const createDataFolder = async opts => {
  const dataPath = opts.configJson.datastoreConfig.rootPath

  if (await exists(dataPath)) {
    const err = `The path ${opts.datapath} already exists - has budibase already been initialised? Remove the directory to try again.`
    throw new Error(err)
  }

  await mkdir(dataPath)
}

const createDevConfig = async opts => {
  const destConfigFile = "./config.js"
  let createConfig = !(await exists(destConfigFile))
  if (!createConfig) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "overwrite",
        message: "config.js already exists - overwrite? (N/y)",
      },
    ])
    createConfig = ["Y", "y", "yes"].includes(answers.overwrite)
  }

  if (createConfig) {
    const template = await readFile(serverFileName("config.js.template"))
    const config = Sqrl.Render(template, opts)
    await writeFile(destConfigFile, config)
  }

  opts.configJson = require(resolve("./config.js"))()
}
