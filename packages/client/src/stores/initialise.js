import { routeStore } from "./routes"
import { appStore } from "./app"
import { orgStore } from "./org"

export async function initialise() {
  await routeStore.actions.fetchRoutes()
  await appStore.actions.fetchAppDefinition()
  await orgStore.actions.init()
}
