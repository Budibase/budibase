#!/usr/bin/env node
process.env.DISABLE_PINO_LOGGER = "1"
import "./prebuilds"
import "./environment"
import { getCommands } from "./options"
import { Command } from "commander"
import { getHelpDescription } from "./utils"
import { version } from "../package.json"

// add hosting config
async function init() {
  const program = new Command()
    .addHelpCommand("help", getHelpDescription("Help with Budibase commands."))
    .helpOption(false)
    .version(version)
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
