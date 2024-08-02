import { routeStore } from "./routes"
import { appStore } from "./app"
import { orgStore } from "./org"
import { mediaStore } from "./media"

export async function initialise() {
  await routeStore.actions.fetchRoutes()
  await appStore.actions.fetchAppDefinition()
  await orgStore.actions.init()
  await mediaStore.actions.fetchMedia()
}
