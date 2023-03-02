import { Event } from "../events"

export enum CommandWord {
  BACKUPS = "backups",
  HOSTING = "hosting",
  ANALYTICS = "analytics",
  HELP = "help",
  PLUGIN = "plugins",
}

export enum InitType {
  QUICK = "quick",
  DIGITAL_OCEAN = "do",
}

export const AnalyticsEvent = {
  OptOut: "analytics:opt:out",
  OptIn: "analytics:opt:in",
  SelfHostInit: "hosting:init",
  PluginInit: Event.PLUGIN_INIT,
}
