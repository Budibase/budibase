#!/usr/bin/env node
require("./prebuilds")
require("./environment")
const json = require("../package.json")
const { getCommands } = require("./options")
const { Command } = require("commander")
const { getHelpDescription } = require("./utils")

// add hosting config
async function init() {
  const program = new Command()
    .addHelpCommand("help", getHelpDescription("Help with Budibase commands."))
    .helpOption(false)
    .version(json.version)
  // add commands
  for (let command of getCommands()) {
    command.configure(program)
  }
  // this will stop the program if no command found
  await program.parseAsync(process.argv)
}

init().catch(err => {
  console.error(`Unexpected error - `, err)
})
