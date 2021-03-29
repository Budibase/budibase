const PostHog = require("posthog-node")
const Command = require("../structures/Command")
const { CommandWords, InitTypes } = require("../constants")
const { lookpath } = require("lookpath")
const {
  downloadFile,
  logErrorToFile,
  success,
  info,
  parseEnv,
} = require("../utils")
const { confirmation } = require("../questions")
const fs = require("fs")
// const makeEnv = require("./makeEnv")
const axios = require("axios")

const Events = {
  OptOut: "opt_out",
  OptIn: "opt_in",
}

class AnalyticsClient {
  constructor() {
    this.client = new PostHog("Oeq9KzIpZYaNsXIvHw5QTZWNpfiG_EOjAOpjTyAiitY", { host: "https://posthog.budi.live" })
  }

  capture() {
    if (!enabled) return

    this.client.capture({
      event: Events.OptOut
    })
  }

  enable() {
    this.disabled = false
  }

  disable() {
    this.disabled = true
  }

  status() {
    return this.disabled ? "disabled" : "enabled"
  }
}

class BudibaseConfig {
  constructor(config) {
    this.config = config
  }

  write() {
    // fs.wri
  }
}

const client = new AnalyticsClient()


async function optOut() {
  client.capture({ event: Events.OptOut })
  client.disable()
  try {
    // opt them out
    console.log(success("Successfully opted out of budibase analytics. You can opt in at any time by running 'budi analytics opt-in'"))
  } catch (err) { 
    console.log(error("Error opting out of budibase analytics. Please try again later."))
  }
}

async function optIn() {
  try {
    // opt them in
    client.enable()
    client.capture({ event: Events.OptIn })
    console.log(success("Successfully opted in of budibase analytics. Thank you for helping us make budibase better!"))
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
