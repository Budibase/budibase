import { Constants } from "@budibase/frontend-core"

export const getRouteWithoutQueryParams = route => {
  if (!route) {
    return route
  }
  try {
    return new URL(route, "http://localhost").pathname
  } catch (error) {
    return route
  }
}

export const isInternal = url => {
  return url?.startsWith("/")
}

export const ensureExternal = url => {
  if (!url?.length) {
    return url
  }
  return !url.startsWith("http") ? `http://${url}` : url
}

export const enrichNavItem = navItem => {
  const internalLink = isInternal(navItem.url)
  return {
    ...navItem,
    internalLink,
    url: internalLink ? navItem.url : ensureExternal(navItem.url),
  }
}

export const canAccessSubLink = (subLink, accessibleRoutes) => {
  const url = subLink?.url
  if (!url) {
    return false
  }

  // We can only reliably validate static internal routes here.
  if (!isInternal(url) || url.includes("{{")) {
    return true
  }

  return accessibleRoutes.has(getRouteWithoutQueryParams(url))
}

export const enrichNavItems = (
  navItems,
  userRoleHierarchy,
  routeEntries = []
) => {
  if (!navItems?.length) {
    return []
  }
  const accessibleRoutes = new Set(routeEntries.map(route => route.path))

  return navItems
    .filter(navItem => {
      // Strip nav items without text
      if (!navItem.text) {
        return false
      }

      // Strip out links without URLs
      if (navItem.type !== "sublinks" && !navItem.url) {
        return false
      }

      // Filter to only links allowed by the current role
      const role = navItem.roleId || Constants.Roles.BASIC
      return userRoleHierarchy?.find(roleId => roleId === role)
    })
    .map(navItem => {
      const enrichedNavItem = enrichNavItem(navItem)
      if (navItem.type === "sublinks" && navItem.subLinks?.length) {
        enrichedNavItem.subLinks = navItem.subLinks
          .filter(
            subLink =>
              subLink.text && canAccessSubLink(subLink, accessibleRoutes)
          )
          .map(enrichNavItem)
      }
      return enrichedNavItem
    })
}
