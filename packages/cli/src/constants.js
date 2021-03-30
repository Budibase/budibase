exports.CommandWords = {
  HOSTING: "hosting",
  ANALYTICS: "analytics",
  HELP: "help",
}

exports.InitTypes = {
  QUICK: "quick",
  DIGITAL_OCEAN: "do",
}

exports.AnalyticsEvents = {
  OptOut: "analytics_opt_out",
  OptIn: "analytics_opt_in",
  SelfHostInit: "hosting_init"
}


exports.BUDIBASE_POSTHOG_URL = "https://posthog.budi.live"
exports.BUDIBASE_POSTHOG_TOKEN = process.env.BUDIBASE_POSTHOG_TOKEN