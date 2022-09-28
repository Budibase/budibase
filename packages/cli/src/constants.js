const { Event } = require("@budibase/types")

exports.CommandWords = {
  BACKUPS: "backups",
  HOSTING: "hosting",
  ANALYTICS: "analytics",
  HELP: "help",
  PLUGIN: "plugins",
}

exports.InitTypes = {
  QUICK: "quick",
  DIGITAL_OCEAN: "do",
}

exports.AnalyticsEvents = {
  OptOut: "analytics:opt:out",
  OptIn: "analytics:opt:in",
  SelfHostInit: "hosting:init",
  PluginInit: Event.PLUGIN_INIT,
}

exports.POSTHOG_TOKEN = "phc_yGOn4i7jWKaCTapdGR6lfA4AvmuEQ2ijn5zAVSFYPlS"
