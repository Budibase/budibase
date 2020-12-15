import { routeStore } from "./routes"
import { screenStore } from "./screens"

export async function initialise() {
  await routeStore.actions.fetchRoutes()
  await screenStore.actions.fetchScreens()
}
