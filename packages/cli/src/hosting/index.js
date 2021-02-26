const Command = require("../structures/Command")
const { CommandWords } = require("../constants")

async function init() {
  console.log("INIT")
}

async function start() {
  console.log("START")
}

async function stop() {
  console.log("STOP")
}

async function update() {
  console.log("UPDATE")
}

const command = new Command(`${CommandWords.HOSTING}`)
  .addHelp("Controls self hosting on the Budibase platform.")
  .addSubOption(
    "--init",
    "Configure a self hosted platform in current directory.",
    init
  )
  .addSubOption(
    "--start",
    "Start the configured platform in current directory.",
    start
  )
  .addSubOption(
    "--stop",
    "Stop the configured platform in the current directory.",
    stop
  )
  .addSubOption(
    "--update",
    "Updates the Budibase images to the latest version.",
    update
  )

exports.command = command
