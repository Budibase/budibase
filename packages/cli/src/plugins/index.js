const Command = require("../structures/Command")
const { CommandWords } = require("../constants")
const { getSkeleton, fleshOutSkeleton } = require("./skeleton")
const questions = require("../questions")
const fs = require("fs")

const PLUGIN_TYPES = ["component", "datasource"]

async function init(opts) {
  const type = opts["init"] || opts
  if (!type || !PLUGIN_TYPES.includes(type)) {
    console.error(
      "Please provide a type to init, either 'component' or 'datasource'."
    )
    return
  }
  console.log("Lets get some details about your new plugin:")
  const name = await questions.string("Name", `budibase-${type}`)
  if (fs.existsSync(name)) {
    console.error("Directory by plugin name already exists, pick a new name.")
    return
  }
  const desc = await questions.string(
    "Description",
    `An amazing Budibase ${type}!`
  )
  const version = await questions.string("Version", "1.0.0")
  // get the skeleton
  await getSkeleton(type, name)
  await fleshOutSkeleton(name, desc, version)
  console.log(`Plugin created in directory "${name}"`)
}

async function build() {}

const command = new Command(`${CommandWords.PLUGIN}`)
  .addHelp(
    "Custom plugins for Budibase, init, build and verify your components and datasources with this tool."
  )
  .addSubOption(
    "--init [type]",
    "Init a new plugin project, with a type of either component or datasource.",
    init
  )
  .addSubOption(
    "--build",
    "Build your plugin, this will verify and produce a final tarball for your project.",
    build
  )

exports.command = command
