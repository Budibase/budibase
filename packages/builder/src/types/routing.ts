import { ComponentType } from "svelte"
import { SvelteComponent } from "svelte"

export interface Routing {
  params?: Record<string, any>
}

export const enum Target {
  Self = "_self",
  Blank = "_blank",
}

export interface RouteHREF {
  url: string
  target: Target
}

export const isRouteHREF = (href: string | RouteHREF): href is RouteHREF => {
  return typeof href === "object" && href !== null && "url" in href
}

export const isSettingIcon = (
  icon: string | RouteIcon | undefined
): icon is RouteIcon => {
  return typeof icon === "object" && icon && "comp" in icon && "props" in icon
}

export interface RouteIcon {
  props: Record<string, any>
  comp: typeof SvelteComponent<any>
}

export interface Route {
  path?: string
  comp?: ComponentType | undefined
  routes?: Route[]
  section?: string
  title?: string
  icon?: string | RouteIcon
  new?: boolean
  access?: () => boolean
  href?: string | RouteHREF
  keys?: string[] // e.g path/to/:userId > ["userId"]
  group?: string
  color?: string // for highlighting

  nav?: Route[]
  regex?: RegExp
  crumbs?: Route[]
}

// Used to store route and metadata when parsed
export interface MatchedRoute {
  entry: Route
  params: Record<string, any>
}

export const buildRoute = (pattern: string) => {
  const keys: string[] = []
  const regexStr = pattern.replace(/:([^/]+)/g, (_, key) => {
    keys.push(key)
    return "([^/]+)"
  })
  const regex = new RegExp(`^${regexStr}$`)
  return { regex, keys }
}

export const flatten = (
  routeConfig: Route[],
  basePath = "",
  section?: string,
  trail: Route[] = []
): Route[] => {
  return routeConfig.reduce((acc: Route[], entry: Route) => {
    // Slash is prefixed here on the entry.path
    const currentPath = `${basePath}${entry.path ? `/${entry.path}` : ""}`

    // Clone the current entry with resolved full path
    const crumb: Route = {
      title: entry.title,
      path: currentPath,
    }

    // Only include it in trail if it has a title
    const currentTrail = entry.title ? [...trail, crumb] : trail

    let children: Route[] = []
    let nav: Route[] = []

    if (entry.routes) {
      // Navigation sibling pages at this level - should have a comp defined
      const pageSiblings = entry.routes.filter(r => r.comp)

      // Build nav only if there is more than one sibling page
      nav =
        pageSiblings.length > 1
          ? pageSiblings.map(r => ({
              path: `${currentPath}/${r.path}`,
              new: r.new,
              title: r.title,
            }))
          : []

      const childRoutes = flatten(
        entry.routes,
        currentPath,
        section || entry.section,
        currentTrail
      )

      // Add the sibling routes for the UI
      children = childRoutes.map(child => {
        if (!child.nav) {
          return { ...child, nav }
        }
        return child
      })

      acc = [...acc, ...children]
    }

    // Presense of a component means that this is a renderable page
    if (entry.comp) {
      const { regex, keys } = buildRoute(currentPath)

      acc.push({
        comp: entry.comp,
        regex,
        keys,
        path: currentPath,
        section: section || entry.section,
        crumbs: currentTrail,
      })
    }

    return acc
  }, [])
}

export const match = (path: string, routes: Route[]) => {
  if (!routes) {
    console.error("Router: No configured routes.")
    return null
  }

  for (const entry of routes) {
    const { regex, keys } = entry
    if (!regex) {
      console.error("Router: No valid regex for entry")
      continue
    }
    const match = path.match(regex)
    if (match) {
      if (match.length - 1 !== keys?.length) {
        console.error("Router: Mismatch between regex groups and keys", {
          path,
          match,
          keys,
        })
        continue
      }

      const params = Object.fromEntries(
        (keys || []).map((key: string, i: number) => [key, match[i + 1]])
      )
      return { entry, params }
    }
  }
}
