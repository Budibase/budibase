#!/usr/bin/env node
import "./prebuilds"
import "./environment"
import { env, logging } from "@budibase/backend-core"
logging.disableLogger()
import { getCommands } from "./options"
import { Command } from "commander"
import { getHelpDescription } from "./utils"

// add hosting config
async function init() {
  const program = new Command()
    .addHelpCommand("help", getHelpDescription("Help with Budibase commands."))
    .helpOption(false)
    .version(env.VERSION)
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
