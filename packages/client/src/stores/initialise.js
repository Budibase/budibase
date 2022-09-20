import { routeStore } from "./routes"
import { appStore } from "./app"
import { environmentStore } from "./environment"

export async function initialise() {
  await routeStore.actions.fetchRoutes()
  await appStore.actions.fetchAppDefinition()
  await environmentStore.actions.fetchEnvironment()
}
