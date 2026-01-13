import { createTranslationDefinitions } from "./types"

const category = "login"

export const loginTranslations = createTranslationDefinitions(category, [
  {
    key: "emailLabel",
    name: "Login email label",
    defaultValue: "Your work email",
  },
  {
    key: "emailError",
    name: "Login email error",
    defaultValue: "Please enter a valid email",
  },
  {
    key: "passwordLabel",
    name: "Login password label",
    defaultValue: "Password",
  },
  {
    key: "passwordError",
    name: "Login password error",
    defaultValue: "Please enter your password",
  },
  {
    key: "invalidCredentials",
    name: "Login invalid credentials message",
    defaultValue: "Invalid credentials",
  },
  {
    key: "forgotPassword",
    name: "Forgot password link",
    defaultValue: "Forgot password?",
  },
])
