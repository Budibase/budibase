import { routeStore } from "./routes"
import { appStore } from "./app"

export async function initialise() {
  await routeStore.actions.fetchRoutes()
  await appStore.actions.fetchAppDefinition()
}
