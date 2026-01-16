import { createTranslationDefinitions } from "./types"

const category = "forgotPassword"

export const forgotPasswordTranslations = createTranslationDefinitions(
  category,
  [
    {
      key: "heading",
      name: "Forgot password heading",
      defaultValue: "Forgot your password?",
    },
    {
      key: "description",
      name: "Forgot password description",
      defaultValue: "Enter your email to receive reset instructions.",
    },
    {
      key: "emailLabel",
      name: "Forgot password email label",
      defaultValue: "Your work email",
    },
    {
      key: "emailError",
      name: "Forgot password email error",
      defaultValue: "Please enter a valid email",
    },
    {
      key: "submit",
      name: "Forgot password submit button",
      defaultValue: "Send reset email",
    },
    {
      key: "success",
      name: "Forgot password success notification",
      defaultValue: "If that account exists, we'll send a reset email shortly.",
    },
  ]
)
