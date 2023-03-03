import { Command } from "../structures/Command"
import { CommandWord } from "../constants"
import { success, error } from "../utils"
import { AnalyticsClient } from "./Client"

const client = new AnalyticsClient()

async function optOut() {
  try {
    // opt them out
    client.disable()
    console.log(
      success(
        "Successfully opted out of Budibase analytics. You can opt in at any time by running 'budi analytics opt-in'"
      )
    )
  } catch (err: any) {
    console.log(
      error(
        `Error opting out of Budibase analytics. Please try again later - ${err}`
      )
    )
  }
}

async function optIn() {
  try {
    // opt them in
    client.enable()
    console.log(
      success(
        "Successfully opted in to Budibase analytics. Thank you for helping us make Budibase better!"
      )
    )
  } catch (err) {
    console.log(
      error("Error opting in to Budibase analytics. Please try again later.")
    )
  }
}

async function status() {
  try {
    console.log(success(`Budibase analytics ${client.status()}`))
  } catch (err) {
    console.log(
      error("Error fetching analytics status. Please try again later.")
    )
  }
}

export default new Command(`${CommandWord.ANALYTICS}`)
  .addHelp("Control the analytics you send to Budibase.")
  .addSubOption("--optin", "Opt in to sending analytics to Budibase", optIn)
  .addSubOption("--optout", "Opt out of sending analytics to Budibase.", optOut)
  .addSubOption(
    "--status",
    "Check whether you are currently opted in to Budibase analytics.",
    status
  )
