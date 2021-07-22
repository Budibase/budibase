import { routeStore } from "./routes"
import { screenStore } from "./screens"
import { appStore } from "./app";

export async function initialise() {
  await routeStore.actions.fetchRoutes()
  await screenStore.actions.fetchScreens()
  await appStore.actions.fetchPackage()
}
