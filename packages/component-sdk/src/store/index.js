import { createConfigStore } from "./config"
import { createAuthStore } from "./auth"
import { createRouteStore } from "./routes"
import { createScreenStore } from "./screens"

export const configStore = createConfigStore()
export const authStore = createAuthStore()
export const routeStore = createRouteStore()
export const screenStore = createScreenStore()
