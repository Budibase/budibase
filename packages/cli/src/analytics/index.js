const Command = require("../structures/Command")
const { CommandWords, InitTypes, BUDIBASE_POSTHOG_URL } = require("../constants")
const { lookpath } = require("lookpath")
const {
  success,
  error,
  info,
  parseEnv,
} = require("../utils")
const { confirmation } = require("../questions")
const fs = require("fs")
const axios = require("axios")
const AnalyticsClient = require("./Client")

const client = new AnalyticsClient()

async function optOut() {
  try {
    // opt them out
    client.disable()
    console.log(success("Successfully opted out of budibase analytics. You can opt in at any time by running 'budi analytics opt-in'"))
  } catch (err) { 
    console.log(error("Error opting out of budibase analytics. Please try again later.", err))
  }
}

async function optIn() {
  try {
    // opt them in
    client.enable()
    console.log(success("Successfully opted in to budibase analytics. Thank you for helping us make budibase better!"))
  } catch (err) { 
    console.log(error("Error opting in to budibase analytics. Please try again later."))
  }
}

async function status() {
  try {
    console.log(success(`Budibase analytics ${client.status()}`))
  } catch (err) {
    console.log(error("Error fetching analytics status. Please try again later."))
  }
}


const command = new Command(`${CommandWords.ANALYTICS}`)
  .addHelp("Control the analytics you send to budibase.")
  .addSubOption(
    "--optin",
    "Opt in to sending analytics to budibase",
    optIn
  )
  .addSubOption(
    "--optout",
    "Opt out of sending analytics to budibase.",
    optOut
  )
  .addSubOption(
    "--status",
    "Check whether you are currently opted in to budibase analytics.",
    status
  )

exports.command = command
