import { createTranslationDefinitions } from "./types"

const category = "userMenu"

export const userMenuTranslations = createTranslationDefinitions(category, [
  {
    key: "profile",
    fullKey: "profile",
    name: "User menu profile label",
    defaultValue: "My profile",
  },
  {
    key: "password",
    fullKey: "password",
    name: "User menu password label",
    defaultValue: "Update password",
  },
  {
    key: "portal",
    fullKey: "portal",
    name: "User menu portal label",
    defaultValue: "Go to portal",
  },
  {
    key: "logout",
    fullKey: "logout",
    name: "User menu logout label",
    defaultValue: "Log out",
  },
])
