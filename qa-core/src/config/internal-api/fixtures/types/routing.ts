export interface RouteConfig {
  routes: Record<string, Route>
}

export interface Route {
  subpaths: Record<string, Subpath>
}

export interface Subpath {
  screens: ScreenRouteConfig
}

export interface ScreenRouteConfig {
  BASIC?: string
  POWER?: string
  ADMIN?: string
}
