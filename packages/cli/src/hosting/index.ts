import { Command } from "../structures/Command"
import { CommandWord } from "../constants"
import { init } from "./init"
import { start } from "./start"
import { stop } from "./stop"
import { status } from "./status"
import { update } from "./update"
import { generateUser } from "./genUser"
import { watchPlugins } from "./watch"

export default new Command(`${CommandWord.HOSTING}`)
  .addHelp("Controls self hosting on the Budibase platform.")
  .addSubOption(
    "--init [type]",
    "Configure a self hosted platform in current directory, type can be unspecified, 'quick' or 'single'.",
    init
  )
  .addSubOption(
    "--start",
    "Start the configured platform in current directory.",
    start
  )
  .addSubOption(
    "--status",
    "Check the status of currently running services.",
    status
  )
  .addSubOption(
    "--stop",
    "Stop the configured platform in the current directory.",
    stop
  )
  .addSubOption(
    "--update",
    "Update the Budibase images to the latest version.",
    update
  )
  .addSubOption(
    "--watch-plugin-dir [directory]",
    "Add plugin directory watching to a Budibase install.",
    watchPlugins
  )
  .addSubOption(
    "--gen-user",
    "Create an admin user automatically as part of first start.",
    generateUser
  )
  .addSubOption("--single", "Specify this with init to use the single image.")
