import { routeStore } from "./routes"
import { appStore } from "./app"
import { orgStore } from "./org"
import { recaptchaStore } from "./recaptcha"
import { get } from "svelte/store"

export async function initialise() {
  await routeStore.actions.fetchRoutes()
  await appStore.actions.fetchAppDefinition()
  if (get(appStore).recaptchaKey) {
    await recaptchaStore.actions.checkVerified()
  }
  await orgStore.actions.init()
}
