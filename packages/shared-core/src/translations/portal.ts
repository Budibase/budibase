import { createTranslationDefinitions } from "./types"

const category = "portal"

export const portalTranslations = createTranslationDefinitions(category, [
  {
    key: "greeting",
    name: "Greeting heading",
    defaultValue: "Hey {{name}}",
  },
  {
    key: "intro",
    name: "Introductory body",
    defaultValue:
      "Welcome to the {{company}} portal. Below you'll find the list of apps that you have access to.",
  },
  {
    key: "offlineHeading",
    name: "Offline heading",
    defaultValue: "Your apps are currently offline.",
  },
  {
    key: "offlineDescription",
    name: "Offline description",
    defaultValue: "Please contact the account holder to get them back online.",
  },
  {
    key: "appsHeading",
    name: "Apps heading",
    defaultValue: "Apps",
  },
  {
    key: "updatedAgo",
    name: "Updated duration label",
    defaultValue: "Updated {{ duration time 'millisecond' }} ago",
  },
  {
    key: "neverUpdated",
    name: "Never updated label",
    defaultValue: "Never updated",
  },
  {
    key: "noAppsHeading",
    name: "No apps heading",
    defaultValue: "You don't have access to any apps yet.",
  },
  {
    key: "noAppsDescription",
    name: "No apps description",
    defaultValue: "The apps you have access to will be listed here.",
  },
])
