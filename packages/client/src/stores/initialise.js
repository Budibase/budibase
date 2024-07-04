import { appStore } from "./app"
import { orgStore } from "./org"
import { routeStore } from "./routes"

export async function initialise() {
  await routeStore.actions.fetchRoutes()
  await appStore.actions.fetchAppDefinition()
  await orgStore.actions.init()
}
