import { createTranslationDefinitions } from "./types"

const category = "recaptcha"

export const recaptchaTranslations = createTranslationDefinitions(category, [
  {
    key: "prompt",
    name: "Prompt",
    defaultValue: "Human verification step required to continue.",
  },
  {
    key: "submit",
    name: "Submit button",
    defaultValue: "Submit",
  },
  {
    key: "error",
    name: "Error message",
    defaultValue: "Recaptcha verification failed, please try again",
  },
])
