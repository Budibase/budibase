#!/usr/bin/env node
// have to import this before anything else
import "./environment"
import { getCommands } from "./options"
import { Command } from "commander"
import { getHelpDescription, error } from "./utils"
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

const events = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"]
events.forEach(event => {
  process.on(event, (evt?: number) => {
    if (evt && !isNaN(evt)) {
      return
    }
    if (evt) {
      console.error(
        error(
          "Failed to run CLI command - please report with the following message:"
        )
      )
      console.error(error(evt))
    }
  })
})

init().catch(err => {
  console.error(`Unexpected error - `, err)
})
